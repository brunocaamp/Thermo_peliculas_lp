import { useEffect } from "react";

/**
 * PreloaderDismisser
 *
 * This component does NOT render any JSX. The preloader markup is server-rendered
 * as static HTML inside <body> in RootShell (__root.tsx), which means it appears
 * at 0 ms — before any JavaScript executes.
 *
 * Once React mounts this component, we find the #site-preloader element and
 * smoothly fade it out via a CSS class, then remove it from the DOM.
 */
export function Preloader() {
  useEffect(() => {
    const el = document.getElementById("site-preloader");
    if (!el) return;

    const MIN_DISPLAY_MS = 1800;
    const mountedAt = Date.now();

    const hide = () => {
      const elapsed = Date.now() - mountedAt;
      const delay = Math.max(0, MIN_DISPLAY_MS - elapsed);

      setTimeout(() => {
        el.classList.add("preloader-exit");
        // Remove from DOM after the CSS transition completes
        el.addEventListener("transitionend", () => el.remove(), { once: true });
        // Fallback remove in case transitionend never fires
        setTimeout(() => el.remove(), 900);
      }, delay);
    };

    hide();
  }, []);

  return null;
}
