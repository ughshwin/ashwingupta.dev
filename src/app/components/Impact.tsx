import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { useIsMobile } from "../../hooks/useMediaQuery";
import {
  impacts,
  CATEGORY_META,
  CATEGORY_ORDER,
  ITEM_META,
  type Impact,
} from "./impactData";

const FONT_SERIF = '"Playfair Display", Georgia, serif';
const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';

// ── Heptagon constellation geometry (viewBox units) ──
const VBW = 1300;
const VBH = 640;
const CX = VBW / 2;
const CY = VBH / 2;
const RX = 460; // ellipse radii — wide + short so vertices keep outward room
const RY = 210;
const PAD = 22; // keep stars off the stage edges
const CLEAR = 92; // keep inward stars off the centre readout

type Node = { im: Impact; color: string; x: number; y: number; fx: number; fy: number };
type Edge = { x1: number; y1: number; x2: number; y2: number };
type Anchor = { x: number; y: number; color: string };
type Label = { label: string; color: string; x: number; y: number };

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

// Max radius from (x,y) along `ang` before hitting the padded box.
function maxR(x: number, y: number, ang: number) {
  const cx = Math.cos(ang);
  const cy = Math.sin(ang);
  const tx = cx > 0 ? (VBW - PAD - x) / cx : cx < 0 ? (PAD - x) / cx : Infinity;
  const ty = cy > 0 ? (VBH - PAD - y) / cy : cy < 0 ? (PAD - y) / cy : Infinity;
  return Math.max(0, Math.min(tx, ty));
}

// Distinct radii across [lo,hi], evenly spread + light jitter (varied trail lengths).
function evenR(count: number, lo: number, hi: number, rand: () => number) {
  const step = (hi - lo) / (count - 1 || 1);
  return Array.from({ length: count }, (_, k) => lo + step * k + (rand() - 0.5) * step * 0.45);
}

const slot = (j: number, count: number, base: number, arc: number) =>
  count <= 1 ? base : base + (j / (count - 1) - 0.5) * arc;

// Permutation that maps angular slots → radius ranks by the golden ratio, so a
// star's depth de-correlates from its angle (breaks the lined-up / spiral look
// in dense fans and spreads stars more evenly through the cell).
const goldenPerm = (m: number) =>
  Array.from({ length: m }, (_, i) => i).sort(
    (a, b) => ((a * 0.6180339887) % 1) - ((b * 0.6180339887) % 1),
  );

