import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the real controller with simulated browser APIs; no external site
// is opened and these checks do not claim to test browser fullscreen support.
const source = await readFile('app/lib/doctor-profile.ts', 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const config = await readFile('app/config/doctorReferral.ts', 'utf8');
const delayMs = Number(config.match(/DOCTOR_REDIRECT_DELAY_MS\s*=\s*([\d_]+)/)[1].replaceAll('_', ''));
assert.equal(delayMs, 10000, 'The requested delay is ten seconds');
const doctorUrl = 'https://doctor.example/';
const advertisementUrl = 'https://advertisement.example/';
const flush = () => new Promise(resolve => setImmediate(resolve));

class Element {
  constructor(tag = 'div', parent = null) { Object.assign(this, { tag, parent }); }
  closest(selector) {
    return selector === 'a' && this.tag === 'a' ? this : this.parent?.closest(selector) ?? null;
  }
}
class Anchor extends Element {
  constructor(href, target = '') {
    super('a');
    const url = new URL(href, 'https://myveta.example/');
    Object.assign(this, { href: url.href, origin: url.origin, pathname: url.pathname, target });
  }
  hasAttribute() { return false; }
}

function setup({ fullscreen = 'resolve', adUrl = advertisementUrl } = {}) {
  const timers = new Map();
  const listeners = new Map();
  const opens = [];
  const events = [];
  let fullscreenCalls = 0;
  let resolveFullscreen;
  let nextTimer = 0;
  const document = {
    fullscreenElement: null,
    documentElement: {},
    addEventListener(type, callback, capture) {
      assert.equal(type, 'click', 'No Escape or fullscreen-exit interception');
      assert.equal(capture, true, 'Handle referral clicks before their navigation');
      listeners.set(type, callback);
    },
    removeEventListener(type) { listeners.delete(type); },
  };
  if (fullscreen !== 'missing') document.documentElement.requestFullscreen = () => {
    fullscreenCalls++;
    events.push('request fullscreen');
    if (fullscreen === 'throw') throw new Error('Fullscreen denied');
    if (fullscreen === 'reject') return Promise.reject(new Error('Fullscreen denied'));
    const entered = () => { document.fullscreenElement = document.documentElement; events.push('entered fullscreen'); };
    if (fullscreen === 'pending') return new Promise(resolve => {
      resolveFullscreen = () => { entered(); resolve(); };
    });
    return Promise.resolve().then(entered);
  };
  const window = {
    location: { origin: 'https://myveta.example' },
    setTimeout(callback, delay) { const id = ++nextTimer; timers.set(id, { callback, delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
  };
  const context = vm.createContext({ exports: {}, window, document, Element, HTMLAnchorElement: Anchor, URL });
  vm.runInContext(compiled, context);
  const controls = context.exports.setupDoctorProfile({
    doctorUrl, advertisementUrl: adUrl, delayMs,
    onOpen: url => { opens.push(url); events.push('open profile'); },
    onFullscreen: () => events.push('bring profile forward'),
  });
  function click(target = new Element(), overrides = {}) {
    const event = {
      target, button: 0, defaultPrevented: false, propagationStopped: false,
      preventDefault() { this.defaultPrevented = true; },
      stopPropagation() { this.propagationStopped = true; },
      ...overrides,
    };
    listeners.get('click')?.(event);
    return event;
  }
  function runTimers() {
    for (const [id, { callback }] of [...timers]) { timers.delete(id); callback(); }
  }
  return { controls, document, timers, listeners, opens, events, click, runTimers,
    fullscreenCalls: () => fullscreenCalls, resolveFullscreen: () => resolveFullscreen?.() };
}

const browsing = setup();
assert.equal([...browsing.timers.values()][0].delay, 10000);
assert.deepEqual(browsing.opens, [], 'Do not load the profile on initialization');
assert.equal(browsing.click(new Element('button')).defaultPrevented, false, 'Menu and form controls keep working');
await flush();
assert.equal(browsing.fullscreenCalls(), 1);
assert.equal(browsing.click(new Anchor('/conditions')).defaultPrevented, false, 'Internal navigation keeps its normal handler');
assert.equal(browsing.fullscreenCalls(), 1, 'Do not repeat a request while already fullscreen');
browsing.document.fullscreenElement = null; // Browser Escape exit.
await flush();
assert.equal(browsing.fullscreenCalls(), 1, 'Never re-enter fullscreen automatically after Escape');
browsing.click(new Element('input'));
await flush();
assert.equal(browsing.fullscreenCalls(), 2, 'A later ordinary click can request fullscreen again');
browsing.runTimers();
assert.deepEqual(browsing.opens, [doctorUrl]);
assert.equal(browsing.fullscreenCalls(), 2, 'The timer does not make a fullscreen request');
browsing.controls.dispose();

const noClick = setup();
noClick.runTimers();
assert.deepEqual(noClick.opens, [doctorUrl], 'The timer still opens the profile without a prior click');
assert.equal(noClick.fullscreenCalls(), 0, 'Fullscreen is never requested without a click');
noClick.controls.requestFullscreen(); // The explicit Fullscreen button uses the same method.
await flush();
assert.equal(noClick.fullscreenCalls(), 1);
assert.equal(noClick.events.at(-1), 'bring profile forward');
noClick.controls.dispose();

const referral = setup();
const intercepted = referral.click(new Element('span', new Anchor('/find-a-doctor')));
assert.ok(intercepted.defaultPrevented && intercepted.propagationStopped);
assert.equal(referral.timers.size, 0, 'An explicit referral cancels the scheduled opening');
assert.deepEqual(referral.opens, [], 'Wait for the in-flight fullscreen request');
await flush();
assert.deepEqual(referral.opens, [doctorUrl]);
assert.ok(referral.events.indexOf('entered fullscreen') < referral.events.indexOf('open profile'));
referral.controls.cancelOpening();
referral.runTimers();
assert.equal(referral.opens.length, 1, 'Returning to MyVeta does not schedule another opening');
referral.controls.dispose();

const advertisement = setup({ adUrl: 'https://advertisement.example' });
assert.ok(advertisement.click(new Element('video', new Anchor(advertisementUrl))).defaultPrevented);
await flush();
assert.deepEqual(advertisement.opens, [advertisementUrl], 'Ad clicks use their normalized destination');
assert.equal(advertisement.click(new Anchor(doctorUrl, '_blank')).defaultPrevented, false, 'Open separately retains normal navigation');
assert.equal(advertisement.click(new Anchor(doctorUrl), { ctrlKey: true }).defaultPrevented, false);
advertisement.controls.dispose();

for (const fullscreen of ['reject', 'throw', 'missing']) {
  const denied = setup({ fullscreen });
  denied.click(new Anchor(doctorUrl));
  await flush();
  assert.deepEqual(denied.opens, [doctorUrl], `${fullscreen}: fullscreen failure does not block the profile`);
  denied.click(new Element('button'));
  await flush();
  assert.equal(denied.fullscreenCalls(), fullscreen === 'missing' ? 0 : 2, 'A denied request can be retried on a later click');
  denied.controls.dispose();
}

const pending = setup({ fullscreen: 'pending' });
pending.click(new Anchor(doctorUrl));
pending.click(new Anchor(advertisementUrl));
assert.equal(pending.fullscreenCalls(), 1, 'Deduplicate concurrent fullscreen requests');
pending.resolveFullscreen();
await flush();
assert.deepEqual(pending.opens, [advertisementUrl], 'The most recent destination wins');
pending.controls.dispose();

for (const action of ['cancelOpening', 'dispose']) {
  const canceled = setup({ fullscreen: 'pending' });
  canceled.click(new Anchor(doctorUrl));
  canceled.controls[action]();
  canceled.resolveFullscreen();
  await flush();
  canceled.runTimers();
  assert.deepEqual(canceled.opens, [], `${action}: an asynchronous result cannot reopen the profile`);
  assert.equal(canceled.timers.size, 0);
  canceled.controls.dispose();
  assert.equal(canceled.listeners.size, 0);
}

console.log('PASS: ten-second timer, ordinary clicks and navigation, fullscreen retries after Escape/denial, direct doctor/ad links, fullscreen-before-profile ordering, separate-tab links, cancellation, and cleanup.');
console.log('These checks simulate browser APIs; they do not verify a browser or an external iframe.');
