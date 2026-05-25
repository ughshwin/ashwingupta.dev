import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Hero } from "./components/Hero";
import { HologramInterface } from "./components/HologramInterface";
import { useIsMobile } from "../hooks/useMediaQuery";
import { useHashScroll } from "../hooks/useHashScroll";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronUp } from "lucide-react";

const About = lazy(() =>
  import("./components/About").then((m) => ({ default: m.About })),
);
const Recommendations = lazy(() =>
  import("./components/Recommendations").then((m) => ({
    default: m.Recommendations,
  })),
);
const Currently = lazy(() =>
  import("./components/Currently").then((m) => ({ default: m.Currently })),
);
const Skills = lazy(() =>
  import("./components/Skills").then((m) => ({ default: m.Skills })),
);
const ExperienceTimeline = lazy(() =>
  import("./components/ExperienceTimeline").then((m) => ({
    default: m.ExperienceTimeline,
  })),
);
const Featured = lazy(() =>
  import("./components/Featured").then((m) => ({ default: m.Featured })),
);
const Research = lazy(() =>
  import("./components/Research").then((m) => ({ default: m.Research })),
);
const Projects = lazy(() =>
  import("./components/Projects").then((m) => ({ default: m.Projects })),
);

const Contact = lazy(() =>
  import("./components/Contact").then((m) => ({ default: m.Contact })),
);

export default function App() {
  const isMobile = useIsMobile();
  const [showTop, setShowTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);
  const [countdown, setCountdown] = useState(10);
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
      setShowTop(el.scrollTop > el.clientHeight * 0.6);
      setScrollProgress(progress);
      if (progress >= 0.98 && !thankYouFired.current) {
        thankYouFired.current = true;
        setShowThankYou(true);
        setTimeout(() => setShowThankYou(false), 10000);
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
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

  const btnSize = isMobile ? 42 : 52;
  const btnR = btnSize / 2 - 2;
  const btnCirc = 2 * Math.PI * btnR;

  return (
    <>
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
          <Suspense fallback={null}>
            <About />
            <Skills />
            <ExperienceTimeline />
            <Recommendations />
            <Featured />
            <Research />
            <Projects />
            <Contact />
          </Suspense>
        </HologramInterface>
        <Analytics />
        <SpeedInsights />
      </div>

      {/* Back to top - outside blurred container so it stays sharp */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            onClick={() =>
              document
                .querySelector(".hologram-interface")
                ?.scrollTo({ top: 0, behavior: "smooth" })
            }
            style={{
              position: "fixed",
              bottom: "2rem",
              right: "2rem",
              zIndex: 100,
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
                cx={btnSize / 2}
                cy={btnSize / 2}
                r={btnR}
                fill="none"
                stroke="#4ade80"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={btnCirc}
                strokeDashoffset={btnCirc * (1 - scrollProgress)}
                style={{ transition: "stroke-dashoffset 0.15s ease" }}
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

      {/* Thank you banner - outside blurred container, transparent bg clips via combined blur */}
      <AnimatePresence>
        {showThankYou && (
          <motion.div
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
                    <motion.circle
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
