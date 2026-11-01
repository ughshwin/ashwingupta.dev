import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  // Match the server's first render, then resolve media in the effect. Reading
  // window here caused mobile hydration to discard and rebuild the entire page.
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (globalThis.window === undefined) return;

    const mediaQueryList = globalThis.window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Initial check
    setMatches(mediaQueryList.matches);

    // Add event listener
    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

// Convenience hooks for common breakpoints
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}

export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

export function useIsTouchDevice(): boolean {
  return useMediaQuery("(hover: none) and (pointer: coarse)");
}
