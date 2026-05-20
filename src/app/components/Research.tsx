import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import type React from "react";
import {
  useIsMobile,
  useIsTablet,
  useIsDesktop,
} from "../../hooks/useMediaQuery";
import { useEqualRows } from "../../hooks/useCollageGrid";
import { EqualGridRenderer } from "./CollageRenderer";

function renderBullet(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} style={{ color: "#e8e0d0", fontWeight: 600 }}>
        {part}
      </strong>
    ) : (
      part
    ),
  );
}
const pinnsPdfUrl = "/PINNs_whitepaper.pdf";

const FONT_SERIF = '"Playfair Display", Georgia, serif';
const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';

type ItemType = "paper" | "whitepaper" | "github" | "commercial";

type ResearchItem = {
  type: ItemType;
  name: string;
  title: string;
  subtitle?: string;
  link: string;
  bullets: [string, string, string, string];
};

const TYPE_META: Record<
  ItemType,
  { label: string; color: string; border: string; bg: string; glow: string }
> = {
  paper: {
    label: "Published",
    color: "#EAB308",
    border: "rgba(234,179,8,0.45)",
    bg: "rgba(234,179,8,0.10)",
    glow: "0 0 2px rgba(234,179,8,0.35)",
  },
  whitepaper: {
    label: "White Paper",
    color: "#10B981",
    border: "rgba(16,185,129,0.45)",
    bg: "rgba(16,185,129,0.10)",
    glow: "0 0 2px rgba(16,185,129,0.35)",
  },
  github: {
    label: "Open Source",
    color: "#60A5FA",
    border: "rgba(96,165,250,0.45)",
    bg: "rgba(96,165,250,0.10)",
    glow: "0 0 2px rgba(96,165,250,0.35)",
  },
  commercial: {
    label: "Commercial Software (In Development)",
    color: "#ffffff",
    border: "rgba(139,92,246,0.55)",
    bg: "rgba(93,33,182,0.22)",
    glow: "0 0 8px rgba(139,92,246,0.35)",
  },
};

const RESEARCH_LABELS = ["Problem", "Method", "System design", "Insight"];

const items: ResearchItem[] = [
  {
    type: "paper",
    name: "NCISCT 2022",
    title: "Automated Assessment Generation — Graphs & Language Models",
    subtitle: "Published Research · IJISET · Vol. 9 Special Issue",
    link: "https://ijiset.com/conference/NCISCT-2022/IJISET-NCISCT-220520.pdf",
    bullets: [
      "MCQ generation fails when distractors are merely wrong — they must be **semantically plausible** enough to separate genuine understanding from guessing.",
      "**BERT** surfaces salient spans, **proper nouns anchor pivots**, and **WordNet / ConceptNet** generate nearby alternatives through hierarchical sense fallback.",
      "WordNet supplies **hypernym→hyponym chains** with sense disambiguation; ConceptNet adds **part-of structure** when lexical coverage thins, keeping selection grounded.",
      "**Semantic distance** is the governing constraint — distractors must stay within the same conceptual neighborhood without matching the tested sense.",
    ],
  },
  {
    type: "whitepaper",
    name: "PINNs White Paper",
    title: "Physics-Informed Inference for Partial Observability",
    link: pinnsPdfUrl,
    bullets: [
      "**Partially observed internal state** creates a blind-control problem — sparse telemetry leaves conventional numerical solvers guessing what sensors never see.",
      "**PDE constraints are embedded inside the training objective** — the network fits observed telemetry while satisfying governing dynamics simultaneously.",
      "**Staged training** rebalances telemetry fidelity against PDE adherence; convergence is read through **residual consistency**, boundary behavior, and physical plausibility.",
      "Physics becomes the regularizer under uncertainty — extrapolation stays bounded by governing structure, so generalization depends on dynamics over coverage.",
    ],
  },
  {
    type: "github",
    name: "PHYSCLIP",
    title:
      "Contrastive Regime Classification — Symbolic and Observed Space Alignment",
    link: "https://github.com/ughshwin/PHYSCLIP",
    bullets: [
      "Physics-informed models assume the governing equation is known — the harder upstream problem is deciding **which regime applies** first.",
      "**Dual encoders** map symbolic descriptions and field states into a **shared latent space**, so regime recognition emerges from cross-modal alignment.",
      "A **contrastive objective** pulls matched pairs together and pushes mismatched apart, making PHYSCLIP a perception layer **before PINN-style enforcement**.",
      "**Latent proximity** carries physical meaning — nearby embeddings reflect regime similarity, enabling interpretable regime identification under partial observability over opaque labels.",
    ],
  },
  {
    type: "commercial",
    name: "ScholarOS",
    title:
      "Research as Structured Execution — Deterministic Services Over Autonomous Generation",
    link: "/research/scholaros",
    bullets: [
      "Research copilots generate **fluent text without evidence traceability** — grounded synthesis and hallucination look identical, so no claim can be audited.",
      "**Five locked MCP services** cover literature mapping, contradiction detection, hypothesis critique, evidence extraction, and assembly through **schema-defined interfaces**.",
      "Only hypothesis critique remains agentic — **bounded to five iterations**; all other stages are deterministic with provenance preserved through **typed artifacts**.",
      "Each claim is **bound to source evidence**; contradiction detection marks where consensus breaks, keeping outputs falsifiable and useful beyond sessions.",
    ],
  },
  {
    type: "commercial",
    name: "controla",
    title:
      "Local Inference That Learns — Routing That Compounds With Every Deployment",
    link: "/research/controla",
    bullets: [
      "**Local inference routing is stateless by default** — prior outcomes are ignored, so each request repeats the same blind dispatch mistakes.",
      "Every request feeds **contextual EWMA weight learning**, so routing adapts to workload; the system **improves as it runs** without retuning.",
      "**Policy updates are replay-validated before promotion** — candidate routes degrading latency, accuracy, or SLA coverage are blocked before reaching live traffic.",
      "Inference becomes a **managed workload** — routing is versioned policy, feedback is structured reward signal, and learning compounds without operator retuning.",
    ],
  },
];

