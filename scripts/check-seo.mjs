import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

// Run against a completed build made with the same SITE_URL / URL and CONTEXT.
const configuredOrigin = process.env.SITE_URL || process.env.URL;
const expectedOrigin = configuredOrigin ? new URL(configuredOrigin).origin : undefined;
const preview = Boolean(process.env.CONTEXT && process.env.CONTEXT !== 'production');
const manifest = JSON.parse(await readFile('.next/prerender-manifest.json', 'utf8'));
const paths = Object.keys(manifest.routes).filter(path =>
  !['/robots.txt', '/sitemap.xml', '/find-a-doctor'].includes(path)
  && !path.startsWith('/_')
);
const conditionPaths = paths.filter(path => path.startsWith('/conditions/'));
assert.equal(conditionPaths.length, 27, 'Generate every known condition');
assert.equal(manifest.dynamicRoutes['/conditions/[slug]'].fallback, false);

const portReservation = createServer();
await new Promise(resolve => portReservation.listen(0, '127.0.0.1', resolve));
const { port } = portReservation.address();
await new Promise(resolve => portReservation.close(resolve));
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], { stdio: ['ignore', 'pipe', 'pipe'] });
const origin = `http://127.0.0.1:${port}`;
let logs = '';
server.stdout.on('data', chunk => { logs += chunk; });
server.stderr.on('data', chunk => { logs += chunk; });

function decode(value) {
  return value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#x27;', "'").replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>');
}
function attribute(tag, name) {
  return decode(tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] || '');
}
function meta(html, key, field = 'name') {
  return [...html.matchAll(/<meta\b[^>]*>/g)].map(match => match[0])
    .filter(tag => attribute(tag, field) === key).map(tag => attribute(tag, 'content'));
}
function normalizedPath(path) { return decodeURIComponent(path); }
async function get(path) {
  return fetch(origin + path, { redirect: 'manual', signal: AbortSignal.timeout(10000) });
}

