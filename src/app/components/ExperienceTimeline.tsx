import { useEffect, useMemo, useRef, useState } from "react";
import { useIsMobile } from "../../hooks/useMediaQuery";

const FONT_SERIF = '"Playfair Display", Georgia, serif';
const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';

const CLR = {
  bmsce: "#6fa3ff",
  outlawed: "#9898c0",
  cellstrat: "#4dd98a",
  iisc: "#c87eff",
  gida: "#ffaa2e",
  coforge: "#2ed4c8",
  iiitb: "#88c0ff",
} as const;

type EntryId = keyof typeof CLR;
type Weight = "early" | "mid" | "recent";
type Track = "professional" | "education";

type Entry = {
  id: EntryId;
  track: Track;
  weight: Weight;
  role: string;
  company: string;
  period: string;
  start: Date;
  end: Date | "present";
  bullets: string[];
};

// ── Bar content layout constants ───────────────────────────────────────────
const PAD_X = 14;
const PAD_TOP = 12;
const PAD_BOTTOM = 16;
const BULLET_MARK = 14;
const ROLE_H = 20;
const COMPANY_H = 12;
const DIVIDER_H = 15;
const BAR_HDR_H = PAD_TOP + ROLE_H + COMPANY_H + DIVIDER_H;
const BULLET_GAP = 4;
const FONT_PX = 13.2;
const FONT_LH = 1.48;

const MOBILE_FONT_PX = 11.2;

const _measureCache = new Map<string, number>();

function measureBarH(e: Entry, barWidth: number, fontPx = FONT_PX): number {
  const key = `${e.id}-${Math.round(barWidth)}-${fontPx}-${e.bullets.length}`;
  if (_measureCache.has(key)) return _measureCache.get(key)!;

  const textW = barWidth - PAD_X * 2 - BULLET_MARK;
  let bulletsH = 0;

  if (typeof window !== "undefined" && textW > 0) {
    try {
      const ctx = document.createElement("canvas").getContext("2d")!;
      ctx.font = `${fontPx}px "DM Sans", sans-serif`;
      const lineH = fontPx * FONT_LH;
      e.bullets.forEach((bullet, bi) => {
        const words = bullet.split(" ");
        let lines = 0,
          cur = "";
        for (const w of words) {
          const test = cur ? `${cur} ${w}` : w;
          if (ctx.measureText(test).width > textW && cur) {
            lines++;
            cur = w;
          } else cur = test;
        }
        if (cur) lines++;
        bulletsH += Math.ceil(lines * lineH);
        if (bi < e.bullets.length - 1) bulletsH += BULLET_GAP;
      });
    } catch {
      bulletsH = e.bullets.length * Math.ceil(fontPx * FONT_LH);
    }
  } else {
    bulletsH = e.bullets.length * Math.ceil(fontPx * FONT_LH);
  }

  const h = BAR_HDR_H + bulletsH + PAD_BOTTOM;
  _measureCache.set(key, h);
  return h;
}

// ── Data ──────────────────────────────────────────────────────────────────
const ENTRIES: Entry[] = [
  {
    id: "bmsce",
    track: "education",
    weight: "early",
    role: "B.E. Mechanical Engineering",
    company: "BMS College of Engineering",
    period: "Aug 2019 – May 2023",
    start: new Date(2019, 7),
    end: new Date(2023, 4),
    bullets: [
      "Founder & mentor — Augment.AI, BMSCE's AI club",
      "Sponsorship Head, UTSAV '22 — signed MoUs · raised >50% of total budget in 14 days",
      "IEEE Joint Secretary · 75+ events · chapter ranked #2 globally · co-founded CS chapter",
      "Best Outgoing Project '23 — PINNs across fluid, structural & thermal simulation",
      "Published: MCQ generation via graph + LLMs — NCISCT 2022",
    ],
  },
  {
    id: "outlawed",
    track: "professional",
    weight: "early",
    role: "Graphic Designer",
    company: "OutLawed",
    period: "Jan 2020 – Oct 2022",
    start: new Date(2020, 0),
    end: new Date(2022, 9),
    bullets: [
      "Visual identity, event collateral & social content for a teaching NGO",
      "First audience feedback loop — iteration under zero-budget constraints",
    ],
  },
  {
    id: "cellstrat",
    track: "professional",
    weight: "early",
    role: "AI Product Developer",
    company: "CellStrat",
    period: "Feb 2021 – Dec 2021",
    start: new Date(2021, 1),
    end: new Date(2021, 11),
    bullets: [
      "Early GPT-era enterprise ML — among first Indian teams shipping",
      "NLP pipelines: document classification & processing for enterprise clients",
      "Full lifecycle: curation → training → eval → deploy → client handoff",
    ],
  },
  {
    id: "iisc",
    track: "professional",
    weight: "early",
    role: "Head of Machine Learning",
    company: "IISc — NMCAD Lab",
    period: "Jan 2022 – Sep 2022",
    start: new Date(2022, 0),
    end: new Date(2022, 8),
    bullets: [
      "eVTOL aerodynamic & structural optimisation under Prof. Harursampath",
      "Physics-constrained surrogate ML to reduce FEM simulation cost · 5 projects across fluid, structural & thermal domains",
      "Stable convergence with a fraction of the labelled data required by classical simulation",
    ],
  },
  {
    id: "gida",
    track: "professional",
    weight: "mid",
    role: "Data Scientist",
    company: "Gida Technologies",
    period: "Jan 2023 – May 2024",
    start: new Date(2023, 0),
    end: new Date(2024, 4),
    bullets: [
      "Here.app (HDFC ERGO) — 163-lang multilingual RAG · 97% factual accuracy",
      "Prismforce Skill Graph — +30% relevance · sub-50ms on NVIDIA T4",
      "Laminar / Metamorph / Polymorph — AI CMS · no-code chatbots · cURL→20+ lang API",
    ],
  },
  {
    id: "coforge",
    track: "professional",
    weight: "recent",
    role: "AI Engineer",
    company: "Coforge",
    period: "Jun 2024 – Present",
    start: new Date(2024, 5),
    end: "present",
    bullets: [
      "Conversational Analytics (HSBC) — SBC→STT→LLM on GCP/RHEL · authored LLD + orchestration architecture",
      "GIL fix: CPU-pinned procs + asyncio/uvloop · 20→140–160 sessions/VM · 1,600+ concurrent",
      "Packer GCE automation · GCP log correlator: 250K lines <5s · MTTR 1–2hr→~10min",
      "Compute: $118K→$8K/month (~$1.3M/yr) · Azure infra intelligence · Amex GBT RAG",
      "Best Team Award - HSBC Account",
      "Pat on Back — Think Customer · individual delivery innovation & excellence",
      "Java Spring AI trainer · 130+ participants · 81% voted-preferred · NPS +50",
    ],
  },
  {
    id: "iiitb",
    track: "education",
    weight: "mid",
    role: "Executive Diploma, AI & ML",
    company: "IIIT Bangalore",
    period: "Oct 2025 – Mar 2027",
    start: new Date(2025, 9),
    end: new Date(2027, 2),
    bullets: [
      "Dual specialisation — MLOps, GenAI & Agentic AI",
      "Concurrent with Coforge — formalising the theory behind production systems",
      "Structural ML · probabilistic reasoning · optimisation · MLOps at scale",
    ],
  },
];

