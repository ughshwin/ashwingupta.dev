import { useEffect, useRef, type CSSProperties } from "react";
import { useIsTouchDevice } from "../../hooks/useMediaQuery";
import "./Cursor.css";

// Fill the entire downward wedge; independent phases avoid bands or outlined edges.
const PARTICLES = Array.from({ length: 64 }, (_, index) => {
  const pair = Math.floor(index / 2);
  const spread = (pair + 0.5) / 32;
  const duration = 1.02 + (pair % 4) * 0.07;
  const phase = (pair * 0.61803398875 + (index % 2) * 0.37) % 1;
  return {
    "--particle-x": `${(index % 2 ? 1 : -1) * 46 * spread}px`,
    "--particle-y": `${34 + (pair % 5) * 2}px`,
    "--particle-delay": `${-phase * duration}s`,
    "--particle-duration": `${duration}s`,
    "--particle-size": `${1.7 + (pair % 3) * 0.45}px`,
  } as CSSProperties;
});

export function Cursor() {
  const isTouchDevice = useIsTouchDevice();
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pointer = wrap.current;
    if (isTouchDevice || !pointer) return;
    const style = document.createElement("style");
    style.dataset.cursorOverride = "1";
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    // Keep this inside the persisted island; Astro replaces the head on navigation.
    pointer.appendChild(style);

    let x = -300;
    let y = -300;
    let targetX = x;
    let targetY = y;
    let hasPosition = false;
    let ticking = false;
    let frame = 0;
    const interactive = "a, button, input, select, textarea, label, summary, " +
      '[role="button"], [role="link"], [role="menuitem"], [role="tab"], ' +
      '[role="checkbox"], [role="radio"], [role="switch"], ' +
      '[tabindex]:not([tabindex="-1"]), [data-hover]';
    const isClickable = (element: Element | null): boolean => {
      let current = element;
      while (current && current !== document.documentElement) {
        if (current.matches(':disabled, [aria-disabled="true"]')) return false;
        // Native computed cursor is masked by our override; inline styles remain readable.
        if (current.matches(interactive) || (current as HTMLElement).style?.cursor === "pointer") return true;
        current = current.parentElement;
      }
      return false;
    };
    const hover = (element: Element | null) => {
      pointer.classList.toggle("is-hovering", isClickable(element));
    };
    const draw = () => {
      x += (targetX - x) * 0.4;
      y += (targetY - y) * 0.4;
      // The outlined pointer's upper-left tip is the actual click hotspot.
      pointer.style.transform = `translate3d(${x - 4.5}px, ${y - 4.5}px, 0)`;
      if (Math.abs(targetX - x) > 0.06 || Math.abs(targetY - y) > 0.06) {
        frame = requestAnimationFrame(draw);
      } else ticking = false;
    };
    const move = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!hasPosition) { x = targetX; y = targetY; hasPosition = true; }
      pointer.style.opacity = "1";
      hover(event.target instanceof Element ? event.target : null);
      if (!ticking) { ticking = true; frame = requestAnimationFrame(draw); }
    };
    const over = (event: MouseEvent) => hover(event.target instanceof Element ? event.target : null);
    const out = (event: MouseEvent) => hover(event.relatedTarget instanceof Element ? event.relatedTarget : null);
    const refreshHover = () => {
      if (hasPosition) hover(document.elementFromPoint(targetX, targetY));
    };
    const hide = () => {
      pointer.style.opacity = "0";
      pointer.classList.remove("is-hovering");
      hasPosition = false;
      ticking = false;
      cancelAnimationFrame(frame);
    };
    const leave = (event: MouseEvent) => { if (event.relatedTarget === null) hide(); };
    const visibility = () => { if (document.hidden) hide(); };
    document.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over, { passive: true });
    document.addEventListener("mouseout", out, { passive: true });
    document.addEventListener("mouseleave", leave, { passive: true });
    document.addEventListener("scroll", refreshHover, { passive: true, capture: true });
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", hide);
    return () => {
      style.remove();
      hide();
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("scroll", refreshHover, true);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", hide);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;
  return (
    <div ref={wrap} className="site-pointer" aria-hidden="true">
      <svg className="site-pointer-icon" width="29" height="29" viewBox="0 0 26 26">
        <path
          d="M4.8 4.2 C3.6 3.8 3.1 4.5 3.5 5.7 L8.7 21.1 C9.1 22.4 10.6 22.4 11 21.1 L13.5 14.1 L20.6 11.6 C21.9 11.2 21.9 9.7 20.6 9.3 Z"
          fill="rgba(4, 9, 16, 0.82)"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      {PARTICLES.map((particle, index) => <span key={index} className="site-pointer-particle" style={particle} />)}
    </div>
  );
}
