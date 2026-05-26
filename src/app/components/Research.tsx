import { motion } from "motion/react";
import { useState } from "react";
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
    label: "Patent Pending • In Development",
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
    title: "Automated Assessment Generation - Graphs & Language Models",
    subtitle: "Published Research • IJISET • Vol. 9 Special Issue",
    link: "https://ijiset.com/conference/NCISCT-2022/IJISET-NCISCT-220520.pdf",
    bullets: [
      "MCQ distractors must be **semantically plausible** - factually wrong alone fails to separate understanding from guessing",
      "**BERT** surfaces salient spans as pivots; **proper nouns anchor pivots**; **WordNet** and **ConceptNet** generate nearby alternatives through sense traversal",
      "WordNet supplies **hypernym→hyponym chains** with sense disambiguation; ConceptNet adds **part-of** and **related-to** structure when coverage thins; fallback ensures distractor coverage",
      "**Semantic distance** governs selection - distractors must occupy the same conceptual neighbourhood without matching the tested senses; proximity without identity is the key constraint",
    ],
  },
  {
    type: "whitepaper",
    name: "PINNs White Paper",
    title: "Physics-Informed Inference for Partial Observability",
    link: "/research/pinns-whitepaper",
    bullets: [
      "**Partial observability** creates a blind-control problem - sparse telemetry leaves conventional solvers unable to reconstruct what sensors never captured.",
      "**PDE constraints embedded in the training objective** - network fits telemetry while satisfying governing dynamics; physics regularizes, not post-processes.",
      "**Staged training** rebalances telemetry fidelity against PDE adherence; convergence via **residual consistency**, boundary behavior, and physical plausibility.",
      "Physics acts as regularizer under uncertainty - extrapolation stays bounded by governing structure; generalization depends on dynamics, not coverage, alone.",
    ],
  },
  {
    type: "commercial",
    name: "ScholarOS",
    title:
      "Research as Structured Execution - Deterministic Services Over Autonomous Generation",
    link: "/research/scholaros",
    bullets: [
      "Research copilots generate **fluent text without evidence traceability** - grounded synthesis and hallucination look identical; no claim can be audited back.",
      "**Five locked MCP services** cover literature mapping, contradiction detection, hypothesis critique, evidence extraction, and assembly via **schema-defined interfaces**.",
      "Only hypothesis critique is agentic - **bounded to five iterations**; all other stages are deterministic with provenance tracked through **typed artifacts**.",
      "Each claim is **bound to source evidence**; contradiction detection marks where consensus breaks, keeping outputs falsifiable and useful beyond sessions.",
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          overflow: "hidden",
          maxHeight: showOutcome ? "1000px" : "17rem",
          transition: "max-height 0.5s cubic-bezier(0.76, 0, 0.24, 1)",
          ...(!showOutcome
            ? {
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 75%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, black 75%, transparent 100%)",
              }
            : {}),
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
              letterSpacing: "0.02em",
              textAlign: "justify",
              textJustify: "inter-word",
            }}
          >
            {item.subtitle}
          </p>
        )}

        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.06)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {item.bullets.map((bullet, i) => (
            <div
              key={i}
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
        </div>
      </div>

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

  const maxPerRow = isMobile ? 1 : isTablet ? 2 : 3;
  const rows = useEqualRows(items.length, maxPerRow);

  return (
    <section
      id="research"
      style={{
        position: "relative",
        background: "transparent",
        padding: isMobile ? "5rem 4vw" : "4rem 0",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={isMobile ? {} : { padding: "0.85rem 6vw 2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: "0.62rem",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
              }}
            >
              Research
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "rgba(255,255,255,0.07)",
              }}
            />
          </div>

          <div style={{ overflow: "hidden" }}>
            <motion.h2
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              style={{
                fontFamily: FONT_SERIF,
                fontSize: isMobile
                  ? "clamp(1.8rem, 7vw, 4rem)"
                  : "clamp(2.6rem, 4.5vw, 4rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "0.02em",
                color: "#fafaf8",
                margin: 0,
              }}
            >
              Problems worth losing sleep over.
            </motion.h2>
          </div>
        </div>

        {/* Content strip */}
        <div>
          <div style={{ padding: isMobile ? "2rem 0 0" : "1.5rem 6vw 4rem" }}>
            <EqualGridRenderer
              rows={rows}
              renderCard={(idx) => <ResearchCard item={items[idx]} />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
