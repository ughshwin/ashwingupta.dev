import { useEffect, useRef } from "react";
import { useIsTouchDevice } from "../../hooks/useMediaQuery";

export function Cursor() {
  const isTouchDevice = useIsTouchDevice();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);
  const rafActive = useRef(false);

  useEffect(() => {
    // Don't set up cursor on touch devices
    if (isTouchDevice) return;

    const lerp = () => {
      const dx = pos.current.x - ringPos.current.x;
      const dy = pos.current.y - ringPos.current.y;
      ringPos.current.x += dx * 0.1;
      ringPos.current.y += dy * 0.1;
      if (ring.current) {
        ring.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`;
      }
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        raf.current = requestAnimationFrame(lerp);
      } else {
        rafActive.current = false;
      }
    };

    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        dot.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
      if (!rafActive.current) {
        rafActive.current = true;
        raf.current = requestAnimationFrame(lerp);
      }
    };

    const onEnter = () => {
      if (ring.current) {
        ring.current.style.width = "50px";
        ring.current.style.height = "50px";
        ring.current.style.borderColor = "#e8e0d0";
        ring.current.style.marginLeft = "-5px";
        ring.current.style.marginTop = "-5px";
      }
    };
    const onLeave = () => {
      if (ring.current) {
        ring.current.style.width = "40px";
        ring.current.style.height = "40px";
        ring.current.style.borderColor = "rgba(255,255,255,0.3)";
        ring.current.style.marginLeft = "0";
        ring.current.style.marginTop = "0";
      }
    };

    document.addEventListener("mousemove", move);
    document.querySelectorAll("a, button, [data-hover]").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      document.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf.current);
    };
  }, [isTouchDevice]);

  // Hide cursor elements on touch devices
  if (isTouchDevice) {
    return null;
  }

  return (
    <>
      <div
        ref={dot}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#e8e0d0",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "difference",
        }}
      />
      <div
        ref={ring}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.3)",
          pointerEvents: "none",
          zIndex: 9998,
          transition: "width 0.3s, height 0.3s, border-color 0.3s",
        }}
      />
    </>
  );
}
