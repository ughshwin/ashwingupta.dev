import { motion } from "motion/react";
import { useIsMobile } from "../../hooks/useMediaQuery";

const FONT_SERIF = '"Playfair Display", Georgia, serif';
const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';

const capabilities = [
  {
    title: "Concurrency Architecture & GIL Escape",
    desc: "Replaced GIL'd threading on a 32-core VM with 8 CPU-pinned parallel instances via taskset - one per core - and rewrote the threading layer as asyncio + uvloop coroutines. Memory ballooning eliminated. 20 concurrent SIP sessions → 140–160 per VM under sustained load. Latency profiled at 99th percentile, not average.",
    tags: [
      "asyncio · uvloop",
      "CPU-pinned processes",
      "GIL escape",
      "memory ballooning",
      "tail-latency profiling",
    ],
  },
  {
    title: "Inference Routing & Adaptive Scheduling",
    desc: "controla routes across 19 backends and 7 modalities using 6-dimension scoring (capability, performance, resource state, load, reliability, context). A versioned RoutingPolicy carries per-(backend, task_type, complexity) EWMA observations persisted to Redis across restarts. ε-greedy exploration is constrained to VRAM-safe, capability-matched backends. Policy candidates are replay-validated against historical traffic before promotion.",
    tags: [
      "EWMA weight learning",
      "VRAM-aware dispatch",
      "Redis priority queues",
      "ε-greedy exploration",
      "policy replay validation",
      "6D scoring",
    ],
  },
  {
    title: "RAG & Retrieval Infrastructure",
    desc: "HNSW/LEANN indexes with dense embeddings (facebook/contriever), Top-K (3–4) and context windows (1024–1536 tokens) tuned for recall vs. coherence. Tree-RAG provider abstraction with finish-reason normalization stabilizes recursive traversal across Ollama, llama.cpp, and vLLM - provider switching is transparent. QA-gated retrieval validates lookup quality before generation; reproducible index artifacts enable air-gapped operation.",
    tags: [
      "HNSW · LEANN indexing",
      "tree-RAG",
      "dense embeddings",
      "finish-reason normalization",
      "air-gapped retrieval",
      "QA-gated generation",
    ],
  },
  {
    title: "Production AI Infrastructure",
    desc: "Led a 4-engineer team. Owned Packer automation for all GCE image builds across the full SIP stack - SBC → STT → LLM inference. Sustained 1,600+ concurrent sessions at <2s E2E transcription latency and <5% packet loss. Monthly compute: $118K → $8K/month (~$1.3M annualized savings). HPA for capacity; libsrtp + DTLS/SRTP for in-transit security.",
    tags: [
      "GCP (Packer · GCE · HPA)",
      "SIP/PJSIP stack",
      "cost engineering",
      "SLA delivery",
      "libsrtp · DTLS/SRTP",
    ],
  },
  {
    title: "Observability & Incident Recovery",
    desc: "Architected cross-stack log correlation over GCP Logging APIs - 250K+ log lines reconstructed in under 5 seconds. MTTR: 1–2 hours → ~10 minutes. SIPp load test suite at 2,000 concurrent users. Prometheus/Grafana monitoring with MACD-triggered alerts. Trace correlation built into the stack, not bolted on after the incident.",
    tags: [
      "GCP Logging APIs",
      "cross-stack trace correlation",
      "SIPp load testing",
      "Prometheus · Grafana",
      "MTTR reduction",
    ],
  },
  {
    title: "Physics-Informed Neural Networks",
    desc: "Dual-loss PINN framework embedding PDE/ODE constraints directly into the optimization objective alongside data loss - physics acts as a regularizer preventing physically implausible solutions when data is sparse. Validated across 6 benchmarks: Burgers' equation, 1D heat conduction, fixed-fixed column deflection, cantilever tip deflection, 1D transient cooling under Neumann and Dirichlet boundary conditions. Applied to HVAC thermal feedback and server cooling use cases.",
    tags: [
      "dual-loss optimization",
      "PDE · ODE constraints",
      "Neumann · Dirichlet BCs",
      "partial observability",
      "physics regularization",
    ],
  },
  {
    title: "Graph Systems & Heuristic Scoring",
    desc: "Weighted directed graph encoding multi-level skill hierarchies as typed edges with dynamic weight updates. Dynamic node insertion without full graph recomputation. Deterministic traversal produces consistent outputs under concurrent updates - latency profiled on NVIDIA T4 before deployment. +30% recommendation relevance and sub-50ms inference under production load.",
    tags: [
      "weighted directed graph",
      "typed edge hierarchies",
      "dynamic node updates",
      "sub-50ms inference",
      "mathematical scoring heuristics",
    ],
  },
  {
    title: "Local LLM Deployment & Provider Abstraction",
    desc: "Fully offline RAG and inference across Ollama, llama.cpp, and vLLM - no external API keys at any pipeline stage. Provider-routing abstraction resolved via env vars with finish-reason normalization across runtime outputs. Sub-1GB quantized model support for CPU-only and low-VRAM hardware. VRAM accounting at runtime accounts for concurrent load, not just startup state.",
    tags: [
      "Ollama · llama.cpp · vLLM",
      "provider-routing abstraction",
      "quantized model deployment",
      "VRAM-aware loading",
      "zero API dependency",
    ],
  },
  {
    title: "Deterministic Pipeline Architecture (MCP)",
    desc: "ScholarOS executes research workflows as DAGs over 9 deterministic MCP services - no service imports another; all data flows through the orchestrator via typed tool invocations. Hypothesis critique is agentic and bounded to 5 iterations with required grounding to source claim identifiers. 100% determinism rate: identical inputs produce identical outputs. March 2026 validation: 5,479 chunks, 180 claims extracted, 76 contradictions detected.",
    tags: [
      "MCP orchestrator",
      "DAG execution",
      "bounded agent loops",
      "typed artifact provenance",
      "evidence-bound outputs",
      "100% determinism",
    ],
  },
  {
    title: "Document Intelligence & Live-State Extraction",
    desc: "Camelot + Ghostscript extract tables from both scan-quality and programmatic PDFs; GPT-4o one-shot normalization maps diverse carrier templates to schema-consistent output - ~96% extraction accuracy. Azure Resource Graph API subscription scans auto-generate SDDs and PlantUML diagrams; fabrication guardrails cross-check every generated component against extracted inventory, eliminating hallucinated topology from governance docs. Turnaround: 2–3 days → ~2–3 hours.",
    tags: [
      "Camelot · Ghostscript",
      "one-shot · few-shot prompting",
      "fabrication guardrails",
      "Azure Resource Graph API",
      "live-state grounding",
    ],
  },
];

