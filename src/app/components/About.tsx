import { motion } from "motion/react";
import { useIsMobile } from "../../hooks/useMediaQuery";
import coforgeLogoImg from "../../assets/coforgeLogo.webp?url";
import gidaLogoImg from "../../assets/gidaLogo.webp?url";
import bmsceLogoImg from "../../assets/BMSlogo.webp?url";
import iiitbLogoImg from "../../assets/IIITlogo.webp?url";
import iiscLogoImg from "../../assets/iiscLogo.webp?url";
import outlawedLogoImg from "../../assets/outlawedLogo.webp?url";
import cellstratLogoImg from "../../assets/cellstratLogo.webp?url";

const FONT_SERIF = '"Playfair Display", Georgia, serif';
const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';

const experience = [
  {
    from: "Jun 2024",
    to: "Present",
    role: "AI Engineer",
    company: "Coforge",
    partTime: false,
    workTitles: ["Integration Engineer", "Infrastructure Engineer"],
    detail:
      "Owns the inference and concurrency architecture for HSBC voice AI — replaced GIL'd threading (memory ballooning) with CPU-pinned parallel processes and asyncio + uvloop, eliminating GIL contention across the full SIP/STT/LLM pipeline · 7× session capacity · $1.3M annualized savings · MTTR 1–2hr → ~5min via cross-stack log correlation",
    logo: coforgeLogoImg,
    logoH: 55,
    awards: [
      "Best Team Award — HSBC Account",
      "Pat on the Back — Think Customer Award (Individual Excellence)",
      {
        text: "Led Java Spring AI training for 130+ colleagues",
        bullets: [
          "62% were Senior Engineers, Tech Leads & Architects",
          "81% voted preferred trainer",
          "Net Promoter Score +50 · 4.4/5 avg satisfaction",
        ],
      },
    ],
  },
  {
    from: "Jan 2023",
    to: "May 2024",
    role: "Data Scientist",
    company: "Gida Technologies",
    partTime: false,
    workTitles: ["Chatbot Developer", "Recommendation Engineer", "Product Engineer"],
    detail: "163+ language RAG systems, sub-50ms recommenders",
    logo: gidaLogoImg,
    logoH: 55,
  },
  {
    from: "Jan 2022",
    to: "Sep 2022",
    role: "Head of Machine Learning",
    company: "IISc",
    partTime: true,
    detail:
      "Founded & led the ML team at NMCAD Lab, Aerospace Engg. — eVTOL design optimisation using ML/DL under Dr Dineshkumar Harursampath. 5 projects delivered in 8 months.",
    logo: iiscLogoImg,
    logoH: 36,
  },
  {
    from: "Feb 2021",
    to: "Dec 2021",
    role: "AI Product Developer",
    company: "CellStrat",
    partTime: true,
    detail:
      "Built production-ready AI products based on OpenAI research for cellstrathub.com — 11k+ global AI developers at time of deployment.",
    logo: cellstratLogoImg,
    logoH: 36,
  },
  {
    from: "Jan 2020",
    to: "Oct 2022",
    role: "Graphic Designer",
    company: "OutLawed",
    partTime: true,
    detail:
      "Designed social media content and teaching aids to empower underprivileged students through grassroots teaching programs.",
    logo: outlawedLogoImg,
    logoH: 55,
  },
];

const education = [
  {
    from: "Oct 2025",
    to: "Present",
    role: "Ex. Diploma in ML & AI",
    company: "IIIT Bangalore",
    detail: "Generative AI & Agentic AI · MLOps",
    logo: iiitbLogoImg,
    logoH: 55,
  },
  {
    from: "Aug 2019",
    to: "May 2023",
    role: "B.E. Mechanical",
    company: "BMS College of Engineering",
    awards: [
      "Best Outgoing Project - Mechanical Engineering '23",
      "Published @ NCISCT 2022",
    ],
    logo: bmsceLogoImg,
    logoH: 55,
  },
];

const pillars = [
  {
    title: "Inference as a System",
    desc: "Inference is not a function call — it is a workload with scheduling, routing, and resource constraints. I design the layer that decides how requests move through hardware, when to batch, and how to degrade gracefully when capacity is hit.",
  },
  {
    title: "Execution Under Constraints",
    desc: "Real systems run under latency budgets, VRAM ceilings, and cost targets. I design around those constraints before they become failures — not after. Observability is part of the system, not bolted on.",
  },
  {
    title: "Physics-Informed Scientific ML",
    desc: "Governing equations exist for many systems. I embed them directly into the learning objective — PDEs as training constraints, not post-hoc validators. PHYSCLIP and the PINNs work both come from this.",
  },
];

