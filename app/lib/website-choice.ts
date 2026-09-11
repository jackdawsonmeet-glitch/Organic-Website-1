type Options = {
  doctorUrl: string;
  advertisementUrl: string;
  delayMs: number;
  onDestinationChange: (url: string) => void;
};

const sessionKey = "myveta-website-choice-answered";

/** No destination is requested until the visitor explicitly selects Leave. */
export function setupWebsiteChoice(dialog: HTMLDialogElement, options: Options) {
  // Older browsers retain ordinary link navigation instead of an unusable overlay.
  if (typeof dialog.showModal !== "function") return;

  let active = true;
  let answered = false;
  let opening = false;
  let fullscreenAttempted = false;
  let destination = options.doctorUrl;
  let timer: number | undefined;
  const doctorHref = new URL(options.doctorUrl, window.location.origin).href;
  const advertisementHref = new URL(options.advertisementUrl, window.location.origin).href;
  try {
    answered = window.sessionStorage.getItem(sessionKey) === "true";
  } catch { /* The choice still works when browser storage is unavailable. */ }

  const clearTimer = () => {
    if (timer !== undefined) window.clearTimeout(timer);
    timer = undefined;
  };

  const requestFullscreen = () => {
    if (fullscreenAttempted || document.fullscreenElement) return;
    fullscreenAttempted = true;
    try {
      return document.documentElement.requestFullscreen?.().catch(() => {});
    } catch { /* A denied fullscreen request must not block the choice. */ }
  };

  const showChoice = (url: string, fromClick = false) => {
    if (!active || opening || dialog.open) return;
    clearTimer();
    opening = true;
    destination = url;
    options.onDestinationChange(url);
    // Escape and native dismissal always keep the visitor on MyVeta.
    dialog.returnValue = "stay";
    const show = () => {
      opening = false;
      if (active) dialog.showModal();
    };
    // Open the dialog after fullscreen settles so it stays above the page.
    const fullscreen = fromClick ? requestFullscreen() : undefined;
    if (fullscreen) void fullscreen.then(show);
    else show();
  };

  const onClose = () => {
    answered = true;
    clearTimer();
    try {
      window.sessionStorage.setItem(sessionKey, "true");
    } catch { /* Keep the in-memory choice for this page. */ }
    if (dialog.returnValue === "leave") window.location.assign(destination);
  };

  const onClick = (event: MouseEvent) => {
    const element = event.target instanceof Element ? event.target : null;
    if (!element || event.defaultPrevented || event.button !== 0
      || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    if (dialog.contains(element)) {
      // A timed prompt has no user gesture until the visitor clicks Stay.
      if (element.closest('button[value="stay"]')) void requestFullscreen();
      return;
    }

    const link = element.closest("a");
    const isLink = link instanceof HTMLAnchorElement;
    const isAdvertisement = isLink && link.href === advertisementHref;
    const isDoctor = isLink && (link.href === doctorHref
      || (link.origin === window.location.origin && link.pathname === "/find-a-doctor"));

    // After Stay, ordinary browsing works normally. Explicit referral/ad clicks
    // can still offer Leave, including when their destinations differ.
    if (answered && !isAdvertisement && !isDoctor) return;
    event.preventDefault();
    event.stopPropagation();
    showChoice(isAdvertisement ? options.advertisementUrl : options.doctorUrl, true);
  };

  // Capture prevents the original link or React handler firing under the prompt.
  document.addEventListener("click", onClick, true);
  dialog.addEventListener("close", onClose);
  if (!answered) timer = window.setTimeout(() => showChoice(options.doctorUrl), options.delayMs);

  return () => {
    active = false;
    clearTimer();
    document.removeEventListener("click", onClick, true);
    dialog.removeEventListener("close", onClose);
    if (dialog.open) dialog.close();
  };
}
