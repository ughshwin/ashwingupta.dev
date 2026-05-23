import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "../../hooks/useMediaQuery";

const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';

// Update this block monthly — it should reflect what's actively being built right now.
// Last updated: 2026-05
const currentStatus = [
  {
    label: "Controla",
    detail:
      "Local inference OS with contextual EWMA weight learning. Patent pending. Not open-sourced yet.",
  },
  {
    label: "ScholarOS",
    detail:
      "Structured research execution — five deterministic MCP services, DAG-executed, fully local. In active development.",
  },
];

export function Currently() {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        padding: isMobile ? "0 4vw 2rem" : "0 6vw 2rem",
        background: "transparent",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "1rem" : "3rem",
          alignItems: isMobile ? "flex-start" : "flex-start",
          padding: "1.2rem 1.6rem",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "6px",
          maxWidth: isMobile ? "100%" : "680px",
        }}
      >
        {/* Label */}
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: "0.55rem",
            letterSpacing: "0.22em",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            paddingTop: "2px",
            flexShrink: 0,
          }}
        >
          Currently
        </span>

        {/* Status lines */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          {currentStatus.map(({ label, detail }) => (
            <p
              key={label}
              style={{
                fontFamily: FONT_SANS,
                fontSize: "0.83rem",
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.5)",
                margin: 0,
              }}
            >
              <span
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontWeight: 500,
                }}
              >
                {label}
              </span>
              {" — "}
              {detail}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
