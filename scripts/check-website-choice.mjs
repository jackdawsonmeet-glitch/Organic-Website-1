import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the production controller with simulated DOM, fullscreen, timer, and
// storage APIs. No browser, external website, or additional dependency is used.
const source = await readFile('app/lib/website-choice.ts', 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const config = await readFile('app/config/doctorReferral.ts', 'utf8');
const delayMs = Number(config.match(/DOCTOR_REDIRECT_DELAY_MS\s*=\s*([\d_]+)/)[1].replaceAll('_', ''));
const doctorUrl = 'https://doctor.example/';
const advertisementUrl = 'https://advertisement.example/offer';
const flush = () => new Promise(resolve => setImmediate(resolve));

class Element {
  constructor(tag = 'div', parent = null, value = '') {
    Object.assign(this, { tag, parent, value });
  }
  closest(selector) {
    if (selector === 'a' && this.tag === 'a') return this;
    if (selector === 'button[value="stay"]' && this.tag === 'button' && this.value === 'stay') return this;
    return this.parent?.closest(selector) ?? null;
  }
  contains(element) {
    return element === this || Boolean(element.parent && this.contains(element.parent));
  }
}
class Anchor extends Element {
  constructor(href) {
    super('a');
    const url = new URL(href, 'https://myveta.example/');
    Object.assign(this, { href: url.href, origin: url.origin, pathname: url.pathname });
  }
}
class Dialog extends Element {
  open = false;
  returnValue = '';
  shown = 0;
  listeners = new Map();
  showModal() { this.open = true; this.shown++; }
  close(value) {
    if (!this.open) return;
    this.open = false;
    if (value !== undefined) this.returnValue = value;
    this.listeners.get('close')?.();
  }
  addEventListener(type, callback) { this.listeners.set(type, callback); }
  removeEventListener(type) { this.listeners.delete(type); }
}

function setup({ storage = new Map(), blockedStorage = false, fullscreen = 'resolve', dialogSupported = true, adUrl = advertisementUrl } = {}) {
  const dialog = new Dialog('dialog');
  if (!dialogSupported) dialog.showModal = undefined;
  const timers = new Map();
  const listeners = new Map();
  const navigations = [];
  const shownDestinations = [];
  let fullscreenCalls = 0;
  let resolveFullscreen;
  let nextTimer = 0;
  const document = {
    fullscreenElement: null,
    documentElement: {},
    addEventListener(type, callback, capture) {
      assert.equal(capture, true, 'Intercept the click before React or link navigation');
      listeners.set(type, callback);
    },
    removeEventListener(type) { listeners.delete(type); },
  };
  if (fullscreen !== 'missing') document.documentElement.requestFullscreen = () => {
    fullscreenCalls++;
    if (fullscreen === 'throw') throw new Error('Fullscreen blocked');
    if (fullscreen === 'reject') return Promise.reject(new Error('Fullscreen blocked'));
    if (fullscreen === 'pending') return new Promise(resolve => { resolveFullscreen = resolve; });
    return Promise.resolve();
  };
  const window = {
    location: { origin: 'https://myveta.example', assign: url => navigations.push(url) },
    sessionStorage: {
      getItem(key) { if (blockedStorage) throw new Error('Storage blocked'); return storage.get(key); },
      setItem(key, value) { if (blockedStorage) throw new Error('Storage blocked'); storage.set(key, value); },
    },
    setTimeout(callback, delay) { const id = ++nextTimer; timers.set(id, { callback, delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
  };
  const context = vm.createContext({ exports: {}, window, document, Element, HTMLAnchorElement: Anchor, URL });
  vm.runInContext(compiled, context);
  const cleanup = context.exports.setupWebsiteChoice(dialog, {
    doctorUrl, advertisementUrl: adUrl, delayMs,
    onDestinationChange: url => shownDestinations.push(url),
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
  function choose(value) {
    const event = click(new Element('button', dialog, value));
    assert.equal(event.defaultPrevented, false, 'Allow the dialog form to submit');
    dialog.close(value); // Native method="dialog" form submission.
  }
  function runTimers() {
    for (const [id, { callback }] of [...timers]) { timers.delete(id); callback(); }
  }
  return { dialog, timers, listeners, navigations, storage, shownDestinations, cleanup, click, choose, runTimers,
    fullscreenCalls: () => fullscreenCalls, resolveFullscreen: () => resolveFullscreen?.() };
}

const first = setup();
assert.equal([...first.timers.values()][0].delay, delayMs, 'Use the configured delay unchanged');
assert.equal(first.dialog.open, false);
assert.deepEqual(first.navigations, [], 'No navigation during initialization');
const blocked = first.click(new Element('span', new Anchor('/conditions')));
assert.ok(blocked.defaultPrevented && blocked.propagationStopped, 'Do not activate the original link under the dialog');
await flush();
assert.equal(first.dialog.open, true);
assert.equal(first.fullscreenCalls(), 1);
assert.equal(first.timers.size, 0, 'First click cancels the pending timer');
first.choose('stay');
first.runTimers();
assert.equal(first.dialog.open, false);
assert.deepEqual(first.navigations, [], 'Stay does not reload or navigate');
assert.equal(first.click(new Anchor('/conditions')).defaultPrevented, false, 'Normal navigation works after Stay');
assert.equal(first.fullscreenCalls(), 1, 'Normal browsing does not re-enter fullscreen');
assert.equal(first.click(new Anchor(doctorUrl), { ctrlKey: true }).defaultPrevented, false, 'Keep modified-click behavior');

const restored = setup({ storage: first.storage });
assert.equal(restored.timers.size, 0, 'Reload/remount retains the session choice');
assert.equal(restored.click().defaultPrevented, false, 'Do not repeat the automatic first-click prompt');
assert.ok(restored.click(new Element('span', new Anchor('/find-a-doctor'))).defaultPrevented);
await flush();
restored.choose('leave');
assert.deepEqual(restored.navigations, [doctorUrl], 'Leave follows the explicit doctor link');
restored.cleanup();

const adClick = first.click(new Element('video', new Anchor(advertisementUrl)));
assert.equal(adClick.defaultPrevented, true);
await flush();
assert.equal(first.shownDestinations.at(-1), advertisementUrl, 'Show the clicked advertisement destination');
first.choose('leave');
assert.deepEqual(first.navigations, [advertisementUrl], 'Leave uses the ad URL when it differs from the doctor URL');
first.cleanup();

const normalized = setup({ storage: first.storage, adUrl: 'https://advertisement.example' });
assert.ok(normalized.click(new Anchor('https://advertisement.example/')).defaultPrevented, 'URL normalization cannot bypass the choice');
await flush();
normalized.choose('leave');
assert.deepEqual(normalized.navigations, ['https://advertisement.example']);
normalized.cleanup();

const timed = setup();
timed.runTimers();
assert.equal(timed.dialog.open, true, 'Timer opens the choice');
assert.equal(timed.fullscreenCalls(), 0, 'Timer never attempts fullscreen without a gesture');
assert.deepEqual(timed.navigations, [], 'Timer cannot leave the site');
timed.dialog.close(); // Escape/native dismissal retains the default return value.
assert.deepEqual(timed.navigations, [], 'Dismissal means Stay');
assert.equal(timed.click().defaultPrevented, false);
timed.cleanup();

const timedStay = setup();
timedStay.runTimers();
timedStay.choose('stay');
await flush();
assert.equal(timedStay.fullscreenCalls(), 1, 'Stay supplies the gesture for a timed prompt');
timedStay.cleanup();

for (const fullscreen of ['reject', 'throw', 'missing']) {
  const denied = setup({ fullscreen, blockedStorage: true });
  denied.click();
  await flush();
  assert.equal(denied.dialog.open, true, `${fullscreen}: fullscreen failure does not block the choice`);
  denied.choose('stay');
  assert.equal(denied.click().defaultPrevented, false, 'Stay works when storage is blocked');
  denied.cleanup();
}

const pending = setup({ fullscreen: 'pending' });
pending.click();
pending.click();
assert.equal(pending.fullscreenCalls(), 1, 'Rapid clicks do not duplicate fullscreen requests');
pending.cleanup();
pending.resolveFullscreen();
await flush();
assert.equal(pending.dialog.shown, 0, 'An async fullscreen result cannot reopen an unmounted dialog');
assert.equal(pending.listeners.size, 0);
assert.equal(pending.timers.size, 0);

const removed = setup();
removed.runTimers();
removed.cleanup();
assert.equal(removed.dialog.open, false);
assert.equal(removed.storage.size, 0, 'Cleanup does not count as the visitor choosing Stay');
const legacy = setup({ dialogSupported: false });
assert.equal(legacy.timers.size, 0);
assert.equal(legacy.click(new Anchor('/conditions')).defaultPrevented, false, 'Unsupported dialogs do not trap visitors');

console.log('PASS: first click, configured timer, Stay, Leave, native dismissal, session persistence, separate ad URL, fullscreen/storage failures, rapid clicks, cleanup, and unsupported-dialog fallback.');
console.log('These are controller checks using simulated browser APIs, not browser tests.');
