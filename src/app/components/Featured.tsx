import { motion } from "motion/react";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import type React from "react";
import { useIsMobile, useIsDesktop } from "../../hooks/useMediaQuery";
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

const FONT_SERIF = '"Playfair Display", Georgia, serif';
const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';

type ItemType = "production" | "patent" | "thesis" | "open-source";

type FeaturedItem = {
  type: ItemType;
  name: string;
  title: string;
  subtitle: string;
  link: string | null;
  bullets: [string, string, string, string];
};

const TYPE_META: Record<
  ItemType,
  { label: string; color: string; border: string; bg: string; glow: string }
> = {
  production: {
    label: "Client Delivery",
    color: "#4ade80",
    border: "rgba(74,222,128,0.45)",
    bg: "rgba(74,222,128,0.10)",
    glow: "0 0 4px rgba(74,222,128,0.28)",
  },
  patent: {
    label: "Patent Pending · In Development",
    color: "#ffffff",
    border: "rgba(139,92,246,0.55)",
    bg: "rgba(93,33,182,0.22)",
    glow: "0 0 8px rgba(139,92,246,0.35)",
  },
  thesis: {
    label: "Best Outgoing Project '23",
    color: "#EAB308",
    border: "rgba(234,179,8,0.45)",
    bg: "rgba(234,179,8,0.10)",
    glow: "0 0 4px rgba(234,179,8,0.28)",
  },
  "open-source": {
    label: "Open Source",
    color: "#60A5FA",
    border: "rgba(96,165,250,0.45)",
    bg: "rgba(96,165,250,0.10)",
    glow: "0 0 4px rgba(96,165,250,0.28)",
  },
};

const LABELS = ["Context", "Approach", "System", "Outcome"];

