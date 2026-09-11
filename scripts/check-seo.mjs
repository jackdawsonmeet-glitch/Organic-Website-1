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
const articlePaths = paths.filter(path => path.startsWith('/health-news/'));
assert.equal(articlePaths.length, 7, 'Generate the seven complete health guides');
assert.equal(manifest.dynamicRoutes['/health-news/[slug]'].fallback, false);

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
  return decode(tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'))?.[1] || '');
}
function meta(html, key, field = 'name') {
  return [...html.matchAll(/<meta\b[^>]*>/g)].map(match => match[0])
    .filter(tag => attribute(tag, field) === key).map(tag => attribute(tag, 'content'));
}
function normalizedPath(path) { return decodeURIComponent(path); }
function jsonLd(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(match => JSON.parse(match[1]));
}
function links(html) {
  return [...html.matchAll(/<a\b[^>]*>/g)].map(match => attribute(match[0], 'href'));
}
function plainText(html) { return decode(html.replace(/<[^>]*>/g, '')).trim(); }
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
  const pages = new Map();
  let homepage = '';
  for (const path of paths) {
    const response = await get(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    pages.set(normalizedPath(path), html);
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

    const schemas = jsonLd(html);
    const breadcrumbs = schemas.filter(schema => schema['@type'] === 'BreadcrumbList');
    const breadcrumbNav = html.match(/<nav\b[^>]*aria-label="Breadcrumb"[^>]*>(.*?)<\/nav>/)?.[1];
    assert.equal(breadcrumbs.length, breadcrumbNav && expectedOrigin && !preview ? 1 : 0, `${path}: breadcrumb markup policy`);
    if (breadcrumbs.length) {
      const items = breadcrumbs[0].itemListElement;
      const visibleNames = [...breadcrumbNav.matchAll(/<li\b[^>]*>(.*?)<\/li>/g)].map(match => plainText(match[1]));
      assert.deepEqual(items.map(item => item.name), visibleNames, `${path}: breadcrumbs match visible navigation`);
      assert.deepEqual(items.map(item => item.position), items.map((_, index) => index + 1));
      assert.ok(items.every(item => new URL(item.item).origin === expectedOrigin));
      assert.equal(normalizedPath(new URL(items.at(-1).item).pathname), normalizedPath(path));
    }

    if (articlePaths.includes(path)) {
      const body = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1];
      assert.ok(body && plainText(body).split(/\s+/).length > 250, `${path}: full readable guide`);
      assert.ok(body.includes('AI-assisted educational guide; not independently medically reviewed.'));
      assert.deepEqual(meta(html, 'og:type', 'property'), ['article']);
      const articles = schemas.filter(schema => schema['@type'] === 'Article');
      assert.equal(articles.length, expectedOrigin && !preview ? 1 : 0);
      if (articles.length) {
        const article = articles[0];
        assert.equal(article.headline, plainText(html.match(/<h1\b[^>]*>(.*?)<\/h1>/)[1]));
        assert.equal(article.description, description[0]);
        assert.equal(article.url, expectedOrigin + path);
        assert.equal(article.mainEntityOfPage['@id'], article.url);
        assert.equal(article.author.name, 'MyVeta Health');
        assert.equal(article.author['@type'], 'Organization');
        assert.ok(links(html).includes('/about'), 'Visible publisher attribution');
        assert.ok(article.citation.length >= 2 && article.citation.every(url => links(body).includes(url)), `${path}: sources appear in the guide`);
        assert.ok(!article.datePublished && !article.dateModified && !article.reviewedBy, 'No unverified publication or medical review claims');
      }
    }
  }

  // Check real rendered links, including table-of-contents and cross-page anchors.
  for (const [path, html] of pages) {
    for (const href of links(html)) {
      assert.ok(href && href !== '#', `${path}: no empty links`);
      const destination = new URL(href, origin + path);
      if (destination.origin !== origin || destination.pathname === '/find-a-doctor') continue;
      const target = pages.get(normalizedPath(destination.pathname));
      assert.ok(target, `${path}: internal link ${href} reaches a generated page`);
      if (destination.hash) {
        const ids = [...target.matchAll(/\bid="([^"]+)"/g)].map(match => decode(match[1]));
        assert.ok(ids.includes(decodeURIComponent(destination.hash.slice(1))), `${path}: anchor ${href} exists`);
      }
    }
  }
  for (const articlePath of articlePaths) {
    for (const hub of ['/', '/health-news']) {
      assert.ok(links(pages.get(hub)).includes(articlePath), `${hub}: crawlable link to ${articlePath}`);
    }
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
  for (const path of ['/conditions/definitely-not-a-condition', '/health-news/definitely-not-a-guide', '/this-page-does-not-exist']) {
    assert.equal((await get(path)).status, 404, `${path}: real 404`);
  }
  const referral = await get('/find-a-doctor');
  assert.equal(referral.status, 307, 'Intentional doctor referral still redirects');
  const referralConfig = await readFile('app/config/doctorReferral.ts', 'utf8');
  const referralDestination = referralConfig.match(/^export const DOCTOR_WEBSITE_URL\s*=\s*["']([^"']+)["']/m)?.[1];
  assert.ok(referralDestination, 'Doctor destination is configured');
  assert.equal(referral.headers.get('location'), referralDestination);
  const choice = homepage.match(/<dialog\b[^>]*>(.*?)<\/dialog>/)?.[0];
  assert.ok(choice?.includes('aria-labelledby="website-choice-title"'), 'Named Stay/Leave dialog is mounted');
  assert.ok(!/\bopen(?:=|\s|>)/.test(choice.match(/<dialog\b[^>]*>/)[0]), 'Choice is closed in the initial HTML');
  assert.ok(choice.includes('Stay on MyVeta') && choice.includes('Leave website'));
  assert.ok(!homepage.includes('<iframe'), 'No external website is embedded during page loading');
  const referralAreas = [...homepage.matchAll(/<a\b[^>]*>/g)].map(m => m[0])
    .filter(tag => /(?:home-referral-hotspot|referral-hotspot|referral-copy-zone)/.test(attribute(tag, 'class')));
  assert.equal(referralAreas.length, 6, 'Keep all six original referral areas');
  assert.ok(referralAreas.every(tag => attribute(tag, 'href') === referralDestination));
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
  const hero = photoTags.find(tag => attribute(tag, 'class').includes('hero-background'));
  assert.ok(hero, 'Hero image is present in the initial HTML');
  assert.equal(attribute(hero, 'loading'), 'eager', 'Hero loading is immediate');
  assert.equal(attribute(hero, 'fetchpriority'), 'high', 'Hero request has high priority');
  const adConfig = await readFile('app/config/advertisement.ts', 'utf8');
  const adSetting = name => adConfig.match(new RegExp(`^export const ${name}\\s*=\\s*["']([^"']+)["']`, 'm'))?.[1];
  const adLink = homepage.match(/<a\b[^>]*class="advertisement-link"[^>]*>(.*?)<\/a>/)?.[0];
  assert.ok(adLink, 'Advertisement remains a clickable link');
  assert.equal(attribute(adLink, 'href'), adSetting('AD_LINK_URL'));
  const video = adLink.match(/<video\b[^>]*>/)?.[0];
  assert.ok(video, 'Advertisement uses the smaller video');
  assert.equal(attribute(video, 'src'), adSetting('AD_MEDIA_URL'));
  assert.equal(attribute(video, 'poster'), adSetting('AD_POSTER_URL'));
  for (const name of ['autoplay', 'muted', 'loop', 'playsinline']) {
    assert.ok(new RegExp(`\\b${name}(?:=|\\s|>)`, 'i').test(video), `Advertisement keeps ${name}`);
  }
  assert.ok(!/\bcontrols(?:=|\s|>)/i.test(video), 'Media controls do not intercept ad clicks');
  const adVideo = await get(adSetting('AD_MEDIA_URL'));
  assert.equal(adVideo.status, 200);
  assert.ok(adVideo.headers.get('content-type')?.includes('video/mp4'));
  const adVideoBytes = (await adVideo.arrayBuffer()).byteLength;
  const poster = await get(adSetting('AD_POSTER_URL'));
  assert.equal(poster.status, 200);
  const posterBytes = (await poster.arrayBuffer()).byteLength;
  const fallback = await get(adSetting('AD_FALLBACK_MEDIA_URL'));
  assert.equal(fallback.status, 200, 'Original animation fallback is available');
  const fallbackBytes = (await fallback.arrayBuffer()).byteLength;
  assert.ok(adVideoBytes + posterBytes < fallbackBytes * 0.2, 'Video and poster save over 80% of the original ad download');
  const optimized = await fetch(origin + '/_next/image?url=%2Fimages%2Fsenior-wellness.png&w=640&q=75', { headers: { Accept: 'image/webp' } });
  assert.equal(optimized.status, 200);
  assert.ok(optimized.headers.get('content-type')?.includes('image/webp'));
  const optimizedBytes = (await optimized.arrayBuffer()).byteLength;
  const originalBytes = (await readFile('public/images/senior-wellness.png')).byteLength;
  assert.ok(optimizedBytes < originalBytes, 'Responsive image is smaller than its source');
  console.log(`PASS: ${paths.length} content pages, ${urls.length} sitemap URLs, canonical and indexing checks (${preview ? 'preview' : expectedOrigin ? 'production' : 'no configured origin'}).`);
  console.log(`PASS: unknown URLs return 404; explicit referral works; responsive hero is ${optimizedBytes} bytes versus ${originalBytes} source bytes.`);
  console.log(`PASS: ${articlePaths.length} full guides, matching article/breadcrumb markup, discoverable article links, and valid internal anchors.`);
  console.log(`PASS: hero has high loading priority; ad video and poster total ${adVideoBytes + posterBytes} bytes versus ${fallbackBytes} GIF bytes; click destination and loop attributes are retained.`);
} finally {
  server.kill('SIGTERM');
  await new Promise(resolve => {
    if (server.exitCode !== null) return resolve();
    server.once('exit', resolve);
    setTimeout(() => { server.kill('SIGKILL'); resolve(); }, 3000).unref();
  });
}