const PRO = ENTRIES.filter((e) => e.track === "professional");
const EDU = ENTRIES.filter((e) => e.track === "education");

const ORIGIN = new Date(2019, 0, 1);
const AXIS_END = new Date(2027, 6, 1);
const TODAY = new Date(2026, 4, 1);
const YEAR_MARKS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027];

function toMonths(d: Date): number {
  return (
    (d.getFullYear() - ORIGIN.getFullYear()) * 12 +
    (d.getMonth() - ORIGIN.getMonth())
  );
}
const TOTAL_MONTHS = toMonths(AXIS_END);

const PRO_PROJ = [...PRO].sort((a, b) => a.start.getTime() - b.start.getTime());
const EDU_PROJ = [...EDU].sort((a, b) => a.start.getTime() - b.start.getTime());

function assignLanes(entries: Entry[]): Map<EntryId, number> {
  const sorted = [...entries].sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  );
  const laneEnd: number[] = [];
  const out = new Map<EntryId, number>();
  for (const e of sorted) {
    const endM = toMonths(e.end === "present" ? TODAY : (e.end as Date)) + 1;
    let lane = laneEnd.findIndex((m) => m <= toMonths(e.start));
    if (lane === -1) lane = laneEnd.length;
    laneEnd[lane] = endM;
    out.set(e.id, lane);
  }
  return out;
}

const PRO_LANE = assignLanes(PRO);
const EDU_LANE = assignLanes(EDU);
const PRO_PROJ_LANE = assignLanes(PRO);
const EDU_PROJ_LANE = assignLanes(EDU);

// ── Vertical chart layout constants ──────────────────────────────────────
const HEADER_H = 220;
const CHART_PAD_T = 60;
const CHART_PAD_B = 80;
const CHART_EDGE_L = 40;
const CHART_EDGE_R = 40;
const CHART_MULT_V = 2.8;
const SPINE_RATIO = 0.5;
const PRO_SPINE_X_GAP = 40; // zone on spine side for year labels
const EDU_SPINE_X_GAP = 40;
const PROJ_W = 2; // width of each projection strip
const PROJ_X_GAP = 16; // gap between parallel strips in the band
const BAR_X_GAP = 22; // gap from projection band edge to card column
const MAX_PRO_LANE_W = 320;
const MAX_EDU_LANE_W = 380;

const N_PRO_PROJ_ROWS = new Set(assignLanes(PRO).values()).size;
const N_EDU_PROJ_ROWS = new Set(assignLanes(EDU).values()).size;

const ALL_LANE = assignLanes(ENTRIES); // combined — used for mobile EDU card centering

// ── Mobile Gantt constants ─────────────────────────────────────────────────
const MOBILE_SPINE_X_PX = 28;
const MOBILE_SPINE_GAP = 6;
const MOBILE_PROJ_W = 2;
const MOBILE_PROJ_X_GAP = 6;
const MOBILE_INTER_BAND_GAP = 4; // gap between pro and edu strip bands
const MOBILE_BAR_X_GAP = 14;
const MOBILE_CARD_MARGIN_R = 8;
const MOBILE_HEADER_H = 140;

