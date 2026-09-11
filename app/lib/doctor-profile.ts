type Options = {
  doctorUrl: string;
  advertisementUrl?: string;
  delayMs: number;
  onOpen: (url: string) => void;
  onFullscreen: () => void;
};

/** The timer opens a profile; only real click handlers request fullscreen. */
export function setupDoctorProfile(options: Options) {
  let active = true;
  let timer: number | undefined;
  let pendingFullscreen: Promise<void> | undefined;
  let openingVersion = 0;
  const doctorHref = new URL(options.doctorUrl).href;
  const advertisementHref = options.advertisementUrl ? new URL(options.advertisementUrl).href : undefined;

  const clearTimer = () => {
    if (timer !== undefined) window.clearTimeout(timer);
    timer = undefined;
  };

  const requestFullscreen = () => {
    if (!active || document.fullscreenElement) return;
    if (pendingFullscreen) return pendingFullscreen;
    try {
      const request = document.documentElement.requestFullscreen?.();
      if (!request) return;
      pendingFullscreen = request.then(() => {
        if (active && document.fullscreenElement) options.onFullscreen();
      }, () => {
        // The profile still opens if the browser denies fullscreen.
      }).finally(() => { pendingFullscreen = undefined; });
      return pendingFullscreen;
    } catch {
      // Unsupported or denied fullscreen must not interrupt browsing.
    }
  };

  const openProfile = (url: string) => {
    clearTimer();
    const version = ++openingVersion;
    const show = () => {
      if (active && version === openingVersion) options.onOpen(url);
    };
    // Put the profile above the fullscreen document after its transition settles.
    if (pendingFullscreen) void pendingFullscreen.then(show);
    else show();
  };

  const cancelOpening = () => {
    clearTimer();
    openingVersion++;
  };

  const onClick = (event: MouseEvent) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    void requestFullscreen();

    const element = event.target instanceof Element ? event.target : null;
    const link = element?.closest("a");
    if (event.defaultPrevented || !(link instanceof HTMLAnchorElement)
      || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;

    const isAdvertisement = advertisementHref && link.href === advertisementHref;
    const isDoctor = link.href === doctorHref
      || (link.origin === window.location.origin && link.pathname === "/find-a-doctor");
    if (!isAdvertisement && !isDoctor) return;

    // Ordinary site controls keep their own handlers. Only referral/ad links
    // open inside this document so its existing fullscreen session is retained.
    event.preventDefault();
    event.stopPropagation();
    openProfile(isAdvertisement ? advertisementHref : doctorHref);
  };

  document.addEventListener("click", onClick, true);
  timer = window.setTimeout(() => openProfile(doctorHref), options.delayMs);

  return {
    requestFullscreen,
    cancelOpening,
    dispose: () => {
      active = false;
      cancelOpening();
      document.removeEventListener("click", onClick, true);
    },
  };
}