const techStack = [
  "Python",
  "PyTorch",
  "asyncio · uvloop",
  "GCP (Packer · GCE · HPA)",
  "Azure Resource Graph",
  "Redis",
  "Ollama · llama.cpp · vLLM",
  "HNSW · FAISS",
  "Chroma",
  "Hugging Face",
  "PJSIP · SIPp",
  "Camelot · Ghostscript",
  "Prometheus · Grafana",
  "PyMuPDF",
  "SQLite",
  "MCP",
  "Docker",
];

export function Skills() {
  const isMobile = useIsMobile();

  return (
    <section
      id="stack"
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
        {/* LEFT - sticky heading + tech stack */}
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
              marginBottom: "2.5rem",
            }}
          >
            Profiled under load. Not just imported.
          </motion.p>

          <p
            style={{
              fontFamily: FONT_MONO,
              fontSize: "0.58rem",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.18)",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Tech Stack
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
          >
            {techStack.map((t) => (
              <motion.span
                key={t}
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.6rem",
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.42)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "3px",
                  padding: "4px 9px",
                  cursor: "default",
                  transition: "all 0.2s",
                  display: "inline-block",
                }}
              >
                {t}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* RIGHT - capability cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {capabilities.map((cap, gi) => (
            <div key={cap.title}>
              <div
                style={{
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.11)",
                  background: "rgba(255,255,255,0.025)",
                  padding: "1.8rem 2rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "1rem",
                    marginBottom: "0.7rem",
                    flexWrap: "wrap",
                  }}
                >
                  <p
                    style={{
                      fontFamily: FONT_SERIF,
                      fontWeight: 800,
                      fontSize: "1.05rem",
                      color: "#fafaf8",
                      margin: 0,
                    }}
                  >
                    {cap.title}
                  </p>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: "0.55rem",
                      letterSpacing: "0.1em",
                      color: "rgba(255,255,255,0.35)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {String(gi + 1).padStart(2, "0")}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: "0.85rem",
                    lineHeight: 1.65,
                    color: "rgba(255,255,255,0.6)",
                    marginBottom: "1rem",
                  }}
                >
                  {cap.desc}
                </p>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                  {cap.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: "0.56rem",
                        letterSpacing: "0.07em",
                        color: "rgba(255,255,255,0.42)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "2px",
                        padding: "3px 7px",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
