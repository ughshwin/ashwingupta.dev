import { lazy, Suspense, useEffect, useState } from "react";
import { Hero } from "./components/Hero";
import { Cursor } from "./components/Cursor";
import { EnvironmentLayer } from "./components/EnvironmentLayer";
import { AIBackground } from "./components/AIBackground";
import { HologramInterface } from "./components/HologramInterface";
import { useIsMobile } from "../hooks/useMediaQuery";
import { useHashScroll } from "../hooks/useHashScroll";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { motion, AnimatePresence } from "motion/react";
const About = lazy(() => import("./components/About").then((m) => ({ default: m.About })));
const Skills = lazy(() => import("./components/Skills").then((m) => ({ default: m.Skills })));
const Research = lazy(() => import("./components/Research").then((m) => ({ default: m.Research })));
const Projects = lazy(() => import("./components/Projects").then((m) => ({ default: m.Projects })));
const Contact = lazy(() => import("./components/Contact").then((m) => ({ default: m.Contact })));

export default function App() {
  const isMobile = useIsMobile();
  const [showTop, setShowTop] = useState(false);
  useHashScroll();

  useEffect(() => {
    const el = document.querySelector(".hologram-interface") as HTMLElement | null;
    if (!el) return;
    const onScroll = () => setShowTop(el.scrollTop > el.clientHeight * 0.6);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="spatial-scene"
      style={{ cursor: isMobile ? "auto" : "none" }}
    >
      <EnvironmentLayer />
      <AIBackground />
      <Cursor />
      <HologramInterface>
        <Hero />
        <Suspense fallback={null}>
          <About />
          <Skills />
          <Research />
          <Projects />
          <Contact />
        </Suspense>
      </HologramInterface>
      <Analytics />
      <SpeedInsights />

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            onClick={() => document.querySelector(".hologram-interface")?.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              position: "fixed",
              bottom: "2rem",
              right: "2rem",
              zIndex: 100,
              width: "2.6rem",
              height: "2.6rem",
              borderRadius: "4px",
              border: "none",
              background: "linear-gradient(to top, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 60%, rgba(255,255,255,0) 100%)",
              color: "rgba(255,255,255,0.45)",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isMobile ? "pointer" : "none",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "linear-gradient(to top, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.07) 60%, rgba(255,255,255,0) 100%)";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.95)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "linear-gradient(to top, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 60%, rgba(255,255,255,0) 100%)";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)";
            }}
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
