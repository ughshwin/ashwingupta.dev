import { useEffect, useRef, useState } from "react";
import { Hero } from "./components/Hero";
import { HologramInterface } from "./components/HologramInterface";
import { About } from "./components/About";
import { ExperienceTimeline } from "./components/ExperienceTimeline";
import { Impact } from "./components/Impact";
import { Featured } from "./components/Featured";
import { Projects } from "./components/Projects";
import { Recommendations } from "./components/Recommendations";
import { Skills } from "./components/Skills";
import { Contact } from "./components/Contact";
import { useIsMobile } from "../hooks/useMediaQuery";
import { useHashScroll } from "../hooks/useHashScroll";
import { LazyMotion, domAnimation, m, AnimatePresence } from "motion/react";

export default function App() {
  const isMobile = useIsMobile();
  const [showThankYou, setShowThankYou] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbRatio, setThumbRatio] = useState(0.2);
  const thankYouFired = useRef(false);
  useHashScroll();

  useEffect(() => {
    const el = document.querySelector(
      ".hologram-interface",
    ) as HTMLElement | null;
    if (!el) return;

    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      const progress = max > 0 ? el.scrollTop / max : 0;
      setScrollProgress(progress);
      setThumbRatio(
        el.scrollHeight > 0 ? el.clientHeight / el.scrollHeight : 1,
      );
      if (progress >= 0.98 && !thankYouFired.current) {
        thankYouFired.current = true;
        setShowThankYou(true);
        setTimeout(() => setShowThankYou(false), 10000);
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });

    let target = el.scrollTop;
    let rafId: number | null = null;

    const animate = () => {
      const diff = target - el.scrollTop;
      if (Math.abs(diff) < 0.5) {
        el.scrollTop = target;
        rafId = null;
        return;
      }
      el.scrollTop += diff * 0.1;
      rafId = requestAnimationFrame(animate);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const max = el.scrollHeight - el.clientHeight;
      // Sync from actual scrollTop when idle so external scrolls (e.g. instant
      // nav jump on mount) don't leave target stale and snap back to top.
      if (!rafId) target = el.scrollTop;
      target = Math.max(0, Math.min(target + e.deltaY, max));
      if (!rafId) rafId = requestAnimationFrame(animate);
    };

    (window as any).__portfolioScrollTop = (top: number) => {
      target = Math.max(0, Math.min(top, el.scrollHeight - el.clientHeight));
      if (!rafId) rafId = requestAnimationFrame(animate);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onWheel);
      if (rafId) cancelAnimationFrame(rafId);
      delete (window as any).__portfolioScrollTop;
    };
  }, []);

  useEffect(() => {
    if (!showThankYou) {
      setCountdown(10);
      return;
    }
    const id = setInterval(() => {
      setCountdown((n) => (n <= 1 ? (clearInterval(id), 0) : n - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [showThankYou]);

  return (
    <LazyMotion features={domAnimation}>
      {/* Page content - blurred when thank-you is showing */}
      <div
        className="spatial-scene"
        style={{
          filter: showThankYou ? "blur(4px) brightness(0.7)" : "none",
          transition: "filter 0.5s ease",
        }}
      >
        <HologramInterface>
          <Hero />
          <About />
          <ExperienceTimeline />
          <Impact />
          <Featured />
          <Projects />
          <Recommendations />
          <Skills />
          <Contact />
        </HologramInterface>
      </div>

      {/* Awwwards ribbon - fixed, constant through scroll */}
      <div
        id="awwwards"
        style={{
          position: "fixed",
          zIndex: 999,
          transform: "translateY(-50%)",
          top: "50%",
          right: "1rem",
          borderRadius: "8px",
          overflow: "hidden",
          lineHeight: 0,
        }}
      >
        <a
          href="https://www.awwwards.com/sites/an-ai-portfolio-in-the-cosmos"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width={isMobile ? 28 : 42} height={isMobile ? 90.4 : 135.6} viewBox="0 0 53.08 171.358">
            <path fill="#5ABDB2" d="M0 0h53.08v171.358H0z"></path>
            <g fill="white">
              <path d="M20.048 153.585v-2.002l6.752-3.757h-6.752v-1.9h10.23v2.002l-6.752 3.757h6.752v1.9zM29.899 142.382a3.317 3.317 0 0 1-1.359 1.293c-.575.297-1.223.446-1.944.446-.721 0-1.369-.149-1.944-.446a3.317 3.317 0 0 1-1.359-1.293c-.331-.564-.497-1.232-.497-2.003 0-.769.166-1.437.497-2.002a3.332 3.332 0 0 1 1.359-1.294c.575-.297 1.224-.445 1.944-.445.722 0 1.369.148 1.944.445a3.326 3.326 0 0 1 1.359 1.294c.33.565.496 1.233.496 2.002.001.77-.166 1.438-.496 2.003m-1.703-3.348c-.435-.331-.967-.497-1.601-.497s-1.167.166-1.601.497c-.434.332-.65.78-.65 1.345s.217 1.014.65 1.346c.434.33.967.496 1.601.496s1.166-.166 1.601-.496c.434-.332.649-.78.649-1.346.001-.565-.215-1.013-.649-1.345M22.912 134.996v-1.812h1.185c-.43-.283-.752-.593-.973-.929-.219-.336-.329-.732-.329-1.19 0-.479.127-.902.38-1.272.254-.37.635-.633 1.141-.79-.478-.262-.851-.591-1.118-.985a2.221 2.221 0 0 1-.402-1.265c0-.682.2-1.218.599-1.607.4-.391.957-.585 1.668-.585h5.218v1.812H25.37c-.682 0-1.023.303-1.023.907 0 .467.264.85.789 1.146.527.299 1.286.446 2.28.446h2.865v1.813H25.37c-.682 0-1.023.303-1.023.906 0 .468.275.851.826 1.147.551.298 1.352.446 2.404.446h2.704v1.812h-7.369zM21.626 122.457c-.225.224-.502.336-.833.336s-.608-.112-.833-.336a1.128 1.128 0 0 1-.336-.833c0-.331.111-.609.336-.833.225-.225.502-.336.833-.336s.608.111.833.336c.225.224.337.502.337.833 0 .332-.112.608-.337.833m1.286-1.739h7.366v1.813h-7.366v-1.813zM22.912 118.668v-1.812h1.185a3.348 3.348 0 0 1-.951-1.009 2.434 2.434 0 0 1-.351-1.272c0-.681.19-1.229.57-1.644.38-.414.931-.621 1.651-.621h5.263v1.812h-4.722c-.418 0-.727.096-.92.285-.195.19-.293.447-.293.769 0 .302.116.58.351.833.233.254.577.458 1.03.613.453.156.992.234 1.615.234h2.938v1.812h-7.366zM29.833 109.129a3.33 3.33 0 0 1-1.432 1.169 4.535 4.535 0 0 1-1.805.373 4.537 4.537 0 0 1-1.807-.373c-.579-.248-1.057-.638-1.432-1.169s-.563-1.196-.563-1.995c0-.771.183-1.413.549-1.93a3.28 3.28 0 0 1 1.382-1.141 4.221 4.221 0 0 1 1.709-.364h.746v5.071c.447-.02.838-.183 1.168-.49.332-.307.498-.724.498-1.248 0-.41-.093-.754-.277-1.031-.186-.278-.473-.529-.863-.753l.542-1.462c.69.303 1.224.724 1.592 1.265.371.541.556 1.235.556 2.083 0 .799-.188 1.464-.563 1.995m-4.085-3.574c-.41.088-.746.261-1.009.52-.262.258-.395.61-.395 1.06 0 .428.137.784.409 1.067.272.282.604.458.994.525v-3.172zM29.833 100.878c-.375.531-.852.921-1.432 1.169a4.552 4.552 0 0 1-3.612 0c-.579-.248-1.057-.638-1.432-1.169s-.563-1.196-.563-1.995c0-.77.183-1.412.549-1.93a3.278 3.278 0 0 1 1.382-1.14 4.222 4.222 0 0 1 1.709-.365h.746v5.072a1.794 1.794 0 0 0 1.168-.49c.332-.307.498-.724.498-1.249 0-.41-.093-.753-.277-1.031-.186-.277-.473-.528-.863-.753l.542-1.462c.69.302 1.224.724 1.592 1.265.371.541.556 1.234.556 2.083 0 .799-.188 1.464-.563 1.995m-4.085-3.573c-.41.088-.746.261-1.009.519-.262.258-.395.611-.395 1.06 0 .429.137.784.409 1.067.272.282.604.458.994.526v-3.172zM35.481 16.926l-4.782 14.969h-3.266l-2.584-9.682-2.584 9.682h-3.268l-4.781-14.969h3.713l2.673 10.276 2.524-10.276h3.445l2.524 10.276 2.674-10.276zM37.979 27.083c1.426 0 2.495 1.068 2.495 2.495 0 1.425-1.069 2.495-2.495 2.495-1.425 0-2.495-1.07-2.495-2.495-.001-1.427 1.07-2.495 2.495-2.495"></path>
            </g>
          </svg>
        </a>
      </div>

      {/* Scroll progress pill - between ribbon and right edge */}
      <div
        style={{
          position: "fixed",
          right: "6px",
          top: "1rem",
          bottom: "1rem",
          width: "3px",
          zIndex: 998,
          borderRadius: "3px",
          background: "rgba(255,255,255,0.05)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            width: "100%",
            height: `${Math.max(thumbRatio * 100, 8)}%`,
            top: `${scrollProgress * (100 - Math.max(thumbRatio * 100, 8))}%`,
            borderRadius: "3px",
            background: "rgba(255,255,255,0.22)",
          }}
        />
      </div>

      {/* Thank you banner - outside blurred container, transparent bg clips via combined blur */}
      <AnimatePresence>
        {showThankYou && (
          <m.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.2rem",
                padding: isMobile ? "2.5rem 2rem" : "3.5rem 5rem",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                pointerEvents: "auto",
              }}
            >
              <span
                style={{
                  fontFamily:
                    '"Editorial New", "Playfair Display", Georgia, serif',
                  fontSize: isMobile ? "1.3rem" : "1.75rem",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.9)",
                  letterSpacing: "0.01em",
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                Somewhere between the hero and here, you decided to keep going.
                <br />
                <br />
                Thank you for taking the time to know me a little more than you
                already did.
              </span>
              <span
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: isMobile ? "0.85rem" : "0.95rem",
                  color: "rgba(255,255,255,0.45)",
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                Want to check out my articles next?{isMobile ? <br /> : " "}
                <a
                  href="/articles"
                  style={{
                    color: "#4ade80",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(74,222,128,0.4)",
                    paddingBottom: "1px",
                  }}
                >
                  Read them here.
                </a>
              </span>

              {/* Countdown ring */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginTop: "0.4rem",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "52px",
                    height: "52px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="52"
                    height="52"
                    style={{
                      position: "absolute",
                      inset: 0,
                      transform: "rotate(-90deg)",
                    }}
                  >
                    <circle
                      cx="26"
                      cy="26"
                      r="22"
                      fill="none"
                      stroke="rgba(255,255,255,0.07)"
                      strokeWidth="2"
                    />
                    <m.circle
                      cx="26"
                      cy="26"
                      r="22"
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 22}
                      initial={{ strokeDashoffset: 0 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 22 }}
                      transition={{ duration: 10, ease: "linear" }}
                    />
                  </svg>
                  <span
                    style={{
                      fontFamily: '"DM Mono", monospace',
                      fontSize: "1rem",
                      color: "rgba(255,255,255,0.7)",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {countdown}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: '"DM Mono", monospace',
                    fontSize: "0.52rem",
                    letterSpacing: "0.18em",
                    color: "rgba(255,255,255,0.25)",
                    textTransform: "uppercase",
                  }}
                >
                  glad you stayed
                </span>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
