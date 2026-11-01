import { useEffect } from "react";

const SECTION_IDS = [
  "hero",
  "about",
  "impact",
  "stack",
  "experience",
  "recommendations",
  "featured",
  "projects",
  "contact",
];

function getSectionFromPath(path: string): string {
  const section = path.replace(/^\//, "");
  return SECTION_IDS.includes(section) ? section : "";
}

export function scrollToSection(
  id: string,
  behavior: ScrollBehavior = "smooth",
) {
  const container = document.querySelector(
    ".hologram-interface",
  ) as HTMLElement | null;
  if (!container) return;
  const target = document.getElementById(id);
  if (!target) return;
  // Skip the element's own padding-top so the first visible content (section
  // label / break line) lands at the container top, not the blank padded space.
  const paddingTop = parseFloat(getComputedStyle(target).paddingTop) || 0;
  const offset =
    container.scrollTop +
    target.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    paddingTop;
  // Route smooth scrolls through the custom RAF scroller so its internal
  // `target` variable stays in sync - prevents snap-back on first wheel event.
  const portfolioScroll = (window as any).__portfolioScrollTop as
    | ((top: number) => void)
    | undefined;
  if (behavior === "smooth" && portfolioScroll) {
    portfolioScroll(offset);
  } else {
    container.scrollTo({ top: offset, behavior });
  }
}

export function useHashScroll() {
  useEffect(() => {
    const container = document.querySelector(
      ".hologram-interface",
    ) as HTMLElement | null;
    if (!container) return;

    let disposed = false;
    const pendingTimers = new Set<ReturnType<typeof setTimeout>>();
    const pendingFrames = new Set<number>();
    const later = (callback: () => void, delay: number) => {
      const timer = setTimeout(() => {
        pendingTimers.delete(timer);
        if (!disposed) callback();
      }, delay);
      pendingTimers.add(timer);
    };
    const nextFrame = (callback: () => void) => {
      const frame = requestAnimationFrame(() => {
        pendingFrames.delete(frame);
        if (!disposed) callback();
      });
      pendingFrames.add(frame);
    };

    // On mount: read pathname (e.g. /about) with hash fallback
    const pathSection = getSectionFromPath(window.location.pathname);
    const hashSection = window.location.hash.slice(1);
    const initial =
      pathSection || (SECTION_IDS.includes(hashSection) ? hashSection : "");

    if (initial && initial !== "hero") {
      let attempts = 0;
      const tryScroll = () => {
        const target = document.getElementById(initial);
        if (target) {
          // Gate on fonts so Hero's large serif text is in final metrics before
          // we measure any offsets. One rAF ensures we're in a stable paint cycle.
          document.fonts.ready.then(() => {
            if (disposed) return;
            nextFrame(() => {
              scrollToSection(initial, "instant");
              // Correction pass: IntersectionObserver-triggered renders (e.g.
              // ExperienceTimeline) and late-loading images can shift sections
              // after the first scroll, so re-snap once layout has settled.
              later(() => scrollToSection(initial, "instant"), 300);
            });
          });
        } else if (attempts < 20) {
          attempts++;
          later(tryScroll, 100);
        }
      };
      later(tryScroll, 50);
    }

    // Section positions only change when layout changes, not on every scroll.
    const sections = SECTION_IDS.map((id) => ({ id, element: document.getElementById(id) }))
      .filter((entry): entry is { id: string; element: HTMLElement } => entry.element !== null);
    let layoutDirty = true;
    let viewportHeight = 0;
    let positions: Array<{ id: string; top: number }> = [];
    const invalidate = () => { layoutDirty = true; };
    const observer = new ResizeObserver(invalidate);
    observer.observe(container);
    sections.forEach(({ element }) => observer.observe(element));
    window.addEventListener("resize", invalidate, { passive: true });
    container.addEventListener("load", invalidate, true);
    document.fonts.ready.then(() => { if (!disposed) invalidate(); });

    const updatePath = () => {
      if (layoutDirty) {
        const containerRect = container.getBoundingClientRect();
        viewportHeight = containerRect.height;
        positions = sections.map(({ id, element }) => ({
          id,
          top: element.getBoundingClientRect().top - containerRect.top + container.scrollTop,
        }));
        layoutDirty = false;
      }
      const threshold = container.scrollTop + viewportHeight * 0.4;
      let activeId = "";
      let bestDist = Infinity;
      for (const { id, top } of positions) {
        if (top <= threshold && threshold - top < bestDist) {
          bestDist = threshold - top;
          activeId = id;
        }
      }
      if (activeId) {
        const next = activeId === "hero" ? "/" : "/" + activeId;
        if (window.location.pathname !== next) history.replaceState(null, "", next);
      }
    };

    container.addEventListener("scroll", updatePath, { passive: true });
    return () => {
      disposed = true;
      pendingTimers.forEach(clearTimeout);
      pendingFrames.forEach(cancelAnimationFrame);
      observer.disconnect();
      window.removeEventListener("resize", invalidate);
      container.removeEventListener("load", invalidate, true);
      container.removeEventListener("scroll", updatePath);
    };
  }, []);
}