function ResearchCard({ item }: { item: ResearchItem }) {
  const [hovered, setHovered] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  const showOutcome = hovered || revealed;

  return (
    <motion.a
      href={item.link}
      target={item.link.startsWith("/") ? undefined : "_blank"}
      rel={item.link.startsWith("/") ? undefined : "noopener noreferrer"}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={isMobile ? { y: -4 } : { y: -6, scale: 1.025 }}
      transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        if (isMobile && !revealed) {
          e.preventDefault();
          setRevealed(true);
        }
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1.6rem",
        borderRadius: "8px",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.15)"}`,
        background: "transparent",
        transition: "border-color 0.2s, color 0.2s",
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      {/* Name + badge row */}
      <div
        style={{
          display: "flex",
          flexDirection: isDesktop ? "row" : "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "0.5rem",
        }}
      >
        <p
          style={{
            fontFamily: FONT_SERIF,
            fontWeight: 800,
            fontSize: "1.75rem",
            color: "#fafaf8",
            lineHeight: 1.2,
            margin: 0,
            minWidth: 0,
          }}
        >
          {item.name}
        </p>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: "0.52rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            padding: "3px 9px",
            borderRadius: "20px",
            flexShrink: 0,
            alignSelf: "flex-start",
            color: TYPE_META[item.type].color,
            border: `1px solid ${TYPE_META[item.type].border}`,
            background: TYPE_META[item.type].bg,
            boxShadow: TYPE_META[item.type].glow,
          }}
        >
          {TYPE_META[item.type].label}
        </span>
      </div>

      {/* Title (former subtitle) */}
      <p
        style={{
          fontFamily: FONT_SANS,
          fontWeight: 400,
          fontSize: "0.85rem",
          color: "rgba(255,255,255,0.55)",
          lineHeight: 1.45,
          margin: 0,
          textAlign: "justify",
          textJustify: "inter-word",
        }}
      >
        {item.title}
      </p>

      {/* Subtitle */}
      {item.subtitle && (
        <p
          style={{
            fontFamily: FONT_MONO,
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.28)",
            margin: 0,
            letterSpacing: "0.05em",
            textAlign: "justify",
            textJustify: "inter-word",
          }}
        >
          {item.subtitle}
        </p>
      )}

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "rgba(255,255,255,0.06)",
        }}
      />

      {/* Bullets — first 3 always visible; 4th (Insight) revealed on hover */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {item.bullets.slice(0, 3).map((bullet, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "0.65rem",
              alignItems: "flex-start",
              ...(i === 2 && !showOutcome
                ? {
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 20%, transparent 100%)",
                    maskImage:
                      "linear-gradient(to bottom, black 20%, transparent 100%)",
                  }
                : {}),
            }}
          >
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: "0.62rem",
                color: "rgba(255,255,255,0.22)",
                marginTop: "4px",
                flexShrink: 0,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                width: isMobile ? "56px" : "76px",
                lineHeight: 1.5,
              }}
            >
              {RESEARCH_LABELS[i]}
            </span>
            <span
              style={{
                fontFamily: FONT_SANS,
                fontSize: "0.88rem",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.56)",
                textAlign: "justify",
                textJustify: "inter-word",
              }}
            >
              {renderBullet(bullet)}
            </span>
          </div>
        ))}

        {/* 4th bullet (Insight) — fades in on hover */}
        <AnimatePresence>
          {showOutcome && (
            <motion.div
              key="insight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{
                display: "flex",
                gap: "0.65rem",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.62rem",
                  color: "rgba(255,255,255,0.22)",
                  marginTop: "4px",
                  flexShrink: 0,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  width: isMobile ? "56px" : "76px",
                  lineHeight: 1.5,
                }}
              >
                {RESEARCH_LABELS[3]}
              </span>
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: "0.88rem",
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.56)",
                  textAlign: "justify",
                  textJustify: "inter-word",
                }}
              >
                {renderBullet(item.bullets[3])}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Link arrow */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "0.5rem",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: "0.72rem",
            color: hovered
              ? "rgba(255,255,255,0.95)"
              : "rgba(255,255,255,0.35)",
            transition: "color 0.2s",
          }}
        >
          ↗
        </span>
      </div>
    </motion.a>
  );
}