const ITEMS: FeaturedItem[] = [
  {
    type: "production",
    name: "Conversational Analytics",
    title:
      "Real-Time Conversational AI - SIP Voice Infrastructure at Production Scale",
    subtitle: "Coforge - HSBC · Jun 2024 – Present",
    link: "/work/hsbc",
    bullets: [
      "GIL-bound threading serialised all audio onto one core on a **32-core VM** - **20 concurrent calls**, 31 cores idle, CPU utilisation capped below **20%**.",
      "**CPU-pinned** parallel processes via Linux **taskset** escaped the GIL; **asyncio + uvloop** replaced threading - each SIP session became a coroutine across SBC, STT, and LLM stages.",
      "Packer automated GCE image builds; **SIPp** validated **2,000** concurrent users; n2-standard-32 → c4-standard-8 gave **30–40%** longer transcripts; GCP log correlator scanned **250K+** lines in <5s, cutting MTTR to ~10 min.",
      "**20 → 140–160** sessions/VM (**7×**); **1,600+** peak at <**300ms** E2E, <**5%** packet loss; compute **$118K → $8K/month** (~**$1.3M/yr** saved); **Best Team Award** - HSBC Account.",
    ],
  },
  {
    type: "patent",
    name: "controla",
    title:
      "Local-First Self-Improving Inference OS - Routing That Compounds With Every Deployment",
    subtitle: "Personal · Patent Pending · In Active Development",
    link: "/research/controla",
    bullets: [
      "Local inference routing is **stateless** - prior outcomes ignored, blind dispatch repeated indefinitely; no unified API surface across modalities.",
      "**19 backends** across **7 modalities** - text, STT, TTS, image gen, embeddings, vision, reasoning - under one **OpenAI-compatible API**; not a proxy, a control plane.",
      "Every request classified, scored across **6 dimensions** (capability, performance, resource, load, reliability, context), queued in Redis, dispatched, observed. **EWMA** weights per (backend, task_type, complexity) persist across restarts.",
      "Routing accuracy compounds with deployment time - versioned policy, reward signals, and **ReplayEngine** regression gating. No retuning.",
    ],
  },
  {
    type: "production",
    name: "Here.app",
    title:
      "163-Language Vehicle Intelligence - Multilingual RAG at Enterprise Scale",
    subtitle: "Gida Technologies / HDFC ERGO · 2023–2024",
    link: "/work/here-app",
    bullets: [
      "Standard chatbots failed on structured vehicle spec data - inconsistent answers drove manual escalation at **HDFC ERGO**, one of India's largest general insurers.",
      "Multilingual **RAG** pipeline with structured retrieval, language-aware chunking, and per-language factual validation - **163 languages** as first-class targets, not as post-processing.",
      "**QA-gated retrieval** validates lookup quality before generation; structured vehicle database with image-linked attributes as single source of truth across **163 languages**.",
      "**~97% factual accuracy** on vehicle spec queries; autonomous sales-support resolution at **HDFC ERGO** scale; reduced manual escalation across full product catalogue.",
    ],
  },
  {
    type: "thesis",
    name: "PINNs",
    title:
      "Physics-Informed Neural Networks - Dual-Loss Framework for Multi-Domain Simulation",
    subtitle: "BMS College of Engineering · Final Year Thesis · 2022–23",
    link: "/research/pinns",
    bullets: [
      "Purely data-driven physics simulation demanded large labeled datasets - sparse data let models ignore governing equations, producing physically implausible solutions.",
      "Dual-loss **PINN** framework embedding **PDE/ODE** constraints directly into the optimization objective beside data loss - physics constraints act as the regularizer.",
      "Validated across **6 benchmarks**: Burgers' equation, **1D heat conduction**, fixed-fixed column deflection, cantilever deflection, transient cooling under Neumann and Dirichlet conditions.",
      "Stable convergence across **fluid**, **structural**, and **thermal** domains with limited labeled data; **Best Outgoing Project** - Mechanical Engineering, BMSCE, 2022–23.",
    ],
  },
  {
    type: "open-source",
    name: "PHYSCLIP",
    title:
      "Contrastive Regime Classification - Symbolic and Observed Space Alignment",
    subtitle: "Personal · Open Source",
    link: "/research/physclip",
    bullets: [
      "Physics-informed models assume the governing equation is known - the harder upstream problem is **regime classification**: which regime applies to the observed field.",
      "Dual encoders map symbolic descriptions (**PDE**) and field observations into a shared latent space; regime recognition emerges from cross-modal alignment, not hand-coded rules.",
      "Contrastive objective pulls matched (description, observation) pairs together, pushes mismatched apart - **PHYSCLIP** as a perception layer upstream of **PINN**-style enforcement.",
      "Latent proximity carries physical meaning - nearby embeddings indicate similar regimes, enabling interpretable identification under partial observability.",
    ],
  },
];