function buildMobileDims(vpW: number, vpH: number) {
  const chartH = Math.max(vpH * CHART_MULT_V, 2400);
  const monthPx = (chartH - CHART_PAD_T - CHART_PAD_B) / TOTAL_MONTHS;
  const STRIP_H = vpH - MOBILE_HEADER_H;
  const SPINE_X = MOBILE_SPINE_X_PX;

  const toPy = (d: Date) =>
    CHART_PAD_T + (TOTAL_MONTHS - toMonths(d)) * monthPx;

  const bH = (s: Date, e: Date | "present") => {
    const endM = e === "present" ? toMonths(TODAY) : toMonths(e as Date);
    return Math.max(monthPx * 2, (endM - toMonths(s)) * monthPx);
  };

  // Two separate strip bands — mirrors the desktop's dual-track layout,
  // both placed to the right of the spine instead of left/right of it.
  const proBandW =
    N_PRO_PROJ_ROWS * MOBILE_PROJ_W +
    Math.max(0, N_PRO_PROJ_ROWS - 1) * MOBILE_PROJ_X_GAP;
  const eduBandW =
    N_EDU_PROJ_ROWS * MOBILE_PROJ_W +
    Math.max(0, N_EDU_PROJ_ROWS - 1) * MOBILE_PROJ_X_GAP;

  const proStripStart = SPINE_X + MOBILE_SPINE_GAP;
  const eduStripStart = proStripStart + proBandW + MOBILE_INTER_BAND_GAP;
  const cardLeft = eduStripStart + eduBandW + MOBILE_BAR_X_GAP;
  const laneW = Math.max(160, vpW - MOBILE_CARD_MARGIN_R - cardLeft);

  const barLeft = (_id: EntryId) => cardLeft;

  // Strip X — pro uses PRO_PROJ_LANE, edu uses EDU_PROJ_LANE (track-specific)
  const projLeft = (e: Entry) => {
    if (e.track === "professional") {
      const row = PRO_PROJ_LANE.get(e.id) ?? 0;
      return proStripStart + row * (MOBILE_PROJ_W + MOBILE_PROJ_X_GAP);
    }
    const row = EDU_PROJ_LANE.get(e.id) ?? 0;
    return eduStripStart + row * (MOBILE_PROJ_W + MOBILE_PROJ_X_GAP);
  };

  const entryH: Partial<Record<EntryId, number>> = {};
  const collapsedEntryH: Partial<Record<EntryId, number>> = {};
  for (const e of ENTRIES) {
    entryH[e.id] = measureBarH(e, laneW, MOBILE_FONT_PX);
    collapsedEntryH[e.id] = measureBarH(
      { ...e, bullets: e.bullets.slice(0, 2) },
      laneW,
      MOBILE_FONT_PX,
    );
  }

  return {
    chartH,
    monthPx,
    STRIP_H,
    SPINE_X,
    toPy,
    bH,
    barLeft,
    laneW,
    entryH: entryH as Record<EntryId, number>,
    collapsedEntryH: collapsedEntryH as Record<EntryId, number>,
    projLeft,
    maxOffset: Math.max(0, chartH - STRIP_H),
  };
}

function buildDims(vpW: number, vpH: number) {
  const chartH = Math.max(vpH * CHART_MULT_V, 2400);
  const monthPx = (chartH - CHART_PAD_T - CHART_PAD_B) / TOTAL_MONTHS;
  const STRIP_H = vpH - HEADER_H;
  const SPINE_X = Math.round(vpW * SPINE_RATIO);

  // recent = small Y (top), old = large Y (bottom)
  const toPy = (d: Date) =>
    CHART_PAD_T + (TOTAL_MONTHS - toMonths(d)) * monthPx;

  // Duration height for projection strips — time-proportional
  const bH = (s: Date, e: Date | "present") => {
    const endM = e === "present" ? toMonths(TODAY) : toMonths(e as Date);
    return Math.max(monthPx * 2, (endM - toMonths(s)) * monthPx);
  };

  // ── Pro side: all strips in one band near spine, all cards in one column ─
  const proProjBandW =
    N_PRO_PROJ_ROWS * PROJ_W + Math.max(0, N_PRO_PROJ_ROWS - 1) * PROJ_X_GAP;
  const proCardLeft = SPINE_X + PRO_SPINE_X_GAP + proProjBandW + BAR_X_GAP;
  const proLaneW = Math.min(
    MAX_PRO_LANE_W,
    Math.max(100, vpW - CHART_EDGE_R - proCardLeft),
  );
  // Every pro card starts at the same X
  const proBarLeft = (_id: EntryId) => proCardLeft;
  // Strip row 0 nearest spine, row 1 further
  const proProj_left = (e: Entry) => {
    const row = PRO_PROJ_LANE.get(e.id) ?? 0;
    return SPINE_X + PRO_SPINE_X_GAP + row * (PROJ_W + PROJ_X_GAP);
  };

  // ── Edu side: all strips in one band near spine, all cards in one column ─
  const eduProjBandW =
    N_EDU_PROJ_ROWS * PROJ_W + Math.max(0, N_EDU_PROJ_ROWS - 1) * PROJ_X_GAP;
  const eduCardRight = SPINE_X - EDU_SPINE_X_GAP - eduProjBandW - BAR_X_GAP;
  const eduLaneW = Math.min(
    MAX_EDU_LANE_W,
    Math.max(100, eduCardRight - CHART_EDGE_L),
  );
  // Every edu card ends at the same X (right-aligned against the strip band)
  const eduBarLeft = (_id: EntryId) => eduCardRight - eduLaneW;
  // Strip row 0 nearest spine, row 1 further left
  const eduProj_left = (e: Entry) => {
    const row = EDU_PROJ_LANE.get(e.id) ?? 0;
    return SPINE_X - EDU_SPINE_X_GAP - PROJ_W - row * (PROJ_W + PROJ_X_GAP);
  };

  // ── Content heights — cards sized to fit their text ────────────────────
  const entryH: Partial<Record<EntryId, number>> = {};
  const collapsedEntryH: Partial<Record<EntryId, number>> = {};
  for (const e of ENTRIES) {
    const laneW = e.track === "professional" ? proLaneW : eduLaneW;
    entryH[e.id] = measureBarH(e, laneW);
    collapsedEntryH[e.id] = measureBarH(
      { ...e, bullets: e.bullets.slice(0, 1) },
      laneW,
    );
  }

  return {
    chartH,
    monthPx,
    STRIP_H,
    SPINE_X,
    toPy,
    bH,
    proBarLeft,
    eduBarLeft,
    proLaneW,
    eduLaneW,
    entryH: entryH as Record<EntryId, number>,
    collapsedEntryH: collapsedEntryH as Record<EntryId, number>,
    proProj_left,
    eduProj_left,
    maxOffset: Math.max(0, chartH - STRIP_H),
  };
}