function buildLayout(groups: { cat: Impact["category"]; items: Impact[] }[]) {
  const V = groups.length;

  // geometric vertices on the ellipse + per-vertex space budget
  const geo = groups.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / V;
    const x = CX + RX * Math.cos(a);
    const y = CY + RY * Math.sin(a);
    const availOut = maxR(x, y, a);
    const toC = Math.hypot(CX - x, CY - y);
    const availIn = Math.max(40, toC - CLEAR);
    return {
      a,
      x,
      y,
      ux: Math.cos(a),
      uy: Math.sin(a),
      availOut,
      availIn,
      inA: Math.atan2(CY - y, CX - x),
      budget: availOut + availIn * 0.5,
    };
  });

  const edges: Edge[] = geo.map((v, i) => {
    const w = geo[(i + 1) % V];
    return { x1: v.x, y1: v.y, x2: w.x, y2: w.y };
  });

  // assign biggest category → roomiest vertex
  const order = groups
    .map((g, idx) => ({ idx, n: g.items.length }))
    .sort((a, b) => b.n - a.n);
  const verts = [...geo].sort((a, b) => b.budget - a.budget);

  const nodes: Node[] = [];
  const anchors: Anchor[] = [];
  const labels: Label[] = [];

  order.forEach((o, k) => {
    const g = groups[o.idx];
    const v = verts[k];
    const { color } = CATEGORY_META[g.cat];
    const items = g.items;
    const n = items.length;
    const rand = rng(o.idx * 131 + 17);

    // more stars seed inward where the room toward centre is deep (side vertices)
    const nIn = n >= 8 ? 4 : n >= 5 ? 3 : n >= 3 ? 2 : 1;
    const inner = items.slice(0, nIn);
    const outer = items.slice(nIn);
    const arcOut = Math.min(2.0, 0.7 + 0.2 * (outer.length - 1));
    const arcIn = Math.min(1.3, 0.55 + 0.2 * (inner.length - 1));
    const rIn = evenR(inner.length, 55, Math.min(v.availIn * 0.9, 320), rand);
    const rOut = evenR(outer.length, 55, v.availOut * 0.97, rand);

    const place = (im: Impact, ang: number, desired: number) => {
      // Per-render entropy on the baseline so the constellation looks slightly
      // different on every load: ±2° on angle, ±15% on length. Applied before
      // the clamps below, so the no-trespass / in-bounds guarantees still hold.
      ang += (Math.random() - 0.5) * (Math.PI / 9); // ±10°
      desired *= 1 + (Math.random() - 0.5) * 0.4; // ±20%
      const dx = Math.cos(ang);
      const dy = Math.sin(ang);
      // length cap #1: stay inside this vertex's Voronoi cell — i.e. never get
      // closer to another vertex than to our own. This is the boundary that
      // stops a star from trespassing into a neighbouring category's region.
      let vor = Infinity;
      for (const w of geo) {
        if (w === v) continue;
        const wx = w.x - v.x;
        const wy = w.y - v.y;
        const proj = wx * dx + wy * dy; // moving toward w?
        if (proj > 0) vor = Math.min(vor, (wx * wx + wy * wy) / (2 * proj));
      }
      // length cap #2: stay inside the padded stage.
      const d = Math.min(desired, maxR(v.x, v.y, ang) * 0.96, vor * 0.9);
      nodes.push({
        im,
        color,
        fx: v.x,
        fy: v.y,
        x: v.x + d * dx,
        y: v.y + d * dy,
      });
    };

    const pIn = goldenPerm(inner.length);
    const pOut = goldenPerm(outer.length);
    inner.forEach((im, j) => place(im, slot(j, inner.length, v.inA, arcIn), rIn[pIn[j]]));
    outer.forEach((im, j) => place(im, slot(j, outer.length, v.a, arcOut), rOut[pOut[j]]));

    anchors.push({ x: v.x, y: v.y, color });

    // label 90° off the fan axis (clear of all stars), on the roomier side
    const px = -v.uy;
    const py = v.ux;
    const rPlus = maxR(v.x, v.y, Math.atan2(py, px));
    const rMinus = maxR(v.x, v.y, Math.atan2(-py, -px));
    const side = rPlus >= rMinus ? 1 : -1;
    const off = 38;
    let lx = v.x + px * side * off + v.ux * 6;
    let ly = v.y + py * side * off + v.uy * 6;
    lx = Math.max(72, Math.min(VBW - 72, lx));
    ly = Math.max(16, Math.min(VBH - 16, ly));
    labels.push({ label: CATEGORY_META[g.cat].label, color, x: lx, y: ly });
  });

  return { edges, nodes, anchors, labels };
}

