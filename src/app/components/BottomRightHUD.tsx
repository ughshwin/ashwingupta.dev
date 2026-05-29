import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronUp, Timer, Compass } from "lucide-react";
import { useIsMobile } from "../../hooks/useMediaQuery";

const FONT_MONO = "'SF Mono', 'Fira Mono', 'Consolas', monospace";

const SITE_PAGES = [
  "/",
  "/articles",
  "/articles/the-space-between-stars",
  "/articles/the-layer-nobody-talks-about",
  "/work/hsbc",
  "/work/here-app",
  "/work/ashwingupta-dev",
  "/work/pageindexollama",
  "/work/research-it",
  "/work/azure-infra-docs",
  "/work/airline-contract-intelligence",
  "/work/laminar-metamorph-polymorph",
  "/work/skill-recommendation-engine",
  "/research/pinns",
  "/research/controla",
  "/research/physclip",
  "/research/scholaros",
];

const EXPLORED_COLOR_STOPS = [
  { at: 0,   r: 239, g: 68,  b: 68  },
  { at: 20,  r: 234, g: 179, b: 8   },
  { at: 60,  r: 59,  g: 130, b: 246 },
  { at: 90,  r: 74,  g: 222, b: 128 },
  { at: 100, r: 74,  g: 222, b: 128 },
];

function exploredColor(pct: number): { r: number; g: number; b: number } {
  const p = Math.max(0, Math.min(100, pct));
  for (let i = 0; i < EXPLORED_COLOR_STOPS.length - 1; i++) {
    const a = EXPLORED_COLOR_STOPS[i];
    const b = EXPLORED_COLOR_STOPS[i + 1];
    if (p >= a.at && p <= b.at) {
      const t = (p - a.at) / (b.at - a.at);
      return {
        r: Math.round(a.r + (b.r - a.r) * t),
        g: Math.round(a.g + (b.g - a.g) * t),
        b: Math.round(a.b + (b.b - a.b) * t),
      };
    }
  }
  const last = EXPLORED_COLOR_STOPS[EXPLORED_COLOR_STOPS.length - 1];
  return { r: last.r, g: last.g, b: last.b };
}

function useExplored() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const KEY = "__portfolio_explored_v2";
    let depths: Record<string, number> = {};
    try { depths = JSON.parse(localStorage.getItem(KEY) ?? "{}"); } catch {}

    const computePct = () =>
      Math.min(100, (Object.values(depths).reduce((s, v) => s + Math.min(v, 1), 0) / SITE_PAGES.length) * 100);

    const getScrollEl = () =>
      (document.querySelector(".hologram-interface") as HTMLElement | null) ??
      (document.querySelector(".thinking-scroll") as HTMLElement | null);

    let cleanupScroll: (() => void) | null = null;

    const init = () => {
      cleanupScroll?.();
      cleanupScroll = null;
      const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
      if (!SITE_PAGES.includes(currentPath)) return;
      const scrollEl = getScrollEl();
      const getTop = () => (scrollEl ? scrollEl.scrollTop : window.scrollY);
      const getMax = () => scrollEl ? scrollEl.scrollHeight - scrollEl.clientHeight : document.body.scrollHeight - window.innerHeight;
      if (getMax() <= 0) {
        depths = { ...depths, [currentPath]: 1 };
        localStorage.setItem(KEY, JSON.stringify(depths));
        setPct(computePct());
        return;
      }
      const onScroll = () => {
        const max = getMax();
        if (max <= 0) return;
        const p = getTop() / max;
        const prev = depths[currentPath] ?? 0;
        if (p > prev) {
          depths = { ...depths, [currentPath]: p };
          localStorage.setItem(KEY, JSON.stringify(depths));
          setPct(computePct());
        }
      };
      const target = scrollEl ?? window;
      target.addEventListener("scroll", onScroll, { passive: true });
      cleanupScroll = () => target.removeEventListener("scroll", onScroll);
    };

    setPct(computePct());
    init();
    document.addEventListener("astro:page-load", init);
    return () => { cleanupScroll?.(); document.removeEventListener("astro:page-load", init); };
  }, []);
  return pct;
}

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

      // Reset state for the new page
      setShowTop(false);
      progressRef.current = 0;
      if (progressCircleRef.current) {
        progressCircleRef.current.style.strokeDashoffset = String(btnCirc);
      }

      const holoEl = document.querySelector(".hologram-interface") as HTMLElement | null;
      const thinkingEl = document.querySelector(".thinking-scroll") as HTMLElement | null;
      const scrollEl = holoEl ?? thinkingEl ?? null;

      const getTop = () => (scrollEl ? scrollEl.scrollTop : window.scrollY);
      const getMax = () =>
        scrollEl
          ? scrollEl.scrollHeight - scrollEl.clientHeight
          : document.body.scrollHeight - window.innerHeight;
      const getVH = () => (scrollEl ? scrollEl.clientHeight : window.innerHeight);

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

      const target = scrollEl ?? window;
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
    return;
  }
  const thinkingEl = document.querySelector(".thinking-scroll") as HTMLElement | null;
  if (thinkingEl) {
    thinkingEl.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function BottomRightHUD() {
  const isMobile = useIsMobile();
  const elapsed = useSessionTime();
  const explored = useExplored();
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
        right: "2rem",
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

        {/* Explored circle */}
        {(() => {
          const { r, g, b } = exploredColor(explored);
          const strokeColor = `rgb(${r},${g},${b})`;
          const fillColor = `rgba(${r},${g},${b},0.13)`;
          const sz = isMobile ? 34 : 40;
          const rad = sz / 2 - 2;
          const circ = 2 * Math.PI * rad;
          const offset = circ * (1 - explored / 100);
          return (
            <div style={{ width: sz, height: sz, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width={sz} height={sz} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
                <circle cx={sz / 2} cy={sz / 2} r={rad - 0.75} fill={fillColor} stroke="none" style={{ transition: "fill 0.6s ease" }} />
                <circle cx={sz / 2} cy={sz / 2} r={rad} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <circle cx={sz / 2} cy={sz / 2} r={rad} fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: "stroke 0.6s ease, stroke-dashoffset 0.4s ease" }} />
              </svg>
              <Compass size={isMobile ? 11 : 13} strokeWidth={1.5} style={{ position: "relative", color: strokeColor, transition: "color 0.6s ease" }} />
            </div>
          );
        })()}

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
