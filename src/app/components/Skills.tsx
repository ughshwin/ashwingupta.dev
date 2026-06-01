import { motion } from "motion/react";
import { useIsMobile } from "../../hooks/useMediaQuery";

const FONT_SERIF = '"Playfair Display", Georgia, serif';
const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';

// Logos live in /public/logos and are referenced by path (never copied elsewhere).
type Unit = { f: string; chip?: boolean; filter?: boolean };
type Tech = {
  n: string;
  f?: string;
  parts?: Unit[];
  brk?: string;
  chip?: boolean;
  filter?: boolean;
};
type Category = { label: string; color: string; techs: Tech[] };

const C = {
  lang: "#a78bfa",
  backend: "#10b981",
  perf: "#f472b6",
  voice: "#f97316",
  data: "#60a5fa",
  ai: "#f5ca40",
  cloud: "#22d3ee",
};

const CATEGORIES: Category[] = [
  {
    label: "Languages",
    color: C.lang,
    techs: [
      { n: "Python", f: "python.svg", brk: "async · concurrency" },
      { n: "TypeScript", f: "typescript.svg" },
      {
        n: "C / C++",
        parts: [{ f: "c.svg" }, { f: "cplusplus.svg" }],
        brk: "C, C++",
      },
      {
        n: "SQL",
        parts: [{ f: "postgresql.svg" }, { f: "mysql.svg" }],
        brk: "PostgreSQL, MySQL",
      },
      { n: "Bash", f: "gnubash.svg" },
      {
        n: "Linux",
        parts: [
          { f: "redhat.svg" },
          { f: "archlinux.svg" },
          { f: "ubuntu.svg" },
        ],
        brk: "RHEL, Arch, Ubuntu",
      },
    ],
  },
  {
    label: "Backend & Systems",
    color: C.backend,
    techs: [
      { n: "Distributed systems", f: "tb-topology-star-3.svg" },
      { n: "Microservices", f: "tb-components.svg" },
      { n: "REST / OpenAPI", f: "swagger.svg" },
      {
        n: "Async / event-driven",
        parts: [{ f: "apachekafka.svg" }, { f: "gcp-pubsub.svg" }],
        brk: "Kafka, Pub/Sub",
      },
      { n: "Concurrency & perf", f: "tb-gauge.svg" },
      { n: "Caching", f: "redis.svg", brk: "Redis" },
      {
        n: "Observability",
        parts: [{ f: "grafana.svg" }, { f: "prometheus.svg" }],
        brk: "Grafana, Prometheus",
      },
      { n: "Fault tolerance", f: "tb-shield-check.svg" },
      { n: "Browser automation", f: "selenium.svg", brk: "Selenium" },
      { n: "Load testing", f: "locust.svg", brk: "Locust" },
    ],
  },
  {
    label: "Profiling & Perf",
    color: C.perf,
    techs: [
      { n: "Scalene", f: "scalene.png" },
      { n: "line_profiler", f: "line_profiler.png" },
      { n: "Memray", f: "memray.png" },
    ],
  },
  {
    label: "Real-Time & Voice",
    color: C.voice,
    techs: [
      { n: "PJSIP / PJSUA2", f: "pjsip.png" },
      { n: "Kamailio", f: "kamailio.svg" },
      { n: "Real-time systems", f: "tb-clock-bolt.svg" },
      { n: "SIPp", f: "sipp.png", brk: "SIP load testing" },
      {
        n: "Transport security",
        f: "openssl.svg",
        brk: "TLS · DTLS/SRTP · SDES",
      },
    ],
  },
  {
    label: "Data & Infra",
    color: C.data,
    techs: [
      {
        n: "DB design",
        parts: [{ f: "postgresql.svg" }, { f: "mongodb.svg" }],
        brk: "SQL / NoSQL",
      },
      {
        n: "ETL / streaming",
        parts: [{ f: "apachekafka.svg" }, { f: "apachespark.svg" }],
        brk: "Kafka, Spark",
      },
      { n: "FastAPI", f: "fastapi.svg" },
      { n: "NetworkX", f: "networkx.svg", brk: "graph analysis" },
      { n: "FAISS / ANN", f: "faiss.svg" },
      {
        n: "Vector search",
        parts: [{ f: "chroma.svg" }, { f: "hnsw.png" }],
        brk: "Chroma, HNSW",
      },
      {
        n: "Doc extraction",
        parts: [
          { f: "camelot.png" },
          { f: "ghostscript.svg" },
          { f: "opendataloader.webp" },
        ],
        brk: "Camelot, Ghostscript, OpenDataLoader",
      },
    ],
  },
  {
    label: "AI / ML Systems",
    color: C.ai,
    techs: [
      { n: "LLM deployment", f: "tb-brain.svg" },
      { n: "On-prem AI", f: "tb-server-cog.svg" },
      { n: "RAG", f: "tb-database-search.svg" },
      {
        n: "Agentic",
        parts: [{ f: "langchain.svg" }, { f: "langgraph.svg" }],
        brk: "LangChain, LangGraph",
      },
      {
        n: "Fine-tuning",
        parts: [{ f: "pytorch.svg" }, { f: "unsloth.png" }],
        brk: "LoRA/QLoRA, Unsloth",
      },
      { n: "Eval & monitoring", f: "weightsandbiases.svg", brk: "W&B" },
      { n: "Ollama", f: "ollama.svg" },
      { n: "Hugging Face", f: "huggingface.svg" },
    ],
  },
  {
    label: "Cloud & DevOps",
    color: C.cloud,
    techs: [
      {
        n: "GCP",
        parts: [
          { f: "gcp-compute-engine.svg" },
          { f: "gcp-gke.svg" },
          { f: "gcp-network.svg" },
        ],
        brk: "GCE, GKE, networking",
      },
      { n: "Azure", f: "azure.svg", brk: "Resource Graph" },
      { n: "AWS", f: "aws.svg", filter: true, brk: "working" },
      { n: "Docker", f: "docker.svg" },
      { n: "Kubernetes", f: "kubernetes.svg" },
      { n: "Autoscaling", f: "tb-arrows-maximize.svg" },
      { n: "Packer", f: "packer.svg" },
      { n: "Terraform", f: "terraform.svg" },
      { n: "CI/CD", f: "githubactions.svg" },
    ],
  },
];