export function About() {
  const isMobile = useIsMobile();

  return (
    <section
      id="about"
      style={{
        padding: isMobile ? "4rem 4vw" : "10rem 6vw",
        background: "transparent",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: isMobile ? "3rem" : "5rem",
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
          01 — About
        </span>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: "rgba(255,255,255,0.07)",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "3rem" : "6vw",
          alignItems: "start",
        }}
      >
        {/* LEFT — sticky */}
        <div
          style={{
            position: isMobile ? "relative" : "sticky",
            top: isMobile ? "0" : "6rem",
            alignSelf: "start",
          }}
        >
          <div style={{ overflow: "hidden", marginBottom: "2.5rem" }}>
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
                letterSpacing: "-0.03em",
                color: "#fafaf8",
                margin: 0,
              }}
            >
              Systems that decide. Infrastructure that holds.
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              fontFamily: FONT_SANS,
              fontSize: "1rem",
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.7)",
              marginBottom: "1.5rem",
              maxWidth: "500px",
            }}
          >
            Most AI work focuses on what a model outputs. I focus on how the
            system behaves — how requests are routed, how decisions are made
            under constraint, and how the system holds when inputs are noisy,
            capacity is saturated, or governing assumptions break.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            style={{
              fontFamily: FONT_SANS,
              fontSize: "1rem",
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.58)",
              marginBottom: "1.5rem",
              maxWidth: "500px",
            }}
          >
            This spans three areas: inference and orchestration systems
            (scheduling, routing, execution), scientific ML (physics-informed
            models where governing equations constrain learning), and retrieval
            pipelines that have to be reliable — not just accurate on
            benchmarks.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            style={{
              fontFamily: FONT_SANS,
              fontSize: "1rem",
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.58)",
              marginBottom: "2.5rem",
              maxWidth: "500px",
            }}
          >
            Controla is inference infrastructure that gets smarter the longer it
            runs. ScholarOS is structured research execution. PHYSCLIP aligns
            symbolic physics with observed behavior. The PINNs work embeds PDEs
            into training. These are not tools — they are systems with decision
            logic.
          </motion.p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
          >
            {pillars.map(({ title, desc }, i) => (
              <div key={i}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1.2rem",
                    padding: "1.2rem 1.5rem",
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
                        marginBottom: "3px",
                      }}
                    >
                      {title}
                    </p>
                    <p
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: "0.83rem",
                        lineHeight: 1.6,
                        color: "rgba(255,255,255,0.58)",
                      }}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — timeline */}
        <div>
          <p
            style={{
              fontFamily: FONT_MONO,
              fontSize: "0.68rem",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
              marginBottom: "1.8rem",
            }}
          >
            Experience
          </p>
          <div>
            {experience.map(
              (
                {
                  from,
                  to,
                  role,
                  company,
                  partTime = false,
                  workTitles,
                  detail,
                  logo,
                  awards,
                },
                i,
              ) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "90px 1fr",
                    gap: isMobile ? "0.5rem" : "1.5rem",
                    padding: "1.3rem 0",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: isMobile ? "row" : "column",
                      alignItems: "center",
                      gap: isMobile ? "4px" : "2px",
                      paddingTop: "3px",
                      width: "fit-content",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: "0.85rem",
                        color: "rgba(255,255,255,0.7)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {from}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: "0.72rem",
                        color: "rgba(255,255,255,0.28)",
                      }}
                    >
                      {isMobile ? "→" : "to"}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: "0.85rem",
                        color:
                          to === "Present"
                            ? "#4ade80"
                            : "rgba(255,255,255,0.7)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {to}
                    </span>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "4px",
                      }}
                    >
                      {logo && (
                        <img
                          src={logo}
                          alt={company}
                          style={{
                            height: "48px",
                            width: "48px",
                            objectFit: "contain",
                            display: "block",
                            flexShrink: 0,
                            opacity: 0.9,
                          }}
                        />
                      )}
                      <p
                        style={{
                          fontFamily: FONT_SANS,
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          color: "#fafaf8",
                          margin: 0,
                        }}
                      >
                        {role}{" "}
                        <span
                          style={{
                            color: "rgba(255,255,255,0.48)",
                            fontWeight: 400,
                          }}
                        >
                          @ {company} •{" "}
                          {partTime ? "Part-time" : "Full-time"}
                        </span>
                        {workTitles && (
                          <span
                            style={{
                              display: "block",
                              fontWeight: 400,
                              fontSize: "0.78rem",
                              color: "rgba(255,255,255,0.65)",
                              marginTop: "2px",
                            }}
                          >
                            {workTitles.join(" · ")}
                          </span>
                        )}
                      </p>
                    </div>
                    {detail && (
                      <p
                        style={{
                          fontFamily: FONT_SANS,
                          fontSize: "0.82rem",
                          color: "rgba(255,255,255,0.48)",
                          lineHeight: 1.5,
                          paddingLeft: logo ? "62px" : "0",
                          marginTop: "0.55rem",
                          marginBottom: awards ? "0.6rem" : 0,
                        }}
                      >
                        {detail}
                      </p>
                    )}

                    {/* Awards */}
                    {awards && (
                      <div
                        style={{
                          paddingLeft: logo ? "62px" : "0",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        {awards.map((award, j) => {
                          const isObj = typeof award === "object";
                          const awardText = isObj ? award.text : award;
                          const isTrainingHighlight =
                            isObj || awardText.startsWith("Led Java Spring AI");
                          const isPublicationHighlight =
                            awardText.includes("Published @ NCISCT");
                          let awardIcon = "🏆";
                          if (isPublicationHighlight) {
                            awardIcon = "📄";
                          } else if (isTrainingHighlight) {
                            awardIcon = "🎓";
                          }

                          return (
                            <div key={j}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                <span style={{ fontSize: "0.75rem" }}>
                                  {awardIcon}
                                </span>
                                <span
                                  style={{
                                    fontFamily: FONT_SANS,
                                    fontSize: "0.78rem",
                                    color: "#c9a84c",
                                    lineHeight: 1.4,
                                  }}
                                >
                                  {awardText}
                                </span>
                              </div>
                              {isObj && award.bullets && (
                                <div
                                  style={{
                                    paddingLeft: "1.4rem",
                                    marginTop: "3px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "2px",
                                  }}
                                >
                                  {award.bullets.map((bullet, k) => (
                                    <div
                                      key={k}
                                      style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "5px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          color: "rgba(201,168,76,0.5)",
                                          fontSize: "0.65rem",
                                          marginTop: "2px",
                                          flexShrink: 0,
                                        }}
                                      >
                                        ↳
                                      </span>
                                      <span
                                        style={{
                                          fontFamily: FONT_SANS,
                                          fontSize: "0.73rem",
                                          color: "rgba(201,168,76,0.7)",
                                          lineHeight: 1.4,
                                        }}
                                      >
                                        {bullet}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>

          <p
            style={{
              fontFamily: FONT_MONO,
              fontSize: "0.68rem",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
              marginTop: "3.5rem",
              marginBottom: "1.8rem",
            }}
          >
            Education
          </p>
          <div>
            {education.map(
              ({ from, to, role, company, detail, logo, awards }, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "90px 1fr",
                    gap: isMobile ? "0.5rem" : "1.5rem",
                    padding: "1.3rem 0",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: isMobile ? "row" : "column",
                      alignItems: "center",
                      gap: isMobile ? "4px" : "2px",
                      paddingTop: "3px",
                      width: "fit-content",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: "0.85rem",
                        color: "rgba(255,255,255,0.7)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {from}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: "0.72rem",
                        color: "rgba(255,255,255,0.28)",
                      }}
                    >
                      {isMobile ? "→" : "to"}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: "0.85rem",
                        color:
                          to === "Present"
                            ? "#4ade80"
                            : "rgba(255,255,255,0.7)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {to}
                    </span>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "4px",
                      }}
                    >
                      {logo && (
                        <img
                          src={logo}
                          alt={company}
                          style={{
                            height: "48px",
                            width: "48px",
                            objectFit: "contain",
                            display: "block",
                            flexShrink: 0,
                            opacity: 0.9,
                          }}
                        />
                      )}
                      <p
                        style={{
                          fontFamily: FONT_SANS,
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          color: "#fafaf8",
                          margin: 0,
                        }}
                      >
                        {role}{" "}
                        <span
                          style={{
                            color: "rgba(255,255,255,0.48)",
                            fontWeight: 400,
                          }}
                        >
                          @ {company}
                        </span>
                      </p>
                    </div>
                    {detail && (
                      <p
                        style={{
                          fontFamily: FONT_SANS,
                          fontSize: "0.82rem",
                          color: "rgba(255,255,255,0.48)",
                          lineHeight: 1.5,
                          paddingLeft: logo ? "62px" : "0",
                          marginBottom: awards ? "0.6rem" : 0,
                        }}
                      >
                        {detail}
                      </p>
                    )}
                    {awards && (
                      <div
                        style={{
                          paddingLeft: logo ? "62px" : "0",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        {awards.map((award, j) => {
                          const awardIcon = award.includes("Published")
                            ? "📄"
                            : "🏆";
                          return (
                            <div
                              key={j}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <span style={{ fontSize: "0.75rem" }}>
                                {awardIcon}
                              </span>
                              <span
                                style={{
                                  fontFamily: FONT_SANS,
                                  fontSize: "0.78rem",
                                  color: "#c9a84c",
                                  lineHeight: 1.4,
                                }}
                              >
                                {award}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