export function Research() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [isStuck, setIsStuck] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = document.querySelector(
      ".hologram-interface",
    ) as HTMLElement | null;
    if (!root) return;
    const check = () => {
      const top = sectionRef.current?.offsetTop ?? 0;
      setIsStuck((prev) => {
        if (!prev && root.scrollTop > top + 10) return true;
        if (prev && root.scrollTop < top + 7) return false;
        return prev;
      });
    };
    root.addEventListener("scroll", check, { passive: true });
    return () => root.removeEventListener("scroll", check);
  }, []);

  const maxPerRow = isMobile ? 1 : isTablet ? 2 : 3;
  const rows = useEqualRows(items.length, maxPerRow);

  return (
    <section
      ref={sectionRef}
      id="research"
      style={{
        padding: isMobile ? "5rem 4vw" : "10rem 6vw",
        background: "transparent",
        position: "relative",
      }}
    >
      {/* Sticky heading block */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          marginLeft: isMobile ? "-4vw" : "-6vw",
          marginRight: isMobile ? "-4vw" : "-6vw",
          paddingLeft: isMobile ? "4vw" : "6vw",
          paddingRight: isMobile ? "4vw" : "6vw",
          paddingTop: "0.85rem",
          paddingBottom: "0.85rem",
          background: isStuck
            ? "linear-gradient(to right, rgba(5,5,8,0.52) 0%, rgba(5,5,8,0.52) 45%, rgba(5,5,8,0) 88%)"
            : "transparent",
          backdropFilter: isStuck ? "blur(6px)" : "none",
          WebkitBackdropFilter: isStuck ? "blur(6px)" : "none",
          transition: "background 0.3s ease",
          marginBottom: isMobile ? "3rem" : "5rem",
        }}
      >
        {/* Section label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            marginBottom: "1rem",
          }}
        >
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: isStuck ? "0.5rem" : "0.62rem",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
              transition: "font-size 0.3s ease",
            }}
          >
            03 — Research & Systems Thinking
          </span>
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(255,255,255,0.07)",
            }}
          />
        </div>

        {/* Section heading */}
        <div style={{ overflow: "hidden", background: "transparent" }}>
          <motion.h2
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            style={{
              fontFamily: FONT_SERIF,
              fontSize: isStuck
                ? isMobile
                  ? "clamp(1.26rem, 4.9vw, 2.8rem)"
                  : "clamp(1.8rem, 3.6vw, 3.3rem)"
                : isMobile
                  ? "clamp(1.8rem, 7vw, 4rem)"
                  : "clamp(3rem, 6vw, 5.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              color: "#fafaf8",
              margin: 0,
              transition: "font-size 0.30s ease",
            }}
          >
            Observe. Abstract. Construct.
          </motion.h2>
        </div>
        {/* Hint */}
        <div style={{ textAlign: "right", marginTop: "0.6rem" }}>
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: "0.58rem",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.28)",
            }}
          >
            Tap to dive deeper
          </span>
        </div>
      </div>

      <EqualGridRenderer
        rows={rows}
        renderCard={(idx) => <ResearchCard item={items[idx]} />}
      />
    </section>
  );
}