// ── Smart vertical centering ──────────────────────────────────────────────
// For entries that have no concurrent entries in other lanes: centre on their
// own strip. For entries whose strip overlaps with sibling lanes (e.g.
// Outlawed overlapping with CellStrat + IISc): centre in the largest
// sub-range of the strip that is free of concurrent cards.
function cardCenterY(
  e: Entry,
  lane: number,
  allEntries: Entry[],
  laneMap: Map<EntryId, number>,
  monthPx: number,
  pickLatest = false,
): number {
  const eS = toMonths(e.start);
  const eE = toMonths(e.end === "present" ? TODAY : (e.end as Date));
  const midY = (mA: number, mB: number) =>
    CHART_PAD_T + (TOTAL_MONTHS - (mA + mB) / 2) * monthPx;

  // Gather time-ranges of concurrent sibling-lane entries
  const blocked: Array<[number, number]> = [];
  for (const o of allEntries) {
    if (o.id === e.id || (laneMap.get(o.id) ?? 0) === lane) continue;
    const oS = toMonths(o.start);
    const oE = toMonths(o.end === "present" ? TODAY : (o.end as Date));
    if (oE > eS && oS < eE) blocked.push([Math.max(oS, eS), Math.min(oE, eE)]);
  }

  if (blocked.length === 0) return midY(eS, eE);

  // Merge and find gaps
  blocked.sort((a, b) => a[0] - b[0]);
  const gaps: Array<[number, number]> = [];
  if (blocked[0][0] > eS) gaps.push([eS, blocked[0][0]]);
  for (let i = 0; i < blocked.length - 1; i++) {
    if (blocked[i][1] < blocked[i + 1][0])
      gaps.push([blocked[i][1], blocked[i + 1][0]]);
  }
  if (blocked[blocked.length - 1][1] < eE)
    gaps.push([blocked[blocked.length - 1][1], eE]);

  // No free gap → fall back to full-strip centre
  if (gaps.length === 0) return midY(eS, eE);

  if (pickLatest) {
    // EDU on mobile: pick latest (most-recent) gap so long-span edu entries
    // anchor near the end of their period, away from the dense pro-era
    const latest = gaps.reduce((a, b) => (b[0] > a[0] ? b : a));
    return midY(latest[0], latest[1]);
  }

  // Centre in the largest free sub-range
  const best = gaps.reduce((a, b) => (b[1] - b[0] > a[1] - a[0] ? b : a));
  return midY(best[0], best[1]);
}

