import { useEffect } from "react";

const SECTION_IDS = ["hero", "about", "skills", "research", "projects", "contact"];

export function useHashScroll() {
  useEffect(() => {
    const container = document.querySelector(
      ".hologram-interface",
    ) as HTMLElement | null;
    if (!container) return;

    // Scroll to hash on mount — retry until the lazy section renders
    const initialHash = window.location.hash.slice(1);
    if (SECTION_IDS.includes(initialHash)) {
      let attempts = 0;
      const tryScroll = () => {
        const target = document.getElementById(initialHash);
        if (target) {
          const offset =
            container.scrollTop +
            target.getBoundingClientRect().top -
            container.getBoundingClientRect().top;
          container.scrollTo({ top: offset, behavior: "instant" });
        } else if (attempts < 20) {
          attempts++;
          setTimeout(tryScroll, 100);
        }
      };
      setTimeout(tryScroll, 50);
    }

    // Update URL hash as sections scroll into the top 40% of the container
    const updateHash = () => {
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
        const next = `#${activeId}`;
        if (window.location.hash !== next) {
          history.replaceState(null, "", next);
        }
      }
    };

    container.addEventListener("scroll", updateHash, { passive: true });
    return () => container.removeEventListener("scroll", updateHash);
  }, []);
}
