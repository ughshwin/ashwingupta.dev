import { Fragment } from "react";
import { motion } from "motion/react";
import { useIsMobile } from "../../hooks/useMediaQuery";
import bmsLogoUrl from "../../assets/BMSlogo.webp?url";
import coforgeLogoUrl from "../../assets/coforgeLogo.webp?url";
import augmentLogoUrl from "../../assets/augmentAILogo.webp?url";
import guinnessLogoUrl from "../../assets/GuinnessLogo.webp?url";
import hsbcLogoUrl from "../../assets/HSBCLogo.webp?url";
import kaggleLogoUrl from "../../assets/KaggleLogo.webp?url";

const FONT_SERIF = '"Playfair Display", Georgia, serif';
const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';

const pillars = [
  {
    title: "Inference as a System",
    desc: "Most teams ship inference as a function call. The real questions - p95 latency, 10× load, what happens when a backend goes down - are architecture questions. I answer them before the first model goes live.",
  },
  {
    title: "Execution Under Constraints",
    desc: "Systems that perform in demos often don't survive production. Real constraints - latency budgets, VRAM ceilings, cost per token - are known at design time, not discovered at launch. I build the constraint model first.",
  },
  {
    title: "Physics-Informed Scientific ML",
    desc: "Data-driven physics models aren't data problems - they're structure problems. Ignoring governing equations forces the model to rediscover physics from data it may never have enough of. Embedding PDEs into the objective is what makes sparse data sufficient.",
  },
];

const dontDo = [
  "I don't ship AI wrappers dressed as products. Core API calls with a nice UI aren't systems.",
  "I don't build for its own sake. The system has to earn what it costs to run.",
  "I don't take off-the-shelf work. If the implementation is a Google search away, I'm not the right person.",
];

const SPRING_ICON = "https://cdn.simpleicons.org/spring";

const highlights: { title: string; sub: string; icon: string }[] = [
  {
    title: "Guinness World Record",
    sub: "Command Centre · Most Participants - Agentic AI Hackathon · Google Cloud · July 2025",
    icon: guinnessLogoUrl,
  },
  {
    title: "$1.3M+ Annualised Savings",
    sub: "HSBC · Coforge",
    icon: hsbcLogoUrl,
  },
  {
    title: "Best Team Award",
    sub: "HSBC Account · Coforge",
    icon: hsbcLogoUrl,
  },
  {
    title: "Pat on Back - Think Customer Award",
    sub: "Individual Delivery Excellence · Coforge",
    icon: coforgeLogoUrl,
  },
  {
    title: "Java Spring AI Trainer",
    sub: "130+ Participants · 81% voted preferred trainer · NPS +50",
    icon: SPRING_ICON,
  },
  {
    title: "Best Outgoing Project",
    sub: "Mechanical Engineering · BMSCE 2023",
    icon: bmsLogoUrl,
  },
  {
    title: "Founded Augment.AI",
    sub: "BMSCE's AI Club",
    icon: augmentLogoUrl,
  },
  {
    title: "42.8K Downloads · 202K Views",
    sub: "Human Faces Kaggle Dataset",
    icon: kaggleLogoUrl,
  },
];

export function About() {
  const isMobile = useIsMobile();

  return (
    <section
      id="about"
      style={{
        position: "relative",
        background: "transparent",
        padding: isMobile ? "4rem 4vw" : "4rem 0 0",
      }}
    >
      <style>{`
        @keyframes highlights-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
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
        <div>
          <div style={{ padding: isMobile ? "2rem 0 0" : "1.5rem 6vw 2rem" }}>
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
              {/* LEFT - story paragraphs */}
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
                    maxWidth: "580px",
                    textAlign: "justify",
                    textJustify: "inter-word",
                  }}
                >
                  Mechanical engineering by training - which meant learning to
                  ask why a system fails before asking how to build it. AI hit
                  in second year like a realisation, not a subject: software
                  that understood language was a new class of thing, and I knew
                  it would matter before anyone around me thought it would. The
                  IISc ML lead role confirmed the direction -
                  physics-constrained optimisation on eVTOL design under Dr.
                  Harursampath, five projects in eight months, at the edge of
                  what was understood.
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
                    maxWidth: "580px",
                    textAlign: "justify",
                    textJustify: "inter-word",
                  }}
                >
                  Production changed the picture fast. At Gida and then Coforge,
                  the same pattern emerged: the GenAI core - prompts, basic RAG,
                  API calls - is learnable in three months. Everyone builds it.
                  The real gap is what surrounds the model: the routing logic,
                  the concurrency architecture, the observability that tells you
                  what actually broke and when. That's the part nobody wants to
                  own. That's where I went.
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
                    maxWidth: "580px",
                    textAlign: "justify",
                    textJustify: "inter-word",
                  }}
                >
                  At Coforge on the HSBC Conversational Analytics project, I was
                  the youngest on the team and three months in when I became the
                  de facto integration lead - having solved in one week a
                  problem another technology partner hadn't resolved in eight
                  months at the same client. GIL'd threading replaced with
                  CPU-pinned parallel instances, asyncio + uvloop across the
                  full pipeline, cross-stack observability built before the
                  second incident happened. 7× session capacity. $1.3M
                  annualised savings. MTTR from ~1hr to ~10mins.
                </motion.p>
              </div>

              {/* RIGHT - pillars + What I Don't Do */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
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
                        - {line}
                      </p>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Highlights */}
            <div style={{ marginTop: isMobile ? "4rem" : "6rem" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: "0.62rem",
                    letterSpacing: "0.2em",
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                  }}
                >
                  Highlights
                </span>
              </div>
              <div style={{ overflow: "hidden" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    width: "max-content",
                    animation: "highlights-marquee 45s linear infinite",
                    willChange: "transform",
                  }}
                >
                  {[...highlights, ...highlights].map((h, i) => (
                    <Fragment key={i}>
                      {/* card */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.3rem",
                          width: "max-content",
                          flexShrink: 0,
                          userSelect: "none",
                        }}
                      >
                        {/* row: icon + title */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.65rem",
                          }}
                        >
                          <img
                            src={h.icon}
                            alt=""
                            aria-hidden="true"
                            style={{
                              width: "28px",
                              height: "28px",
                              objectFit: "contain",
                              flexShrink: 0,
                              opacity: 0.9,
                            }}
                          />
                          <div
                            style={{
                              fontFamily: FONT_SERIF,
                              fontSize: "1rem",
                              fontWeight: 700,
                              lineHeight: 1.2,
                              color: "#f5ca40",
                              letterSpacing: "0.03em",
                              textShadow: "0 0 12px rgba(245,202,64,0.25)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {h.title}
                          </div>
                        </div>
                        {/* sub */}
                        <div
                          style={{
                            fontFamily: FONT_SANS,
                            fontSize: "0.7rem",
                            lineHeight: 1.45,
                            color: "rgba(255,255,255,0.38)",
                            letterSpacing: "0.02em",
                            paddingLeft: "42px",
                          }}
                        >
                          {h.sub}
                        </div>
                      </div>
                      {/* bullet separator */}
                      <span
                        style={{
                          fontSize: "1.6rem",
                          color: "rgba(245,202,64,0.3)",
                          margin: "0 2.2rem",
                          alignSelf: "flex-start",
                          flexShrink: 0,
                          lineHeight: 1,
                          userSelect: "none",
                        }}
                      >
                        •
                      </span>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
