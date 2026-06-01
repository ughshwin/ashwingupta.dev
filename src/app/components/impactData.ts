// Machine-readable impact catalog driving the Impact constellation.
// Human source of truth: /IMPACT.md. Keep the two in sync.

export type ImpactCategory =
  | "scale"
  | "cost"
  | "reliability"
  | "accuracy"
  | "reach"
  | "systems"
  | "research";

export const CATEGORY_META: Record<
  ImpactCategory,
  { label: string; color: string }
> = {
  scale: { label: "Scale & Performance", color: "#22d3ee" },
  cost: { label: "Cost & Efficiency", color: "#10b981" },
  reliability: { label: "Reliability & Ops", color: "#a78bfa" },
  accuracy: { label: "Accuracy & Quality", color: "#eab308" },
  reach: { label: "Reach & Languages", color: "#60a5fa" },
  systems: { label: "Systems Breadth", color: "#2dd4bf" },
  research: { label: "Research & Publications", color: "#f5ca40" },
};

export const CATEGORY_ORDER: ImpactCategory[] = [
  "scale",
  "cost",
  "reliability",
  "accuracy",
  "reach",
  "systems",
  "research",
];

export type Impact = {
  value: string;
  label: string;
  item: string;
  category: ImpactCategory;
  magnitude: 1 | 2 | 3 | 4 | 5;
  href?: string;
};

// Per-project context (client + one-line description), keyed by `item`.
// Source: /IMPACT.md § "Per-item detail". Shown in the focus readout.
export const ITEM_META: Record<string, { client: string; context: string }> = {
  "HSBC Conversational Analytics": {
    client: "Coforge",
    context:
      "GIL-bound voice pipeline re-architected with CPU-pinned processes + asyncio/uvloop.",
  },
  "Skill Recommendation Engine": {
    client: "Prismforce",
    context:
      "Real-time skill recommender; eliminated batch retraining on taxonomy expansion.",
  },
  "ashwingupta.dev": {
    client: "Personal",
    context: "This site - design handoff hardened to production performance.",
  },
  "Azure Infra Docs Engine": {
    client: "Coforge",
    context: "Guardrail-enforced automated Azure infrastructure documentation.",
  },
  ScholarOS: {
    client: "Personal · In dev",
    context:
      "Deterministic structured research execution; only hypothesis critique is agentic.",
  },
  PageIndexOllama: {
    client: "Open source",
    context: "Local-first tree-RAG fork across Ollama, llama.cpp, vLLM.",
  },
  "Here.app": {
    client: "HDFC ERGO",
    context: "Multilingual vehicle-intelligence RAG with QA-gated retrieval.",
  },
  "Airline Contract Intelligence": {
    client: "Amex GBT",
    context:
      "Carrier-contract table extraction across image + programmatic PDFs.",
  },
  "Laminar (toolchain)": {
    client: "Gida",
    context:
      "AI delivery toolchain - multilingual content generation at scale.",
  },
  "Polymorph (toolchain)": {
    client: "Gida",
    context: "cURL→code API conversion across 20+ languages.",
  },
  controla: {
    client: "Personal",
    context:
      "Local-first self-improving inference OS; control plane over 19 backends.",
  },
  PINNs: {
    client: "BMSCE · CellStrat",
    context:
      "Dual-loss physics-informed NN framework across fluid, structural, thermal domains.",
  },
  "PINNs white paper": {
    client: "CellStrat",
    context:
      "Published white paper - PINNs for enterprise cyber-physical systems.",
  },
  "NCISCT 2022": {
    client: "IJISET",
    context:
      "Peer-reviewed automated assessment generation (BERT + WordNet/ConceptNet).",
  },
  "Open data": {
    client: "Kaggle",
    context: "Human Faces dataset - widely downloaded open dataset.",
  },
  Training: {
    client: "Coforge",
    context: "Java Spring AI trainer cohort; 81% voted preferred.",
  },
  "Research arc": {
    client: "IISc",
    context: "ML lead on physics-constrained eVTOL research.",
  },
};

