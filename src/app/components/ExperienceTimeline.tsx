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

// ── Layout constants (matching the CSS exactly) ────────────────────────────
const PAD_X = 10; // horizontal inner padding (each side)
const PAD_TOP = 8; // top inner padding
const PAD_BOTTOM = 12; // bottom inner padding (constant across all bars)
const BULLET_MARK = 14; // px width consumed by ▪ + gap
const ROLE_H = 20; // role line height
const COMPANY_H = 12; // company line height
const DIVIDER_H = 8; // divider line + vertical margins
const BAR_HDR_H = PAD_TOP + ROLE_H + COMPANY_H + DIVIDER_H; // 48px
const BULLET_GAP = 4; // gap between bullet rows
const FONT_PX = 11.2; // 0.70rem at 16px base
const FONT_LH = 1.48; // line-height

// Canvas-based text-wrap measurement — correct for each bar's actual width
const _measureCache = new Map<string, number>();

function measureBarH(e: Entry, barWidth: number): number {
  const key = `${e.id}-${Math.round(barWidth)}`;
  if (_measureCache.has(key)) return _measureCache.get(key)!;

  const textW = barWidth - PAD_X * 2 - BULLET_MARK;
  let bulletsH = 0;

  if (typeof window !== "undefined" && textW > 0) {
    try {
      const ctx = document.createElement("canvas").getContext("2d")!;
      ctx.font = `${FONT_PX}px "DM Sans", sans-serif`;
      const lineH = FONT_PX * FONT_LH;

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
      bulletsH = e.bullets.length * 22;
    }
  } else {
    bulletsH = e.bullets.length * 22;
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
    company: "Coforge — HSBC",
    period: "Jun 2024 – Mar 2026",
    start: new Date(2024, 5),
    end: new Date(2026, 2),
    bullets: [
      "HSBC Voice AI — SBC→STT→LLM on GCP/RHEL · authored LLD + orchestration architecture",
      "GIL fix: CPU-pinned procs + asyncio/uvloop · 20→140–160 sessions/VM · 1,600+ concurrent",
      "Packer GCE automation · GCP log correlator: 250K lines <5s · MTTR 1–2hr→~10min",
      "Compute: $118K→$8K/month (~$1.3M/yr) · Azure infra intelligence · Amex GBT RAG",
      "Best Team Award · Java Spring AI trainer · 130+ participants · NPS +50",
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

const PROJ_ROWS = [...ENTRIES].sort(
  (a, b) => a.start.getTime() - b.start.getTime(),
);

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

// Projection rows — same greedy lane logic as bars so non-overlapping entries
// share a row (e.g. CellStrat + IISc share row 1, Gida + Coforge share row 0).
const PRO_PROJ = [...PRO].sort((a, b) => a.start.getTime() - b.start.getTime());
const EDU_PROJ = [...EDU].sort((a, b) => a.start.getTime() - b.start.getTime());
const PRO_PROJ_LANE = assignLanes(PRO); // reuse bar lanes — same non-overlap logic
const EDU_PROJ_LANE = assignLanes(EDU);
const N_PRO_PROJ_ROWS = new Set(PRO_PROJ_LANE.values()).size; // 2
const N_EDU_PROJ_ROWS = new Set(EDU_PROJ_LANE.values()).size; // 1

// Chart geometry
const CHART_PAD_L = 72;
const CHART_PAD_R = 120;
const CHART_MULT = 2.1;
const HEADER_H = 220; // 0.85rem top + label-row + 5rem gap + ~5.5rem heading
const LANE_GAP = 14;
const PROJ_H = 5;
const PROJ_GAP = 4;
const INNER_GAP = 6; // gap between pro projection band and spine (pro side unchanged)
const AXIS_PAD = 22; // constant gap applied between every edu-side element:
//   spine → year labels → edu proj rows → edu bars

// Projection band heights
const PRO_PROJ_H =
  N_PRO_PROJ_ROWS * PROJ_H + Math.max(0, N_PRO_PROJ_ROWS - 1) * PROJ_GAP;
const EDU_PROJ_H =
  N_EDU_PROJ_ROWS * PROJ_H + Math.max(0, N_EDU_PROJ_ROWS - 1) * PROJ_GAP;
const YEAR_LABEL_H = 10; // approximate px height of rendered year label

// Pro side: bar bottoms at spine - PRO_SPINE_GAP
const PRO_SPINE_GAP = PRO_PROJ_H + INNER_GAP * 2;
// Edu side: spine → AXIS_PAD → year labels → AXIS_PAD → edu proj → AXIS_PAD → edu bars
const EDU_SPINE_GAP =
  AXIS_PAD + YEAR_LABEL_H + AXIS_PAD + EDU_PROJ_H + AXIS_PAD;

function buildDims(vpW: number, vpH: number) {
  const chartW = Math.max(vpW * CHART_MULT, 2600);
  const monthPx = (chartW - CHART_PAD_L - CHART_PAD_R) / TOTAL_MONTHS;
  const STRIP_H = vpH - HEADER_H;

  const toPx = (d: Date) => CHART_PAD_L + toMonths(d) * monthPx;
  const bW = (s: Date, e: Date | "present") =>
    Math.max(
      monthPx * 0.8,
      (toMonths(e === "present" ? TODAY : (e as Date)) - toMonths(s)) * monthPx,
    );

  // Measure actual bar heights via canvas text wrapping
  const entryH: Partial<Record<EntryId, number>> = {};
  for (const e of ENTRIES) entryH[e.id] = measureBarH(e, bW(e.start, e.end));

  // ── Pro bar tops — overlap-based, no slot-max gap ──────────────────────
  // Compute in relative coords where SPINE = 0 (negative = above spine).
  // Lane 0: bottom at -PRO_SPINE_GAP.
  // Lane 1+: each bar placed just above its temporally-overlapping lane-below
  //          neighbor, not above the tallest bar in that lane.
  const relTop: Partial<Record<EntryId, number>> = {};

  for (const e of PRO) {
    if ((PRO_LANE.get(e.id) ?? 0) === 0) {
      relTop[e.id] = -(PRO_SPINE_GAP + entryH[e.id]!);
    }
  }
  // Lane 1 (CellStrat, IISc) — find overlapping lane-0 neighbors
  for (const e of PRO) {
    const lane = PRO_LANE.get(e.id) ?? 0;
    if (lane === 0) continue;
    const eS = toMonths(e.start);
    const eE = toMonths(e.end === "present" ? TODAY : (e.end as Date));
    // topmost (most-negative Y) lane-(lane-1) bar that overlaps in time
    let ref = -PRO_SPINE_GAP;
    for (const o of PRO) {
      if ((PRO_LANE.get(o.id) ?? 0) !== lane - 1) continue;
      const oS = toMonths(o.start);
      const oE = toMonths(o.end === "present" ? TODAY : (o.end as Date));
      if (oE > eS && oS < eE) ref = Math.min(ref, relTop[o.id]!);
    }
    relTop[e.id] = ref - LANE_GAP - entryH[e.id]!;
  }

  // Total height above spine = distance from topmost bar's top to spine
  const totalProH = -Math.min(...(Object.values(relTop) as number[]));

  // Edu bars (single lane, top-down from spine)
  const eduLaneH: number[] = [];
  for (const e of EDU) {
    const k = EDU_LANE.get(e.id) ?? 0;
    eduLaneH[k] = Math.max(eduLaneH[k] ?? 0, entryH[e.id]!);
  }
  const totalEduH =
    EDU_SPINE_GAP +
    eduLaneH.reduce((a, h) => a + h, 0) +
    Math.max(0, eduLaneH.length - 1) * LANE_GAP;

  const vPad = Math.max(10, (STRIP_H - totalProH - totalEduH) * 0.7);
  const SPINE = vPad + totalProH;

  // Absolute bar positions
  const proBarTop = (id: EntryId) => SPINE + relTop[id]!;

  const eduLaneTop: number[] = [SPINE + EDU_SPINE_GAP];
  for (let k = 1; k < eduLaneH.length; k++) {
    eduLaneTop[k] = eduLaneTop[k - 1] + eduLaneH[k - 1] + LANE_GAP;
  }
  const eduBarTop = (id: EntryId) => eduLaneTop[EDU_LANE.get(id) ?? 0];

  // Projection positions — row comes from greedy lane assignment so
  // non-overlapping entries share the same row (same Y on the spine).
  // Pro: row 0 nearest spine, higher rows further above.
  // Edu: row 0 nearest spine, higher rows further below.
  const proProj_top = (e: Entry) => {
    const row = PRO_PROJ_LANE.get(e.id) ?? 0;
    return SPINE - INNER_GAP - (row + 1) * PROJ_H - row * PROJ_GAP;
  };
  const eduProj_top = (e: Entry) => {
    const row = EDU_PROJ_LANE.get(e.id) ?? 0;
    // After spine gap + year label zone, then rows stacked downward
    return (
      SPINE + AXIS_PAD + YEAR_LABEL_H + AXIS_PAD + row * (PROJ_H + PROJ_GAP)
    );
  };

  // Year labels: first element below spine, AXIS_PAD below the line
  const YEAR_LABEL_Y = SPINE + AXIS_PAD;

  // Track labels
  const proLabelY =
    SPINE +
    relTop[
      PRO.reduce((a, b) => ((relTop[a.id] ?? 0) < (relTop[b.id] ?? 0) ? a : b))
        .id
    ]! -
    18;
  const eduLabelY = eduLaneTop[0] + (eduLaneH[0] ?? 0) + 6;

  return {
    chartW,
    monthPx,
    STRIP_H,
    SPINE,
    entryH: entryH as Record<EntryId, number>,
    toPx,
    bW,
    proBarTop,
    eduBarTop,
    proProj_top,
    eduProj_top,
    YEAR_LABEL_Y,
    proLabelY,
    eduLabelY,
    maxOffset: Math.max(0, chartW - vpW),
  };
}

// ── Mobile ────────────────────────────────────────────────────────────────
function MobileView() {
  return (
    <div style={{ padding: "4rem 4vw" }}>
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
          03 — Experience & Education
        </span>
        <div
          style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }}
        />
      </div>
      {ENTRIES.map((e) => (
        <div key={e.id} style={{ marginBottom: "1.8rem" }}>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "flex-start",
              marginBottom: "0.5rem",
            }}
          >
            <div
              style={{
                width: 3,
                minHeight: 40,
                borderRadius: 2,
                background: CLR[e.id],
                flexShrink: 0,
                marginTop: 4,
              }}
            />
            <div>
              <p
                style={{
                  fontFamily: FONT_SANS,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "#fafaf8",
                  margin: 0,
                }}
              >
                {e.role}
              </p>
              <p
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.58rem",
                  color: `${CLR[e.id]}cc`,
                  margin: "2px 0 0",
                  letterSpacing: "0.04em",
                }}
              >
                {e.company}
              </p>
              <p
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.50rem",
                  color: "rgba(255,255,255,0.28)",
                  margin: "2px 0 0",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {e.period}
              </p>
            </div>
          </div>
          <div
            style={{
              marginLeft: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.3rem",
            }}
          >
            {e.bullets.map((b, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "0.4rem",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    color: CLR[e.id],
                    fontSize: "0.44rem",
                    flexShrink: 0,
                    marginTop: "0.28rem",
                    opacity: 0.75,
                  }}
                >
                  ▪
                </span>
                <span
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: "0.82rem",
                    lineHeight: 1.5,
                    color: "rgba(255,255,255,0.58)",
                  }}
                >
                  {b}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export function ExperienceTimeline() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  const [vpW, setVpW] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440,
  );
  const [vpH, setVpH] = useState(() =>
    typeof window !== "undefined" ? window.innerHeight : 900,
  );
  const [chartOffset, setOffset] = useState(0);
  const [visible, setVisible] = useState(false);

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

  // Memoised — only recalculates when viewport dimensions change
  const dims = useMemo(() => buildDims(vpW, vpH), [vpW, vpH]);

  useEffect(() => {
    if (isMobile) return;
    const scroller = document.querySelector(
      ".hologram-interface",
    ) as HTMLElement | null;
    const section = sectionRef.current;
    if (!scroller || !section) return;

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
        setOffset(Math.max(0, Math.min(dims.maxOffset, raw)));
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
  }, [isMobile, dims.maxOffset]);

  if (isMobile)
    return (
      <div ref={sectionRef} id="experience">
        <MobileView />
      </div>
    );

  const {
    chartW,
    STRIP_H,
    SPINE,
    entryH,
    toPx,
    bW,
    proBarTop,
    eduBarTop,
    proProj_top,
    eduProj_top,
    YEAR_LABEL_Y,
    proLabelY,
    eduLabelY,
    maxOffset,
  } = dims;
  const sectionH = vpH + maxOffset;

  const visStart =
    ORIGIN.getFullYear() +
    Math.floor(Math.floor(chartOffset / dims.monthPx) / 12);
  const visEnd =
    ORIGIN.getFullYear() +
    Math.floor(Math.floor((chartOffset + vpW) / dims.monthPx) / 12);

  // Render a bar — height is measured, padding is constant
  const renderBar = (
    e: Entry,
    top: number,
    left: number,
    width: number,
    ongoing: boolean,
  ) => {
    const clr = CLR[e.id];
    const h = entryH[e.id];
    return (
      <div
        key={e.id}
        style={{
          position: "absolute",
          left,
          top,
          width: ongoing ? width + 32 : width,
          height: h,
          background: `linear-gradient(180deg, ${clr}0e 0%, ${clr}05 100%)`,
          borderLeft: `2px solid ${clr}`,
          borderTop: `1px solid ${clr}28`,
          borderBottom: `1px solid ${clr}28`,
          borderRight: ongoing ? "none" : `1px solid ${clr}28`,
          borderRadius: ongoing ? "3px 0 0 3px" : "3px",
          boxSizing: "border-box",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header — constant padding */}
        <div style={{ padding: `${PAD_TOP}px ${PAD_X}px 0`, flexShrink: 0 }}>
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
                fontSize: "0.80rem",
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
            {width > 160 && (
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
            )}
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
          <div
            style={{
              height: 1,
              background: `${clr}20`,
              marginTop: 5,
              marginBottom: 3,
            }}
          />
        </div>

        {/* Bullets — constant padding, no overflow clipping */}
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
                  fontSize: `${FONT_PX}px`,
                  lineHeight: FONT_LH,
                  color: "rgba(255,255,255,0.62)",
                }}
              >
                {b}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={sectionRef}
      id="experience"
      style={{ position: "relative", height: sectionH }}
    >
      <div
        style={{ position: "sticky", top: 0, height: vpH, overflow: "hidden" }}
      >
        {/* Header — compact top (matches Research sticky header), 5rem gap label→heading */}
        <div
          style={{
            padding: "0.85rem 6vw 0",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s",
          }}
        >
          {/* Section label row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "5rem",
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
              03 — Experience & Education
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
          <h2
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 800,
              fontSize: "clamp(2.6rem, 4.5vw, 4rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              color: "#fafaf8",
              margin: 0,
            }}
          >
            The trajectory.
          </h2>
        </div>

        {/* Chart — left/right 15% fade masks */}
        <div
          style={
            {
              position: "relative",
              width: "100%",
              height: STRIP_H,
              overflow: "hidden",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.5s ease 0.1s",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 1%, rgba(0,0,0,0.05) 4%, rgba(0,0,0,0.22) 6.5%, rgba(0,0,0,0.54) 8.5%, rgba(0,0,0,0.86) 10%, black 11%, black 89%, rgba(0,0,0,0.86) 90%, rgba(0,0,0,0.54) 91.5%, rgba(0,0,0,0.22) 93.5%, rgba(0,0,0,0.05) 96%, transparent 99%)",
              maskImage:
                "linear-gradient(to right, transparent 1%, rgba(0,0,0,0.05) 4%, rgba(0,0,0,0.22) 6.5%, rgba(0,0,0,0.54) 8.5%, rgba(0,0,0,0.86) 10%, black 11%, black 89%, rgba(0,0,0,0.86) 90%, rgba(0,0,0,0.54) 91.5%, rgba(0,0,0,0.22) 93.5%, rgba(0,0,0,0.05) 96%, transparent 99%)",
            } as React.CSSProperties
          }
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: chartW,
              height: STRIP_H,
              transform: `translateX(-${chartOffset}px)`,
            }}
          >
            {/* Year grid */}
            {YEAR_MARKS.map((y) => (
              <div
                key={y}
                style={{
                  position: "absolute",
                  left: toPx(new Date(y, 0, 1)),
                  top: 0,
                  width: 1,
                  height: STRIP_H,
                  background: "rgba(255,255,255,0.04)",
                }}
              />
            ))}

            {/* Track labels */}
            <span
              style={{
                position: "absolute",
                left: 8,
                top: proLabelY,
                fontFamily: FONT_MONO,
                fontSize: "0.36rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.18)",
              }}
            >
              Professional
            </span>
            <span
              style={{
                position: "absolute",
                left: 8,
                top: eduLabelY,
                fontFamily: FONT_MONO,
                fontSize: "0.36rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.18)",
              }}
            >
              Education
            </span>

            {/* Spine */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: SPINE,
                height: 1,
                background: "rgba(255,255,255,0.15)",
              }}
            />

            {/* Today */}
            <div
              style={{
                position: "absolute",
                left: toPx(TODAY),
                top: 0,
                width: 1,
                height: STRIP_H,
                borderLeft: "1px dashed rgba(74,222,128,0.45)",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: toPx(TODAY) + 5,
                top: 6,
                fontFamily: FONT_MONO,
                fontSize: "0.42rem",
                letterSpacing: "0.1em",
                color: "#4ade80",
                textTransform: "uppercase",
              }}
            >
              Now
            </span>

            {/* Year ticks — span full height of projection bands */}
            {YEAR_MARKS.map((y) => {
              const x = toPx(new Date(y, 0, 1));
              return (
                <div key={y}>
                  {/* Tick: from 5px above spine down to year label */}
                  <div
                    style={{
                      position: "absolute",
                      left: x,
                      top: SPINE - 5,
                      width: 1,
                      height: AXIS_PAD + 5,
                      background: "rgba(255,255,255,0.22)",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: x - 20,
                      top: YEAR_LABEL_Y,
                      fontFamily: FONT_MONO,
                      fontSize: "0.58rem",
                      letterSpacing: "0.06em",
                      color: "rgba(255,255,255,0.50)",
                    }}
                  >
                    {y}
                  </span>
                </div>
              );
            })}

            {/* Professional bars */}
            {PRO.map((e) =>
              renderBar(
                e,
                proBarTop(e.id),
                toPx(e.start),
                bW(e.start, e.end),
                e.end === "present",
              ),
            )}

            {/* Pro projection rows — above spine (+Y), row = greedy lane */}
            {PRO_PROJ.map((e) => (
              <div
                key={`pp-${e.id}`}
                style={{
                  position: "absolute",
                  left: toPx(e.start),
                  top: proProj_top(e),
                  width: bW(e.start, e.end) + (e.end === "present" ? 32 : 0),
                  height: PROJ_H,
                  background: CLR[e.id],
                  borderRadius: 2,
                  opacity: 0.82,
                }}
              />
            ))}

            {/* Edu projection rows — below spine (-Y), row = greedy lane */}
            {EDU_PROJ.map((e) => (
              <div
                key={`ep-${e.id}`}
                style={{
                  position: "absolute",
                  left: toPx(e.start),
                  top: eduProj_top(e),
                  width: bW(e.start, e.end),
                  height: PROJ_H,
                  background: CLR[e.id],
                  borderRadius: 2,
                  opacity: 0.82,
                }}
              />
            ))}

            {/* Education bars */}
            {EDU.map((e) =>
              renderBar(
                e,
                eduBarTop(e.id),
                toPx(e.start),
                bW(e.start, e.end),
                false,
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