// ── Card ──────────────────────────────────────────────────────────────────
function FeaturedCard({ item }: { item: FeaturedItem }) {
  const [hovered, setHovered] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  const showOutcome = hovered || revealed;

  const meta = TYPE_META[item.type];
  const isLink = !!item.link;

  const inner = (
    <>
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
        {/* Name + badge */}
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
              color: meta.color,
              border: `1px solid ${meta.border}`,
              background: meta.bg,
              boxShadow: meta.glow,
            }}
          >
            {meta.label}
          </span>
        </div>

        {/* Title */}
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

        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
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
                {LABELS[i]}
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

      {isLink && (
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
      )}
    </>
  );

  const sharedStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    padding: "1.6rem",
    borderRadius: "8px",
    border: `1px solid ${hovered ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.15)"}`,
    background: "transparent",
    transition: "border-color 0.2s",
    textDecoration: "none",
    color: "inherit",
    minWidth: 0,
    overflow: "hidden",
    cursor: isLink ? "pointer" : "default",
  };

  if (isLink) {
    return (
      <motion.a
        href={item.link!}
        target={item.link!.startsWith("/") ? undefined : "_blank"}
        rel={item.link!.startsWith("/") ? undefined : "noopener noreferrer"}
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
        style={sharedStyle}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (isMobile) setRevealed((r) => !r);
      }}
      style={sharedStyle}
    >
      {inner}
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────
export function Featured() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const headerGapRef = useRef<HTMLDivElement>(null);
  const maxOffsetRef = useRef(0);
  const cachedTopRef = useRef<number | null>(null);

  const [vpH, setVpH] = useState(() =>
    typeof window !== "undefined" ? window.innerHeight : 900,
  );
  const [sectionH, setSectionH] = useState(() =>
    typeof window !== "undefined" ? window.innerHeight : 900,
  );

  useEffect(() => {
    if (isMobile) return;
    const measure = () => {
      const header = headerRef.current;
      const inner = innerRef.current;
      if (!header || !inner) return;
      const vh = window.innerHeight;
      const headerH = header.offsetHeight;
      const contentH = inner.scrollHeight;
      const stripH = Math.max(0, vh - headerH);
      const maxOffset = Math.max(0, contentH - stripH);
      maxOffsetRef.current = maxOffset;
      cachedTopRef.current = null;
      setVpH(vh);
      setSectionH(vh + maxOffset);
    };
    requestAnimationFrame(measure);
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const scroller = document.querySelector(
      ".hologram-interface",
    ) as HTMLElement | null;
    const section = sectionRef.current;
    if (!scroller || !section) return;

    const measureTop = () => {
      let acc = 0;
      let el: HTMLElement | null = section;
      while (el && el !== scroller) {
        acc += el.offsetTop;
        el = el.offsetParent as HTMLElement | null;
      }
      cachedTopRef.current = acc;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (cachedTopRef.current === null) measureTop();
        const raw = scroller.scrollTop - (cachedTopRef.current ?? 0);
        const offset = Math.max(0, Math.min(maxOffsetRef.current, raw));
        if (innerRef.current) {
          innerRef.current.style.transform = `translateY(-${offset}px)`;
        }
        const compressRatio = Math.min(1, offset / 100);
        const gapPx = 80 * (1 - compressRatio) + 20 * compressRatio;
        if (headerGapRef.current) {
          headerGapRef.current.style.marginBottom = `${gapPx}px`;
        }
      });
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(
      "resize",
      () => {
        cachedTopRef.current = null;
      },
      { passive: true },
    );
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  useLayoutEffect(() => {
    if (isMobile) return;
    const scroller = document.querySelector(
      ".hologram-interface",
    ) as HTMLElement | null;
    const section = sectionRef.current;
    if (!scroller || !section || !innerRef.current) return;
    let acc = 0;
    let el: HTMLElement | null = section;
    while (el && el !== scroller) {
      acc += el.offsetTop;
      el = el.offsetParent as HTMLElement | null;
    }
    cachedTopRef.current = acc;
    const raw = scroller.scrollTop - acc;
    const offset = Math.max(0, Math.min(maxOffsetRef.current, raw));
    innerRef.current.style.transform = `translateY(-${offset}px)`;
    if (headerGapRef.current) {
      const compressRatio = Math.min(1, offset / 100);
      headerGapRef.current.style.marginBottom = `${80 * (1 - compressRatio) + 20 * compressRatio}px`;
    }
  }, [isMobile, sectionH]);

  const maxPerRow = isMobile ? 1 : 3;
  const rows = useEqualRows(ITEMS.length, maxPerRow);

  return (
    <section
      ref={sectionRef}
      id="featured"
      style={{
        position: "relative",
        height: isMobile ? "auto" : sectionH,
        background: "transparent",
        ...(isMobile && { padding: "5rem 4vw" }),
      }}
    >
      <div
        style={
          isMobile
            ? {}
            : {
                position: "sticky",
                top: 0,
                height: vpH,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }
        }
      >
        {/* Header */}
        <div
          ref={headerRef}
          style={isMobile ? {} : { padding: "0.85rem 6vw 2rem" }}
        >
          <div
            ref={headerGapRef}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: isMobile ? "2rem" : "80px",
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
              Featured
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
              What the arc produced.
            </motion.h2>
          </div>
        </div>

        {/* Content strip */}
        <div
          style={
            isMobile
              ? {}
              : { flex: 1, position: "relative", overflow: "hidden" }
          }
        >
          <div
            ref={innerRef}
            style={
              isMobile
                ? { paddingTop: "2rem" }
                : {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    padding: "1.5rem 6vw 4rem",
                  }
            }
          >
            <EqualGridRenderer
              rows={rows}
              renderCard={(idx) => <FeaturedCard item={ITEMS[idx]} />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