export const impacts: Impact[] = [
  // ── Scale & Performance ──
  {
    value: "7×",
    label: "per-VM session capacity (20 → 140–160)",
    item: "HSBC Conversational Analytics",
    category: "scale",
    magnitude: 5,
    href: "/work/hsbc",
  },
  {
    value: "1,600+",
    label: "concurrent voice sessions at peak",
    item: "HSBC Conversational Analytics",
    category: "scale",
    magnitude: 5,
    href: "/work/hsbc",
  },
  {
    value: "2,000",
    label: "users validated via SIPp load test",
    item: "HSBC Conversational Analytics",
    category: "scale",
    magnitude: 3,
    href: "/work/hsbc",
  },
  {
    value: "<300ms",
    label: "end-to-end latency held at peak",
    item: "HSBC Conversational Analytics",
    category: "scale",
    magnitude: 4,
    href: "/work/hsbc",
  },
  {
    value: "<5%",
    label: "packet loss at 1,600+ sessions",
    item: "HSBC Conversational Analytics",
    category: "scale",
    magnitude: 2,
    href: "/work/hsbc",
  },
  {
    value: "<50ms",
    label: "recommendation inference (99th pct)",
    item: "Skill Recommendation Engine",
    category: "scale",
    magnitude: 4,
    href: "/work/skill-recommendation-engine",
  },
  {
    value: "1× T4",
    label: "full production load, single GPU",
    item: "Skill Recommendation Engine",
    category: "scale",
    magnitude: 3,
    href: "/work/skill-recommendation-engine",
  },
  {
    value: "18→4ms",
    label: "canvas frame time (18–25 → 4–6ms)",
    item: "ashwingupta.dev",
    category: "scale",
    magnitude: 3,
    href: "/work/ashwingupta-dev",
  },
  {
    value: "60 FPS",
    label: "stable under CPU throttle",
    item: "ashwingupta.dev",
    category: "scale",
    magnitude: 2,
    href: "/work/ashwingupta-dev",
  },

  // ── Cost & Efficiency ──
  {
    value: "~$1.3M",
    label: "annualized compute savings",
    item: "HSBC Conversational Analytics",
    category: "cost",
    magnitude: 5,
    href: "/work/hsbc",
  },
  {
    value: "$118K→$8K",
    label: "monthly compute cost",
    item: "HSBC Conversational Analytics",
    category: "cost",
    magnitude: 5,
    href: "/work/hsbc",
  },
  {
    value: "80→15",
    label: "production VMs (32 → 8 vCPU)",
    item: "HSBC Conversational Analytics",
    category: "cost",
    magnitude: 3,
    href: "/work/hsbc",
  },
  {
    value: "days→hrs",
    label: "infra docs: 2–3 days → 2–3 hours",
    item: "Azure Infra Docs Engine",
    category: "cost",
    magnitude: 4,
    href: "/work/azure-infra-docs",
  },
  {
    value: "90%",
    label: "image weight cut (2 MB → 211 KB)",
    item: "ashwingupta.dev",
    category: "cost",
    magnitude: 3,
    href: "/work/ashwingupta-dev",
  },
  {
    value: "72%",
    label: "JS bundle cut",
    item: "ashwingupta.dev",
    category: "cost",
    magnitude: 3,
    href: "/work/ashwingupta-dev",
  },
  {
    value: "400→0",
    label: "CSS-animated DOM nodes eliminated",
    item: "ashwingupta.dev",
    category: "cost",
    magnitude: 2,
    href: "/work/ashwingupta-dev",
  },

  // ── Reliability & Ops ──
  {
    value: "2hr→10m",
    label: "incident MTTR",
    item: "HSBC Conversational Analytics",
    category: "reliability",
    magnitude: 4,
    href: "/work/hsbc",
  },
  {
    value: "15→3m",
    label: "post-call documentation time",
    item: "HSBC Conversational Analytics",
    category: "reliability",
    magnitude: 3,
    href: "/work/hsbc",
  },
  {
    value: "250K+",
    label: "log lines correlated in 5–6 min",
    item: "HSBC Conversational Analytics",
    category: "reliability",
    magnitude: 3,
    href: "/work/hsbc",
  },
  {
    value: "0",
    label: "fabricated components (guardrail)",
    item: "Azure Infra Docs Engine",
    category: "reliability",
    magnitude: 3,
    href: "/work/azure-infra-docs",
  },
  {
    value: "100%",
    label: "determinism rate",
    item: "ScholarOS",
    category: "reliability",
    magnitude: 4,
    href: "/research/scholaros",
  },
  {
    value: "0 keys",
    label: "fully offline / air-gapped",
    item: "PageIndexOllama",
    category: "reliability",
    magnitude: 3,
    href: "/work/pageindexollama",
  },

  // ── Accuracy & Quality ──
  {
    value: "~97%",
    label: "factual accuracy, vehicle spec queries",
    item: "Here.app",
    category: "accuracy",
    magnitude: 5,
    href: "/work/here-app",
  },
  {
    value: "~96%",
    label: "table extraction across carrier PDFs",
    item: "Airline Contract Intelligence",
    category: "accuracy",
    magnitude: 4,
  },
  {
    value: "6/6",
    label: "physics benchmarks, stable convergence",
    item: "PINNs",
    category: "accuracy",
    magnitude: 3,
    href: "/research/pinns",
  },
  {
    value: "+30%",
    label: "recommendation relevance",
    item: "Skill Recommendation Engine",
    category: "accuracy",
    magnitude: 3,
    href: "/work/skill-recommendation-engine",
  },

  // ── Reach & Languages ──
  {
    value: "163",
    label: "languages, first-class RAG targets",
    item: "Here.app",
    category: "reach",
    magnitude: 5,
    href: "/work/here-app",
  },
  {
    value: "163+",
    label: "languages for content generation",
    item: "Laminar (toolchain)",
    category: "reach",
    magnitude: 3,
  },
  {
    value: "20+",
    label: "languages, cURL→code conversion",
    item: "Polymorph (toolchain)",
    category: "reach",
    magnitude: 2,
  },
  {
    value: "42.8K",
    label: "downloads, Human Faces Kaggle set (202K views)",
    item: "Open data",
    category: "reach",
    magnitude: 3,
    href: "/about",
  },
  {
    value: "NPS +50",
    label: "Java Spring AI trainer, 130+ trained",
    item: "Training",
    category: "reach",
    magnitude: 3,
    href: "/about",
  },

  // ── Systems Breadth ──
  {
    value: "19",
    label: "inference backends under one API",
    item: "controla",
    category: "systems",
    magnitude: 4,
    href: "/research/controla",
  },
  {
    value: "7",
    label: "modalities, single control plane",
    item: "controla",
    category: "systems",
    magnitude: 3,
    href: "/research/controla",
  },
  {
    value: "6",
    label: "scoring dimensions per routing decision",
    item: "controla",
    category: "systems",
    magnitude: 2,
    href: "/research/controla",
  },
  {
    value: "5 · 9",
    label: "capabilities · deterministic services",
    item: "ScholarOS",
    category: "systems",
    magnitude: 3,
    href: "/research/scholaros",
  },
  {
    value: "5,479",
    label: "chunks processed (Mar 2026 validation)",
    item: "ScholarOS",
    category: "systems",
    magnitude: 2,
    href: "/research/scholaros",
  },
  {
    value: "76",
    label: "contradictions detected in corpus",
    item: "ScholarOS",
    category: "systems",
    magnitude: 2,
    href: "/research/scholaros",
  },

  // ── Research & Publications ──
  {
    value: "IJISET",
    label: "peer-reviewed paper, Vol. 9 (NCISCT 2022)",
    item: "NCISCT 2022",
    category: "research",
    magnitude: 4,
    href: "https://ijiset.com/conference/NCISCT-2022/IJISET-NCISCT-220520.pdf",
  },
  {
    value: "CellStrat",
    label: "white paper published, Dec 2025",
    item: "PINNs white paper",
    category: "research",
    magnitude: 4,
    href: "/research/pinns",
  },
  {
    value: "6 / 2",
    label: "enterprise workflows / verticals (white paper)",
    item: "PINNs white paper",
    category: "research",
    magnitude: 2,
    href: "/research/pinns",
  },
  {
    value: "Best Project",
    label: "Best Outgoing Project, BMSCE 2022–23",
    item: "PINNs",
    category: "research",
    magnitude: 3,
    href: "/research/pinns",
  },
  {
    value: "5 / 8mo",
    label: "physics-constrained eVTOL projects, IISc",
    item: "Research arc",
    category: "research",
    magnitude: 2,
    href: "/about",
  },
];