function ConstellationStar({
  node,
  index,
  onActive,
}: {
  node: Node;
  index: number;
  onActive: (im: Impact | null) => void;
}) {
  const { im, color } = node;
  const dot = 6 + im.magnitude * 2;
  const isLink = !!im.href;
  const Tag = isLink ? "a" : "div";

  return (
    <Tag
      {...(isLink
        ? {
            href: im.href,
            target: im.href!.startsWith("http") ? "_blank" : undefined,
            rel: im.href!.startsWith("http") ? "noopener noreferrer" : undefined,
          }
        : {})}
      className="impact-star"
      aria-label={`${im.value} — ${im.label} (${im.item})`}
      onMouseEnter={() => onActive(im)}
      onMouseLeave={() => onActive(null)}
      onFocus={() => onActive(im)}
      onBlur={() => onActive(null)}
      style={{
        position: "absolute",
        left: `${(node.x / VBW) * 100}%`,
        top: `${(node.y / VBH) * 100}%`,
        transform: "translate(-50%, -50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // hit area extended ~1.5× the dot radius (dot stays centered, visually unchanged)
        padding: `${Math.max(7, dot * 0.6)}px`,
        textDecoration: "none",
        cursor: isLink ? "pointer" : "default",
        animationDelay: `${(index % 6) * 0.6}s`,
        zIndex: 3,
      }}
    >
      <span
        style={{
          display: "block",
          width: `${dot}px`,
          height: `${dot}px`,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 ${4 + im.magnitude * 3}px ${color}`,
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: "-3px",
          fontFamily: FONT_MONO,
          fontSize: "0.6rem",
          letterSpacing: "0.01em",
          color: "rgba(255,255,255,0.78)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        {im.value}
      </span>
    </Tag>
  );
}

export function Impact() {
  const isMobile = useIsMobile();
  const [active, setActive] = useState<Impact | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Pause drift when the section is offscreen.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle("in-view", entry.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const grouped = useMemo(
    () =>
      CATEGORY_ORDER.map((cat) => ({
        cat,
        items: impacts.filter((i) => i.category === cat),
      })).filter((g) => g.items.length > 0),
    [],
  );

  const layout = useMemo(() => buildLayout(grouped), [grouped]);

  return (
    <section
      id="impact"
      style={{
        position: "relative",
        background: "transparent",
        padding: isMobile ? "5rem 4vw" : "4rem 0",
      }}
    >
      <style>{`
        @keyframes impactFloat {
          0%, 100% { transform: translate(-50%, calc(-50% - 3px)); }
          50%      { transform: translate(-50%, calc(-50% + 3px)); }
        }
        .impact-grid .impact-star { animation: impactFloat 5.5s ease-in-out infinite; animation-play-state: paused; }
        .impact-grid.in-view .impact-star { animation-play-state: running; }
        .impact-star:hover span:first-child,
        .impact-star:focus-visible span:first-child {
          transform: scale(1.5);
          transition: transform 0.2s ease;
        }
        .impact-star span:first-child { transition: transform 0.2s ease; }
        .impact-star:focus-visible { outline: none; }
        @media (prefers-reduced-motion: reduce) {
          .impact-grid .impact-star { animation: none !important; }
        }
      `}</style>

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
              Impact
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
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
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
              Proof, not promises.
            </motion.h2>
          </div>
        </div>

        {/* Content strip */}
        <div style={{ padding: isMobile ? "2rem 0 0" : "1.5rem 6vw 4rem" }}>
          {isMobile ? (
            // ── Accessible grouped tiles (mobile / fallback) ──
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {grouped.map(({ cat, items }) => {
                const { label, color } = CATEGORY_META[cat];
                return (
                  <div key={cat}>
                    <p
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: "0.55rem",
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color,
                        marginBottom: "0.9rem",
                      }}
                    >
                      {label}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      {items.map((im, i) => {
                        const isLink = !!im.href;
                        const Tag = isLink ? "a" : "div";
                        return (
                          <Tag
                            key={i}
                            {...(isLink
                              ? {
                                  href: im.href,
                                  target: im.href!.startsWith("http")
                                    ? "_blank"
                                    : undefined,
                                  rel: im.href!.startsWith("http")
                                    ? "noopener noreferrer"
                                    : undefined,
                                }
                              : {})}
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              gap: "0.75rem",
                              padding: "0.6rem 0",
                              borderBottom: "1px solid rgba(255,255,255,0.05)",
                              textDecoration: "none",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: FONT_SERIF,
                                fontWeight: 800,
                                fontSize: "1.05rem",
                                color,
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                                minWidth: "84px",
                              }}
                            >
                              {im.value}
                            </span>
                            <span
                              style={{
                                fontFamily: FONT_SANS,
                                fontSize: "0.8rem",
                                lineHeight: 1.45,
                                color: "rgba(255,255,255,0.6)",
                              }}
                            >
                              {im.label}
                              <span
                                style={{
                                  color: "rgba(255,255,255,0.3)",
                                  fontFamily: FONT_MONO,
                                  fontSize: "0.6rem",
                                }}
                              >
                                {"  ·  "}
                                {im.item}
                              </span>
                            </span>
                          </Tag>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // ── Heptagon constellation (desktop) ──
            <div
              ref={stageRef}
              className="impact-grid"
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: `${VBW} / ${VBH}`,
                background: "transparent",
              }}
            >
              {/* polygon edges + per-star trails */}
              <svg
                viewBox={`0 0 ${VBW} ${VBH}`}
                preserveAspectRatio="none"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
                aria-hidden="true"
              >
                {layout.edges.map((e, i) => (
                  <line
                    key={`e${i}`}
                    x1={e.x1}
                    y1={e.y1}
                    x2={e.x2}
                    y2={e.y2}
                    stroke="#ffffff"
                    strokeOpacity="0.07"
                    strokeWidth="1"
                  />
                ))}
                {layout.nodes.map((nd, i) => (
                  <line
                    key={`t${i}`}
                    x1={nd.fx}
                    y1={nd.fy}
                    x2={nd.x}
                    y2={nd.y}
                    stroke={nd.color}
                    strokeOpacity="0.2"
                    strokeWidth="1"
                  />
                ))}
              </svg>

              {/* vertex anchor dots */}
              {layout.anchors.map((an, i) => (
                <span
                  key={`a${i}`}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: `${(an.x / VBW) * 100}%`,
                    top: `${(an.y / VBH) * 100}%`,
                    transform: "translate(-50%, -50%)",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: an.color,
                    boxShadow: `0 0 7px ${an.color}`,
                    zIndex: 2,
                  }}
                />
              ))}

              {/* category labels */}
              {layout.labels.map((lb, i) => (
                <span
                  key={`l${i}`}
                  style={{
                    position: "absolute",
                    left: `${(lb.x / VBW) * 100}%`,
                    top: `${(lb.y / VBH) * 100}%`,
                    transform: "translate(-50%, -50%)",
                    fontFamily: FONT_MONO,
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    color: lb.color,
                    padding: "3px 7px",
                    borderRadius: "6px",
                    background: "rgba(8,8,10,0.8)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    zIndex: 4,
                  }}
                >
                  {lb.label}
                </span>
              ))}

              {/* stars */}
              {layout.nodes.map((nd, i) => (
                <ConstellationStar
                  key={`${nd.im.item}-${nd.im.value}-${i}`}
                  node={nd}
                  index={i}
                  onActive={setActive}
                />
              ))}

              {/* centre readout */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "min(28%, 360px)",
                  textAlign: "center",
                  pointerEvents: "none",
                  zIndex: 5,
                }}
              >
                {active ? (
                  <>
                    <div
                      style={{
                        fontFamily: FONT_SERIF,
                        fontWeight: 800,
                        fontSize: "2rem",
                        lineHeight: 1.05,
                        color: CATEGORY_META[active.category].color,
                      }}
                    >
                      {active.value}
                    </div>
                    <div
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: "0.82rem",
                        lineHeight: 1.4,
                        color: "rgba(255,255,255,0.72)",
                        marginTop: "6px",
                      }}
                    >
                      {active.label}
                      <span
                        style={{
                          color: CATEGORY_META[active.category].color,
                          fontWeight: 700,
                        }}
                      >
                        {"  •  "}
                        {active.item}
                      </span>
                    </div>
                    {ITEM_META[active.item] && (
                      <div
                        style={{
                          fontFamily: FONT_SANS,
                          fontSize: "0.7rem",
                          lineHeight: 1.45,
                          color: "rgba(255,255,255,0.4)",
                          marginTop: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: FONT_MONO,
                            fontSize: "0.6rem",
                            letterSpacing: "0.04em",
                            color: CATEGORY_META[active.category].color,
                          }}
                        >
                          {ITEM_META[active.item].client}
                        </span>
                        {"  —  "}
                        {ITEM_META[active.item].context}
                      </div>
                    )}
                  </>
                ) : (
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: "0.6rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.3)",
                      lineHeight: 1.6,
                    }}
                  >
                    Hover a point — every number is delivered, not projected.
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
