import { useEffect } from "react";

const SECTION_IDS = ["hero", "about", "stack", "experience", "recommendations", "featured", "research", "projects", "contact"];

function getSectionFromPath(path: string): string {
  const section = path.replace(/^\//, "");
  return SECTION_IDS.includes(section) ? section : "";
}

export function scrollToSection(id: string, behavior: ScrollBehavior = "smooth") {
  const container = document.querySelector(".hologram-interface") as HTMLElement | null;
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
  container.scrollTo({ top: offset, behavior });
}

export function useHashScroll() {
  useEffect(() => {
    const container = document.querySelector(".hologram-interface") as HTMLElement | null;
    if (!container) return;

    // On mount: read pathname (e.g. /about) with hash fallback
    const pathSection = getSectionFromPath(window.location.pathname);
    const hashSection = window.location.hash.slice(1);
    const initial = pathSection || (SECTION_IDS.includes(hashSection) ? hashSection : "");

    if (initial && initial !== "hero") {
      let attempts = 0;
      const tryScroll = () => {
        const target = document.getElementById(initial);
        if (target) {
          // Gate on fonts so Hero's large serif text is in final metrics before
          // we measure any offsets. One rAF ensures we're in a stable paint cycle.
          document.fonts.ready.then(() => {
            requestAnimationFrame(() => {
              scrollToSection(initial, "instant");
              // Correction pass: IntersectionObserver-triggered renders (e.g.
              // ExperienceTimeline) and late-loading images can shift sections
              // after the first scroll, so re-snap once layout has settled.
              setTimeout(() => scrollToSection(initial, "instant"), 300);
            });
          });
        } else if (attempts < 20) {
          attempts++;
          setTimeout(tryScroll, 100);
        }
      };
      setTimeout(tryScroll, 50);
    }

    // Keep URL in sync with the section currently in view
    const updatePath = () => {
      const containerRect = container.getBoundingClientRect();
      const threshold = containerRect.top + containerRect.height * 0.4;

      let activeId = "";
      let bestDist = Infinity;

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= threshold) {
          const dist = threshold - top;
          if (dist < bestDist) {
            bestDist = dist;
            activeId = id;
          }
        }
      }

      if (activeId) {
        const next = activeId === "hero" ? "/" : `/${activeId}`;
        if (window.location.pathname !== next) {
          history.replaceState(null, "", next);
        }
      }
    };

    container.addEventListener("scroll", updatePath, { passive: true });
    return () => container.removeEventListener("scroll", updatePath);
  }, []);
}
