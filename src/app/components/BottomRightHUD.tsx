import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronUp, Timer } from "lucide-react";
import { useIsMobile } from "../../hooks/useMediaQuery";

const FONT_MONO = "'SF Mono', 'Fira Mono', 'Consolas', monospace";

function useSessionTime() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const key = "__portfolio_session_start";
    const stored = sessionStorage.getItem(key);
    const start = stored
      ? parseInt(stored)
      : (() => {
          const t = Date.now();
          sessionStorage.setItem(key, String(t));
          return t;
        })();
    setElapsed(Math.floor((Date.now() - start) / 1000));
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return elapsed;
}

function useMouseCoords() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({
        x: (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2),
        y: -(e.clientY - window.innerHeight / 2) / (window.innerHeight / 2),
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return pos;
}

function useScrollState(
  progressCircleRef: React.RefObject<SVGCircleElement | null>,
  btnCirc: number,
) {
  const [showTop, setShowTop] = useState(false);
  const progressRef = useRef(0);

  useEffect(() => {
    let cleanup: (() => void) | null = null;

    const init = () => {
      cleanup?.();
      const holoEl = document.querySelector(
        ".hologram-interface",
      ) as HTMLElement | null;

      const getTop = () => (holoEl ? holoEl.scrollTop : window.scrollY);
      const getMax = () =>
        holoEl
          ? holoEl.scrollHeight - holoEl.clientHeight
          : document.body.scrollHeight - window.innerHeight;
      const getVH = () => (holoEl ? holoEl.clientHeight : window.innerHeight);

      const onScroll = () => {
        const top = getTop();
        const max = getMax();
        const p = max > 0 ? top / max : 0;
        progressRef.current = p;
        setShowTop(top > getVH() * 0.6);
        if (progressCircleRef.current) {
          progressCircleRef.current.style.strokeDashoffset = String(
            btnCirc * (1 - p),
          );
        }
      };

      const target = holoEl ?? window;
      target.addEventListener("scroll", onScroll, { passive: true });
      cleanup = () => target.removeEventListener("scroll", onScroll);
    };

    init();
    document.addEventListener("astro:page-load", init);
    return () => {
      cleanup?.();
      document.removeEventListener("astro:page-load", init);
    };
  }, [btnCirc, progressCircleRef]);

  return { showTop, progressRef };
}

function fmtElapsed(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${String(h).padStart(2, "0")}:${mm}:${ss}` : `${mm}:${ss}`;
}

function fmtCoord(n: number) {
  const fixed = n.toFixed(4);
  return (parseFloat(fixed) > 0 ? "+" : "") + fixed;
}

function scrollToTop() {
  const fn = (window as any).__portfolioScrollTop;
  if (fn) {
    fn(0);
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

export function BottomRightHUD() {
  const isMobile = useIsMobile();
  const elapsed = useSessionTime();
  const { x, y } = useMouseCoords();

  const btnSize = isMobile ? 42 : 52;
  const btnR = btnSize / 2 - 2;
  const btnCirc = 2 * Math.PI * btnR;

  const progressCircleRef = useRef<SVGCircleElement>(null);
  const { showTop, progressRef } = useScrollState(progressCircleRef, btnCirc);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.25rem",
        right: "1.25rem",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      {/* Fixed-height slot so widgets never shift when button appears */}
      <div
        style={{
          height: `${btnSize}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatePresence>
          {showTop && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              onClick={scrollToTop}
              style={{
                width: `${btnSize}px`,
                height: `${btnSize}px`,
                borderRadius: "50%",
                border: "none",
                background: "rgba(10,10,10,0.6)",
                color: "rgba(255,255,255,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isMobile ? "pointer" : "none",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                transition: "color 0.2s",
                padding: 0,
                position: "relative",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(255,255,255,0.95)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(255,255,255,0.55)";
              }}
            >
              <svg
                width={btnSize}
                height={btnSize}
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: "rotate(-90deg)",
                }}
              >
                <circle
                  cx={btnSize / 2}
                  cy={btnSize / 2}
                  r={btnR}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1.5"
                />
                <circle
                  ref={progressCircleRef}
                  cx={btnSize / 2}
                  cy={btnSize / 2}
                  r={btnR}
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray={btnCirc}
                  strokeDashoffset={btnCirc * (1 - progressRef.current)}
                />
              </svg>
              <ChevronUp
                size={isMobile ? 16 : 19}
                strokeWidth={1.5}
                style={{ position: "relative" }}
              />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Widgets row: timer | XY */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          color: "white",
          fontFamily: FONT_MONO,
          fontSize: "0.82rem",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {/* Session timer */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Timer size={12} strokeWidth={1.8} style={{ opacity: 0.7, flexShrink: 0 }} />
          <span style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "0.03em" }}>
            {fmtElapsed(elapsed)}
          </span>
        </div>

        {/* Mouse XY */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <span style={{ opacity: 0.75, fontSize: "0.65rem", letterSpacing: "0.04em" }}>
              X
            </span>
            <span style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "0.03em" }}>
              {fmtCoord(x)}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <span style={{ opacity: 0.75, fontSize: "0.65rem", letterSpacing: "0.04em" }}>
              Y
            </span>
            <span style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "0.03em" }}>
              {fmtCoord(y)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