// ── Main ──────────────────────────────────────────────────────────────────
export function ExperienceTimeline() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      size: number;
    }>
  >([]);
  const scanYTargetRef = useRef<number>(0);
  const prevTargetRef = useRef<number>(0);
  const tailVelRef = useRef<number>(0);
  const dimsRef = useRef<any>(null);
  const particleRafRef = useRef<number>(0);

  const [vpW, setVpW] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440,
  );
  const [vpH, setVpH] = useState(() =>
    typeof window !== "undefined" ? window.innerHeight : 900,
  );
  const [chartOffset, setOffset] = useState(0);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState<EntryId | null>(null);

  useEffect(() => {
    const sync = () => {
      setVpW(window.innerWidth);
      setVpH(window.innerHeight);
    };
    window.addEventListener("resize", sync, { passive: true });
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.01 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const dims = useMemo(() => buildDims(vpW, vpH), [vpW, vpH]);
  const mDims = useMemo(() => buildMobileDims(vpW, vpH), [vpW, vpH]);

  useEffect(() => {
    dimsRef.current = isMobile ? mDims : dims;
  }, [dims, mDims, isMobile]);

  useEffect(() => {
    const scroller = document.querySelector(
      ".hologram-interface",
    ) as HTMLElement | null;
    const section = sectionRef.current;
    if (!scroller || !section) return;

    const maxOff = isMobile ? mDims.maxOffset : dims.maxOffset;

    let cachedTop: number | null = null;
    const measureTop = () => {
      let acc = 0;
      let el: HTMLElement | null = section;
      while (el && el !== scroller) {
        acc += el.offsetTop;
        el = el.offsetParent as HTMLElement | null;
      }
      cachedTop = acc;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (cachedTop === null) measureTop();
        const raw = scroller.scrollTop - (cachedTop ?? 0);
        setOffset(Math.max(0, Math.min(maxOff, raw)));
      });
    };

    requestAnimationFrame(() => {
      measureTop();
      onScroll();
    });
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(
      "resize",
      () => {
        cachedTop = null;
      },
      { passive: true },
    );
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, dims.maxOffset, mDims.maxOffset]);

  // Auto-close expanded card on scroll
  useEffect(() => {
    if (expanded === null) return;
    const scroller = document.querySelector(
      ".hologram-interface",
    ) as HTMLElement | null;
    if (!scroller) return;
    const close = () => setExpanded(null);
    scroller.addEventListener("scroll", close, { passive: true, once: true });
    return () => scroller.removeEventListener("scroll", close);
  }, [expanded]);

  // Resize canvas to match strip
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = vpW;
    canvas.height = (isMobile ? mDims : dims).STRIP_H;
  }, [vpW, dims, mDims, isMobile]);

  // Particle draw loop — inertia simulation + emission + render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let last = performance.now();
    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // Drive tail velocity from scroll delta, then let it coast with drag
      const target = scanYTargetRef.current;
      const targetDelta = target - prevTargetRef.current;
      prevTargetRef.current = target;
      if (Math.abs(targetDelta) > 0.1) {
        tailVelRef.current = targetDelta / Math.max(dt, 0.001);
      } else {
        // Exponential decay — ~50% remaining after 0.1s, gone by ~0.35s
        tailVelRef.current *= Math.pow(0.001, dt);
      }

      // Emit at actual head position — tail stays attached
      if (Math.abs(tailVelRef.current) > 5 && dimsRef.current) {
        const { SPINE_X } = dimsRef.current;
        const sign = tailVelRef.current > 0 ? -1 : 1;
        const speed = Math.min(Math.abs(tailVelRef.current) * 0.85, 200);
        const count = Math.max(
          1,
          Math.min(6, Math.round(Math.abs(tailVelRef.current) / 25)),
        );
        for (let i = 0; i < count; i++) {
          particlesRef.current.push({
            x: SPINE_X + (Math.random() - 0.5) * 6,
            y: target + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 30,
            vy: sign * speed * (0.4 + Math.random() * 0.6),
            life: 1,
            size: 0.8 + Math.random() * 1.5,
          });
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
      for (const p of particlesRef.current) {
        p.life -= dt / 0.5;
        if (p.life <= 0) continue;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        ctx.globalAlpha = p.life * 0.9;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.3, p.size * p.life), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      particleRafRef.current = requestAnimationFrame(draw);
    };
    particleRafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(particleRafRef.current);
  }, [isMobile]);

  // Update comet head target on scroll (emission handled by draw loop)
  useEffect(() => {
    const activeDims = isMobile ? mDims : dims;
    if (activeDims.maxOffset === 0) return;
    scanYTargetRef.current =
      (chartOffset / activeDims.maxOffset) * activeDims.STRIP_H;
  }, [chartOffset, dims, mDims, isMobile]);

  const {
    chartH,
    STRIP_H,
    SPINE_X,
    toPy,
    bH,
    proBarLeft,
    eduBarLeft,
    proLaneW,
    eduLaneW,
    entryH,
    collapsedEntryH,
    proProj_left,
    eduProj_left,
    monthPx,
    maxOffset,
  } = dims;

  const sectionH = vpH + maxOffset;

  // Header compresses over the first 100px of scroll — heading slides up to sit tight against the section line
  const compressRatio = maxOffset > 0 ? Math.min(1, chartOffset / 100) : 0;
  const headerGapPx = 80 * (1 - compressRatio) + 20 * compressRatio;

  const renderBar = (
    e: Entry,
    top: number,
    left: number,
    width: number,
    height: number,
    collapsedHeight: number,
    fontPx = FONT_PX,
    interactive = false,
  ) => {
    const clr = CLR[e.id];
    const roleFontSize = fontPx < FONT_PX ? "0.72rem" : "0.80rem";
    const isExp = !interactive || expanded === e.id;

    const header = interactive ? (
      // Mobile: role → company → period stacked
      <>
        <span
          style={{
            fontFamily: FONT_SANS,
            fontWeight: 600,
            fontSize: roleFontSize,
            color: "#fafaf8",
            lineHeight: 1.25,
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginBottom: 2,
          }}
        >
          {e.role}
        </span>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: "0.50rem",
            color: `${clr}bb`,
            letterSpacing: "0.04em",
            display: "block",
            lineHeight: 1.4,
          }}
        >
          {e.company}
        </span>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: "0.44rem",
            color: "rgba(255,255,255,0.26)",
            letterSpacing: "0.06em",
            display: "block",
            lineHeight: 1.6,
            whiteSpace: "nowrap",
          }}
        >
          {e.period}
        </span>
      </>
    ) : (
      // Desktop: role + period on the same line, company below
      <>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 6,
            marginBottom: 2,
          }}
        >
          <span
            style={{
              fontFamily: FONT_SANS,
              fontWeight: 600,
              fontSize: roleFontSize,
              color: "#fafaf8",
              lineHeight: 1.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {e.role}
          </span>
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: "0.44rem",
              color: "rgba(255,255,255,0.26)",
              letterSpacing: "0.06em",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {e.period}
          </span>
        </div>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: "0.50rem",
            color: `${clr}bb`,
            letterSpacing: "0.04em",
            display: "block",
            lineHeight: 1.4,
          }}
        >
          {e.company}
        </span>
      </>
    );

    const bulletsEl = (
      <div
        style={{
          padding: `0 ${PAD_X}px ${PAD_BOTTOM}px`,
          display: "flex",
          flexDirection: "column",
          gap: BULLET_GAP,
        }}
      >
        {e.bullets.map((b, i) => (
          <div
            key={i}
            style={{ display: "flex", gap: 5, alignItems: "flex-start" }}
          >
            <span
              style={{
                color: clr,
                fontSize: "0.42rem",
                flexShrink: 0,
                marginTop: "0.22rem",
                opacity: 0.7,
              }}
            >
              ▪
            </span>
            <span
              style={{
                fontFamily: FONT_SANS,
                fontSize: `${fontPx}px`,
                lineHeight: FONT_LH,
                color: "rgba(255,255,255,0.62)",
                textAlign: "justify",
                textJustify: "inter-word",
              }}
            >
              {b}
            </span>
          </div>
        ))}
      </div>
    );

    const headerEl = (
      <div style={{ padding: `${PAD_TOP}px ${PAD_X}px 0`, flexShrink: 0 }}>
        {header}
        <div
          style={{
            height: 1,
            background: `${clr}20`,
            marginTop: 5,
            marginBottom: 9,
          }}
        />
      </div>
    );

    return (
      <div
        key={e.id}
        onClick={
          interactive
            ? () => setExpanded((prev) => (prev === e.id ? null : e.id))
            : undefined
        }
        style={{
          position: "absolute",
          left,
          top,
          width,
          // Desktop: fixed height keeps all content. Mobile: auto height, inner wrapper drives size.
          ...(interactive ? {} : { height }),
          background: `linear-gradient(180deg, ${clr}0e 0%, ${clr}05 100%)`,
          borderLeft: `2px solid ${clr}`,
          borderTop: `1px solid ${clr}28`,
          borderBottom: `1px solid ${clr}28`,
          borderRight: `1px solid ${clr}28`,
          borderRadius: "3px",
          boxSizing: "border-box",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          cursor: interactive ? "pointer" : "default",
          userSelect: interactive ? "none" : undefined,
          // Push animation — cards below slide down when a sibling expands
          transition: interactive
            ? "top 0.45s cubic-bezier(0.76, 0, 0.24, 1)"
            : undefined,
        }}
      >
        {interactive ? (
          // Inner wrapper drives height — mask fades only the text, not the card border
          <div
            style={{
              overflow: "hidden",
              maxHeight: isExp ? height : collapsedHeight,
              transition: "max-height 0.45s cubic-bezier(0.76, 0, 0.24, 1)",
              ...(!isExp
                ? {
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 55%, transparent 100%)",
                    maskImage:
                      "linear-gradient(to bottom, black 55%, transparent 100%)",
                  }
                : {}),
            }}
          >
            {headerEl}
            {bulletsEl}
          </div>
        ) : (
          <>
            {headerEl}
            {bulletsEl}
          </>
        )}
      </div>
    );
  };

  // ── Mobile Gantt render ──────────────────────────────────────────────────
  if (isMobile) {
    const {
      chartH: mChartH,
      STRIP_H: mStripH,
      SPINE_X: mSpineX,
      toPy: mToPy,
      bH: mBH,
      barLeft: mBarLeft,
      laneW: mLaneW,
      entryH: mEntryH,
      collapsedEntryH: mCollapsedEntryH,
      projLeft: mProjLeft,
      monthPx: mMonthPx,
      maxOffset: mMaxOffset,
    } = mDims;

    const mSectionH = vpH + mMaxOffset;
    const mCompressRatio = mMaxOffset > 0 ? Math.min(1, chartOffset / 100) : 0;
    const mHeaderGapPx = 60 * (1 - mCompressRatio) + 10 * mCompressRatio;
    const mScanY = mMaxOffset > 0 ? (chartOffset / mMaxOffset) * mStripH : 0;

    return (
      <div
        ref={sectionRef}
        id="experience"
        style={{ position: "relative", height: mSectionH }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: vpH,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "0.7rem 4vw 0.6rem",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.5s",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: mHeaderGapPx,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.55rem",
                  letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                }}
              >
                Experience & Education
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,0.07)",
                }}
              />
            </div>
            <h2
              style={{
                fontFamily: FONT_SERIF,
                fontWeight: 800,
                fontSize: "clamp(1.85rem, 7.5vw, 2.4rem)",
                lineHeight: 1.1,
                letterSpacing: "0.02em",
                color: "#fafaf8",
                margin: 0,
              }}
            >
              The trajectory.
            </h2>
          </div>

          {/* Chart strip */}
          <div
            style={
              {
                position: "relative",
                width: "100%",
                flex: 1,
                overflow: "hidden",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.5s ease 0.1s",
              } as React.CSSProperties
            }
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: mChartH,
                transform: `translateY(-${chartOffset}px)`,
              }}
            >
              {/* Faint year grid */}
              {YEAR_MARKS.map((y) => (
                <div
                  key={y}
                  style={{
                    position: "absolute",
                    top: mToPy(new Date(y, 0, 1)),
                    left: 0,
                    right: 0,
                    height: 1,
                    background: "rgba(255,255,255,0.04)",
                  }}
                />
              ))}

              {/* Spine — segmented so year labels appear to cut through it */}
              {(() => {
                const GAP = 11;
                const markYs = YEAR_MARKS.map((y) =>
                  mToPy(new Date(y, 0, 1)),
                ).sort((a, b) => a - b);
                const segs: Array<{ top: number; height: number }> = [];
                let prev = 0;
                for (const my of markYs) {
                  const h = my - GAP - prev;
                  if (h > 0) segs.push({ top: prev, height: h });
                  prev = my + GAP;
                }
                const tail = mChartH - prev;
                if (tail > 0) segs.push({ top: prev, height: tail });
                return segs.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: mSpineX,
                      top: s.top,
                      height: s.height,
                      width: 1,
                      background: "rgba(255,255,255,0.15)",
                    }}
                  />
                ));
              })()}

              {/* Year ticks + labels (right-aligned, left of spine) */}
              {YEAR_MARKS.map((y) => {
                const yPos = mToPy(new Date(y, 0, 1));
                return (
                  <div key={y}>
                    <div
                      style={{
                        position: "absolute",
                        top: yPos,
                        left: mSpineX - 4,
                        width: 8,
                        height: 1,
                        background: "rgba(255,255,255,0.22)",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        top: yPos - 7,
                        left: 0,
                        width: mSpineX - 3,
                        textAlign: "right",
                        fontFamily: FONT_MONO,
                        fontSize: "0.44rem",
                        letterSpacing: "0.04em",
                        color: "rgba(255,255,255,0.45)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {y}
                    </span>
                  </div>
                );
              })}

              {/* All projection strips (combined — color-coded by entry) */}
              {ENTRIES.map((e) => {
                const endDate = e.end === "present" ? TODAY : (e.end as Date);
                const stripTop = mToPy(endDate);
                const stripHv = mBH(e.start, e.end);
                return (
                  <div
                    key={`mp-${e.id}`}
                    style={{
                      position: "absolute",
                      top: e.end === "present" ? stripTop - 20 : stripTop,
                      left: mProjLeft(e),
                      width: MOBILE_PROJ_W,
                      height: e.end === "present" ? stripHv + 20 : stripHv,
                      background: CLR[e.id],
                      borderRadius: 2,
                      opacity: 0.82,
                    }}
                  />
                );
              })}

              {/* Entry cards — asymmetric centering + push-down when a card expands */}
              {(() => {
                // Precompute base tops so push delta can be applied to cards below the open one
                const baseTops = new Map<EntryId, number>();
                for (const e of ENTRIES) {
                  let baseTop: number;
                  if (e.id === "bmsce") {
                    // Align BMSCE's top edge with the top of its projection strip (end date Y)
                    baseTop = mToPy(e.end as Date);
                  } else {
                    let cy: number;
                    if (e.track === "professional") {
                      const lane = PRO_LANE.get(e.id) ?? 0;
                      cy = cardCenterY(e, lane, PRO, PRO_LANE, mMonthPx);
                    } else {
                      const lane = ALL_LANE.get(e.id) ?? 0;
                      cy = cardCenterY(e, lane, ENTRIES, ALL_LANE, mMonthPx, true);
                    }
                    baseTop = cy - mCollapsedEntryH[e.id] / 2;
                  }
                  baseTops.set(e.id, baseTop);
                }

                const expandedTop =
                  expanded !== null
                    ? (baseTops.get(expanded) ?? -Infinity)
                    : -Infinity;
                const pushDelta =
                  expanded !== null
                    ? mEntryH[expanded] - mCollapsedEntryH[expanded]
                    : 0;

                return ENTRIES.map((e) => {
                  const base = baseTops.get(e.id)!;
                  const top =
                    expanded !== null && e.id !== expanded && base > expandedTop
                      ? base + pushDelta
                      : base;
                  return renderBar(
                    e,
                    top,
                    mBarLeft(e.id),
                    mLaneW,
                    mEntryH[e.id],
                    mCollapsedEntryH[e.id],
                    MOBILE_FONT_PX,
                    true,
                  );
                });
              })()}
            </div>

            {/* Particle canvas */}
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 2,
              }}
            />

            {/* Spine highlight + comet head */}
            <>
              <div
                style={{
                  position: "absolute",
                  left: mSpineX,
                  top: 0,
                  width: 1,
                  height: mScanY,
                  background: "#ffffff",
                  opacity: 0.9,
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: mSpineX - 4,
                  top: mScanY - 4,
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "#ffffff",
                  pointerEvents: "none",
                  zIndex: 3,
                }}
              />
            </>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      id="experience"
      style={{ position: "relative", height: sectionH }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: vpH,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "0.85rem 6vw 2rem",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: headerGapPx,
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
              Experience & Education
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "rgba(255,255,255,0.07)",
              }}
            />
          </div>
          <h2
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 800,
              fontSize: "clamp(2.6rem, 4.5vw, 4rem)",
              lineHeight: 1.1,
              letterSpacing: "0.02em",
              color: "#fafaf8",
              margin: 0,
            }}
          >
            The trajectory.
          </h2>
        </div>

        {/* Chart strip */}
        <div
          style={
            {
              position: "relative",
              width: "100%",
              flex: 1,
              overflow: "hidden",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.5s ease 0.1s",
            } as React.CSSProperties
          }
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: chartH,
              transform: `translateY(-${chartOffset}px)`,
            }}
          >
            {/* Faint year grid */}
            {YEAR_MARKS.map((y) => (
              <div
                key={y}
                style={{
                  position: "absolute",
                  top: toPy(new Date(y, 0, 1)),
                  left: 0,
                  right: 0,
                  height: 1,
                  background: "rgba(255,255,255,0.04)",
                }}
              />
            ))}

            {/* Spine — segmented so year labels appear to cut through it */}
            {(() => {
              const GAP = 11;
              const markYs = YEAR_MARKS.map((y) =>
                toPy(new Date(y, 0, 1)),
              ).sort((a, b) => a - b);
              const segs: Array<{ top: number; height: number }> = [];
              let prev = 0;
              for (const my of markYs) {
                const h = my - GAP - prev;
                if (h > 0) segs.push({ top: prev, height: h });
                prev = my + GAP;
              }
              const tail = chartH - prev;
              if (tail > 0) segs.push({ top: prev, height: tail });
              return segs.map((s, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: SPINE_X,
                    top: s.top,
                    height: s.height,
                    width: 1,
                    background: "rgba(255,255,255,0.15)",
                  }}
                />
              ));
            })()}

            {/* Year ticks + labels centred on spine */}
            {YEAR_MARKS.map((y) => {
              const yPos = toPy(new Date(y, 0, 1));
              return (
                <div key={y}>
                  <div
                    style={{
                      position: "absolute",
                      top: yPos,
                      left: SPINE_X - 5,
                      width: 11,
                      height: 1,
                      background: "rgba(255,255,255,0.22)",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: yPos - 9,
                      left: SPINE_X,
                      transform: "translateX(-50%)",
                      fontFamily: FONT_MONO,
                      fontSize: "0.58rem",
                      letterSpacing: "0.06em",
                      color: "rgba(255,255,255,0.50)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {y}
                  </span>
                </div>
              );
            })}

            {/* Pro projection strips — time-proportional duration indicator */}
            {PRO_PROJ.map((e) => {
              const endDate = e.end === "present" ? TODAY : (e.end as Date);
              const stripTop = toPy(endDate);
              const stripH = bH(e.start, e.end);
              return (
                <div
                  key={`pp-${e.id}`}
                  style={{
                    position: "absolute",
                    top: e.end === "present" ? stripTop - 20 : stripTop,
                    left: proProj_left(e),
                    width: PROJ_W,
                    height: e.end === "present" ? stripH + 20 : stripH,
                    background: CLR[e.id],
                    borderRadius: 2,
                    opacity: 0.82,
                  }}
                />
              );
            })}

            {/* Edu projection strips */}
            {EDU_PROJ.map((e) => {
              const stripTop = toPy(e.end as Date);
              const stripH = bH(e.start, e.end as Date);
              return (
                <div
                  key={`ep-${e.id}`}
                  style={{
                    position: "absolute",
                    top: stripTop,
                    left: eduProj_left(e),
                    width: PROJ_W,
                    height: stripH,
                    background: CLR[e.id],
                    borderRadius: 2,
                    opacity: 0.82,
                  }}
                />
              );
            })}

            {/* Professional cards — each centred in its strip's largest free sub-range */}
            {PRO.map((e) => {
              const lane = PRO_LANE.get(e.id) ?? 0;
              const cy = cardCenterY(e, lane, PRO, PRO_LANE, monthPx);
              return renderBar(
                e,
                cy - entryH[e.id] / 2,
                proBarLeft(e.id),
                proLaneW,
                entryH[e.id],
                entryH[e.id],
              );
            })}

            {/* Education cards */}
            {EDU.map((e) => {
              const lane = EDU_LANE.get(e.id) ?? 0;
              const cy = cardCenterY(e, lane, EDU, EDU_LANE, monthPx);
              return renderBar(
                e,
                cy - entryH[e.id] / 2,
                eduBarLeft(e.id),
                eduLaneW,
                entryH[e.id],
                entryH[e.id],
              );
            })}
          </div>

          {/* Particle canvas — fixed in strip viewport coords */}
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
          {(() => {
            const scanY =
              maxOffset > 0 ? (chartOffset / maxOffset) * STRIP_H : 0;
            return (
              <>
                {/* Painted spine highlight — grows down on scroll, shrinks on reverse */}
                <div
                  style={{
                    position: "absolute",
                    left: SPINE_X,
                    top: 0,
                    width: 1,
                    height: scanY,
                    background: "#ffffff",
                    opacity: 0.9,
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                />
                {/* Comet head */}
                <div
                  style={{
                    position: "absolute",
                    left: SPINE_X - 4,
                    top: scanY - 4,
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: "#ffffff",
                    pointerEvents: "none",
                    zIndex: 3,
                  }}
                />
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