try {
  let ready = false;
  for (let attempt = 0; attempt < 75; attempt++) {
    if (server.exitCode !== null) throw new Error(logs);
    try { ready = (await get('/')).ok; } catch { /* server is still starting */ }
    if (ready) break;
    await delay(200);
  }
  assert.ok(ready, `Production server did not start: ${logs}`);
  const titles = new Set();
  const descriptions = new Set();
  let homepage = '';
  for (const path of paths) {
    const response = await get(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    if (path === '/') homepage = html;
    const titleTags = [...html.matchAll(/<title>([\s\S]*?)<\/title>/g)];
    assert.equal(titleTags.length, 1, `${path}: one title`);
    const title = decode(titleTags[0][1]);
    assert.ok(title.endsWith(' | MyVeta Health'), `${path}: branded title`);
    assert.ok(!titles.has(title), `${path}: unique title`);
    titles.add(title);
    const description = meta(html, 'description');
    assert.equal(description.length, 1, `${path}: one description`);
    assert.ok(description[0].length > 30, `${path}: useful description`);
    assert.ok(!descriptions.has(description[0]), `${path}: unique description`);
    descriptions.add(description[0]);
    assert.deepEqual(meta(html, 'og:title', 'property'), [title], `${path}: Open Graph title`);
    assert.deepEqual(meta(html, 'og:description', 'property'), description);
    assert.deepEqual(meta(html, 'twitter:title'), [title]);
    const canonicalTags = [...html.matchAll(/<link\b[^>]*>/g)].map(m => m[0]).filter(tag => attribute(tag, 'rel') === 'canonical');
    assert.equal(canonicalTags.length, expectedOrigin ? 1 : 0, `${path}: canonical count`);
    if (expectedOrigin) {
      const canonical = new URL(attribute(canonicalTags[0], 'href'));
      assert.equal(canonical.origin, expectedOrigin);
      assert.equal(normalizedPath(canonical.pathname), normalizedPath(path));
      assert.equal(canonical.search + canonical.hash, '');
    }
    const robots = meta(html, 'robots').join(',');
    assert.equal(robots.includes('noindex'), preview || path === '/subscribe', `${path}: indexing policy`);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${path}: one main heading`);
    assert.ok(!html.includes('/admin') && !html.includes('signin-with-chatgpt'), `${path}: no missing account links`);
  }

  const robots = await (await get('/robots.txt')).text();
  assert.ok(robots.includes('Allow: /') && robots.includes('Disallow: /api/'));
  assert.equal(robots.includes('Sitemap:'), Boolean(expectedOrigin && !preview));
  const sitemap = await (await get('/sitemap.xml')).text();
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(decode(m[1])));
  const expectedPaths = expectedOrigin && !preview ? paths.filter(path => path !== '/subscribe') : [];
  assert.equal(urls.length, expectedPaths.length, 'Sitemap count');
  assert.deepEqual(urls.map(url => normalizedPath(url.pathname)).sort(), expectedPaths.map(normalizedPath).sort());
  assert.ok(urls.every(url => url.origin === expectedOrigin));
  for (const path of ['/conditions/hiv-%26-aids', '/conditions/crohn%27s-disease']) {
    assert.equal((await get(path)).status, 200, `${path}: encoded legacy URL`);
  }
  for (const path of ['/conditions/definitely-not-a-condition', '/this-page-does-not-exist']) {
    assert.equal((await get(path)).status, 404, `${path}: real 404`);
  }
  const referral = await get('/find-a-doctor');
  assert.equal(referral.status, 307, 'Intentional doctor referral still redirects');
  const referralConfig = await readFile('app/config/doctorReferral.ts', 'utf8');
  const referralDestination = referralConfig.match(/^export const DOCTOR_WEBSITE_URL\s*=\s*["']([^"']+)["']/m)?.[1];
  assert.ok(referralDestination, 'Doctor destination is configured');
  assert.equal(referral.headers.get('location'), referralDestination);
  assert.ok(!homepage.includes('<iframe') && !homepage.includes('referral-hotspot'));
  const schemas = [...homepage.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(m => JSON.parse(m[1]));
  assert.equal(schemas.length, expectedOrigin && !preview ? 1 : 0);
  if (schemas.length) {
    assert.equal(schemas[0]['@type'], 'WebSite');
    assert.equal(schemas[0].name, 'MyVeta Health');
    assert.equal(new URL(schemas[0].url).origin, expectedOrigin);
  }
  const photoTags = [...homepage.matchAll(/<img\b[^>]*>/g)].map(m => m[0]).filter(tag => attribute(tag, 'src').startsWith('/_next/image'));
  assert.ok(photoTags.length >= 8, 'Homepage uses responsive image delivery');
  assert.ok(photoTags.every(tag => attribute(tag, 'srcSet') && attribute(tag, 'sizes')));
  assert.ok(homepage.includes('imageSrcSet='), 'Hero image is preloaded');
  const optimized = await fetch(origin + '/_next/image?url=%2Fimages%2Fsenior-wellness.png&w=640&q=75', { headers: { Accept: 'image/webp' } });
  assert.equal(optimized.status, 200);
  assert.ok(optimized.headers.get('content-type')?.includes('image/webp'));
  const optimizedBytes = (await optimized.arrayBuffer()).byteLength;
  const originalBytes = (await readFile('public/images/senior-wellness.png')).byteLength;
  assert.ok(optimizedBytes < originalBytes, 'Responsive image is smaller than its source');
  console.log(`PASS: ${paths.length} content pages, ${urls.length} sitemap URLs, canonical and indexing checks (${preview ? 'preview' : expectedOrigin ? 'production' : 'no configured origin'}).`);
  console.log(`PASS: unknown URLs return 404; explicit referral works; responsive hero is ${optimizedBytes} bytes versus ${originalBytes} source bytes.`);
} finally {
  server.kill('SIGTERM');
  await new Promise(resolve => {
    if (server.exitCode !== null) return resolve();
    server.once('exit', resolve);
    setTimeout(() => { server.kill('SIGKILL'); resolve(); }, 3000).unref();
  });
}
