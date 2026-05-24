import { motion } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { useIsMobile } from "../../hooks/useMediaQuery";

const FONT_SERIF = '"Playfair Display", Georgia, serif';
const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';

const pillars = [
  {
    title: "Inference as a System",
    desc: "Most teams ship inference as a function call. The real questions — p95 latency, 10× load, what happens when a backend goes down — are architecture questions. I answer them before the first model goes live.",
  },
  {
    title: "Execution Under Constraints",
    desc: "Systems that perform in demos often don't survive production. Real constraints — latency budgets, VRAM ceilings, cost per token — are known at design time, not discovered at launch. I build the constraint model first.",
  },
  {
    title: "Physics-Informed Scientific ML",
    desc: "Data-driven physics models aren't data problems — they're structure problems. Ignoring governing equations forces the model to rediscover physics from data it may never have enough of. Embedding PDEs into the objective is what makes sparse data sufficient.",
  },
];

const dontDo = [
  "I don't ship AI wrappers dressed as products. Core API calls with a nice UI aren't systems.",
  "I don't build for its own sake. The system has to earn what it costs to run.",
  "I don't take off-the-shelf work. If the implementation is a Google search away, I'm not the right person.",
];

export function About() {
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

    requestAnimationFrame(() => {
      measureTop();
      onScroll();
    });
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

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        position: "relative",
        height: isMobile ? "auto" : sectionH,
        background: "transparent",
        ...(isMobile && { padding: "4rem 4vw" }),
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
              About
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
                lineHeight: 1.05,
                letterSpacing: "0.02em",
                color: "#fafaf8",
                margin: 0,
              }}
            >
              Inference is easy. Everything around it isn't.
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
            {/* Brand thesis */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                fontFamily: FONT_SANS,
                fontSize: isMobile ? "1rem" : "1.05rem",
                lineHeight: 1.65,
                color: "#e8e0d0",
                marginBottom: isMobile ? "2rem" : "2.5rem",
                borderLeft: "2px solid rgba(232,224,208,0.3)",
                paddingLeft: "1rem",
                maxWidth: "520px",
              }}
            >
              Honest where it matters. Available when it's hard.
            </motion.p>

            {/* Two-column grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: isMobile ? "3rem" : "6vw",
                alignItems: "start",
              }}
            >
              {/* LEFT — story paragraphs */}
              <div style={{ alignSelf: "start" }}>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: "0.95rem",
                    lineHeight: 1.8,
                    color: "rgba(255,255,255,0.62)",
                    marginBottom: "1.2rem",
                    maxWidth: "520px",
                    textAlign: "justify",
                    textJustify: "inter-word",
                  }}
                >
                  Mechanical engineering by training — which meant learning to ask why
                  a system fails before asking how to build it. AI hit in second year
                  like a realisation, not a subject: software that understood language
                  was a new class of thing, and I knew it would matter before anyone
                  around me thought it would. The IISc ML lead role confirmed the
                  direction — physics-constrained optimisation on eVTOL design under
                  Dr. Harursampath, five projects in eight months, at the edge of what
                  was understood.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: "0.95rem",
                    lineHeight: 1.8,
                    color: "rgba(255,255,255,0.62)",
                    marginBottom: "1.2rem",
                    maxWidth: "520px",
                    textAlign: "justify",
                    textJustify: "inter-word",
                  }}
                >
                  Production changed the picture fast. At Gida and then Coforge, the
                  same pattern emerged: the GenAI core — prompts, basic RAG, API calls
                  — is learnable in three months. Everyone builds it. The real gap is
                  what surrounds the model: the routing logic, the concurrency
                  architecture, the observability that tells you what actually broke
                  and when. That's the part nobody wants to own. That's where I went.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: "0.95rem",
                    lineHeight: 1.8,
                    color: "rgba(255,255,255,0.62)",
                    marginBottom: 0,
                    maxWidth: "520px",
                    textAlign: "justify",
                    textJustify: "inter-word",
                  }}
                >
                  At Coforge on the HSBC Conversational Analytics project, I was the
                  youngest on the team and three months in when I became the de facto
                  integration lead — having solved in one week a problem another
                  technology partner hadn't resolved in eight months at the same
                  client. GIL'd threading replaced with CPU-pinned parallel instances,
                  asyncio + uvloop across the full pipeline, cross-stack observability
                  built before the second incident happened. 7× session capacity.
                  $1.3M annualised savings. MTTR from ~1hr to ~10mins.
                </motion.p>
              </div>

              {/* RIGHT — pillars + What I Don't Do */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
              >
                {pillars.map(({ title, desc }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "1.2rem",
                        padding: "1.4rem 1.6rem",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.11)",
                        background: "rgba(255,255,255,0.025)",
                      }}
                    >
                      <div
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: "#e8e0d0",
                          marginTop: "7px",
                          flexShrink: 0,
                          opacity: 0.6,
                        }}
                      />
                      <div>
                        <p
                          style={{
                            fontFamily: FONT_SERIF,
                            fontWeight: 800,
                            fontSize: "0.95rem",
                            color: "#fafaf8",
                            marginBottom: "6px",
                          }}
                        >
                          {title}
                        </p>
                        <p
                          style={{
                            fontFamily: FONT_SANS,
                            fontSize: "0.83rem",
                            lineHeight: 1.65,
                            color: "rgba(255,255,255,0.58)",
                            textAlign: "justify",
                            textJustify: "inter-word",
                          }}
                        >
                          {desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.24, duration: 0.5 }}
                  style={{
                    padding: "1.2rem 1.5rem",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "6px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: "0.55rem",
                      letterSpacing: "0.18em",
                      color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                      marginBottom: "0.9rem",
                    }}
                  >
                    What I don't do
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.55rem",
                    }}
                  >
                    {dontDo.map((line, i) => (
                      <p
                        key={i}
                        style={{
                          fontFamily: FONT_SANS,
                          fontSize: "0.83rem",
                          lineHeight: 1.5,
                          color: "rgba(255,255,255,0.45)",
                          margin: 0,
                          textAlign: "justify",
                          textJustify: "inter-word",
                        }}
                      >
                        — {line}
                      </p>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