function Icon({ u, size }: { u: Unit; size: number }) {
  if (u.chip) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          borderRadius: "6px",
          padding: "3px",
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        <img
          src={`/logos/${u.f}`}
          alt=""
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </span>
    );
  }
  return (
    <img
      src={`/logos/${u.f}`}
      alt=""
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "contain",
        display: "block",
        filter: u.filter ? "brightness(0) invert(1)" : undefined,
      }}
    />
  );
}

function Tile({ t, isMobile }: { t: Tech; isMobile: boolean }) {
  const units: Unit[] = t.parts ?? [
    { f: t.f!, chip: t.chip, filter: t.filter },
  ];
  const size = t.parts ? 30 : 38;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "9px",
        width: isMobile ? "80px" : "94px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "7px",
          alignItems: "center",
          justifyContent: "center",
          height: "40px",
        }}
      >
        {units.map((u, i) => (
          <Icon key={i} u={u} size={size} />
        ))}
      </div>
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: "0.72rem",
          color: "rgba(255,255,255,0.55)",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {t.n}
        {t.brk && (
          <span
            style={{
              display: "block",
              color: "rgba(255,255,255,0.3)",
              fontSize: "0.62rem",
              marginTop: "2px",
            }}
          >
            ({t.brk})
          </span>
        )}
      </div>
    </div>
  );
}

export function Skills() {
  const isMobile = useIsMobile();

  return (
    <section
      id="stack"
      style={{
        padding: isMobile ? "4rem 4vw" : "4rem 6vw 10rem",
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
          Stack
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
          gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr",
          gap: isMobile ? "5rem" : "8vw",
          alignItems: "start",
        }}
      >
        {/* LEFT - sticky heading */}
        <div
          style={{
            position: isMobile ? "relative" : "sticky",
            top: isMobile ? "0" : "6rem",
            marginBottom: isMobile ? "2rem" : "0",
          }}
        >
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
                margin: "0 0 1.2rem",
              }}
            >
              What I run in production.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily: FONT_SANS,
              fontSize: "0.88rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.48)",
              maxWidth: "260px",
            }}
          >
            Profiled under load. Not just imported.
          </motion.p>
        </div>

        {/* RIGHT - tech stack by category */}
        <div>
          {CATEGORIES.map((cat, ci) => (
            <div
              key={cat.label}
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? "1.3rem" : "24px",
                alignItems: "center",
                padding: ci === 0 ? "0 0 24px" : "24px 0",
                borderTop:
                  ci === 0 ? "none" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.62rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: cat.color,
                  width: isMobile ? "100%" : "118px",
                  flexShrink: 0,
                  lineHeight: 1.5,
                  textAlign: isMobile ? "center" : "left",
                }}
              >
                {cat.label}
              </div>
              <div
                style={
                  isMobile
                    ? {
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "22px 14px",
                        width: "100%",
                      }
                    : { display: "flex", flexWrap: "wrap", gap: "22px 24px" }
                }
              >
                {cat.techs.map((t) => (
                  <Tile key={t.n} t={t} isMobile={isMobile} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
