import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import {
  useIsMobile,
  useIsTablet,
  useIsDesktop,
} from "../../hooks/useMediaQuery";
import { useEqualRows } from "../../hooks/useCollageGrid";
import { EqualGridRenderer } from "./CollageRenderer";
import coforgeLogoImg from "../../assets/coforgeLogo.webp?url";
import gidaLogoImg from "../../assets/gidaLogo.webp?url";
import hdfcLogoImg from "../../assets/HDFClogo.webp?url";
import bmsceLogoImg from "../../assets/BMSlogo.webp?url";
import prismforceLogoImg from "../../assets/prismforceLogo.webp?url";

const FONT_SERIF = '"Playfair Display", Georgia, serif';
const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';

const COFORGE_LOGO = coforgeLogoImg;
const GIDA_LOGO = gidaLogoImg;
const HDFC_LOGO = hdfcLogoImg;
const BMSCE_LOGO = bmsceLogoImg;

export type Project = {
  index: string;
  slug: string;
  title: string;
  company: string;
  logo: string;
  logoHeight: number;
  status: string;
  devStatus?: string;
  tags: string[];
  impact: string;
  summary: [string, string, string, string];
  bullets: string[];
  github: string | null;
};

export function renderBullet(text: string): React.ReactNode {
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

export const projects: Project[] = [
  {
    index: "01",
    slug: "ashwingupta-dev",
    title: "ashwingupta.dev — Design Handoff to Production",
    company: "Personal",
    logo: "https://cdn.simpleicons.org/vercel/ffffff",
    logoHeight: 18,
    status: "Shipped",
    devStatus: "completed",
    tags: [
      "Spatial UI Architecture",
      "TypeScript / React",
      "Canvas 2D",
      "Astro · Vercel",
      "Performance Engineering",
      "Domain & DNS",
    ],
    impact:
      "Live at ashwingupta.dev · 90% image reduction · 72% JS bundle cut · 400 CSS DOM nodes eliminated",
    summary: [
      "The original portfolio claimed performance engineering while shipping **400 animated DOM nodes** and a **2 MB hero** — self-defeating on load.",
      "Rebuilt as a **three-layer spatial interface** — environment shell, Canvas particle field, hologram surface — collapsing visual effects into one system.",
      "**Offscreen pre-rendering**, visibility-gated RAF, lazy loading, and asset compression cut work at the source, making optimization structural not cosmetic.",
      "**90% image reduction** · **72% JS cut** · frame time **18–25ms → 4–6ms** · **60fps under throttle** · **400 animated DOM nodes removed**.",
    ],
    bullets: [
      "A portfolio site is its own proof unit. The designer baseline was self-defeating — the first thing a hiring manager measured was a **performance failure on the site claiming performance engineering**.",
      "Designer baseline: **400 CSS-animated DOM particles**, **2 MB JPEG** hero, Google Fonts loaded per-component, **72 unvetted dependencies**. The site needed to signal systems thinking — and was doing the opposite.",
      "Rebuilt end-to-end. **Three-layer spatial architecture** (environment, canvas particle field, hologram interface). All visual effects collapsed into a **single Canvas 2D RAF loop**. Images to WebP with fetchpriority preload. Below-fold sections split via **React.lazy + Suspense**.",
      "Scanline texture pre-rendered to offscreen canvas (**1 drawImage vs 270 fillRect/frame**). Edge cache rebuilt every 3 frames. RAF paused on visibility change. Mouse tracking gated behind RAF. **Stable 60 FPS under CPU throttle**.",
      "Image: **2 MB → 211 KB (90%)**. JS bundle: **72% cut**. DOM nodes: **400 CSS-animated eliminated**. Font requests: **3 → 0**. Canvas frame time: **18–25 ms → 4–6 ms**.",
    ],
    github: "https://github.com/ughshwin/ashwingupta.dev",
  },
  {
    index: "02",
    slug: "pageindexollama",
    title: "PageIndexOllama — Local-First Fork of PageIndex",
    company: "Open Source",
    logo: "https://cdn.simpleicons.org/github/ffffff",
    logoHeight: 18,
    status: "Shipped",
    devStatus: "completed",
    tags: [
      "Provider Abstraction",
      "Tree-Based RAG",
      "Ollama / Local LLMs",
      "Bounded Async Concurrency",
      "Hierarchical Fallback",
      "Python / Open Source",
    ],
    impact:
      "Fully offline tree-RAG execution · vendor lock-in eliminated · provider-agnostic runtime",
    summary: [
      "Tree-RAG was **hardwired to one provider contract** — completion differences silently corrupted recursive traversal, and failures surfaced only after collapse.",
      "Added a **provider-routing layer** with **finish-reason normalization**, so traversal depends on stable internal contracts rather than whichever runtime answered.",
      "Prompt externalization, bounded concurrency, and hierarchical fallback keep long-document runs stable on **local models** with uneven outputs and limited memory.",
      "**Fully offline tree-RAG** across Ollama, llama.cpp, and vLLM — provider switching became transparent, with no external API dependency in execution.",
    ],
    bullets: [
      "All inference required a **live OpenAI API key** — offline or air-gapped execution was blocked entirely; **provider switches corrupted traversal silently** with no error surface; token encoding differences across providers produced inconsistent chunk boundaries with no visible signal.",
      "PageIndex's tree RAG was hardcoded to **OpenAI's API contract** — inline prompt strings, non-normalized completion handling. **Local or offline deployment was impossible**. Any provider change broke traversal.",
      "Forked and refactored: **provider-routing abstraction** resolved via env vars. **Finish-reason normalization layer** stabilizes recursive traversal across model outputs. Prompts externalized into a registry loader. **Bounded async concurrency** across TOC generation and summarization. Hierarchical fallback for large-document robustness.",
      "Normalized completion contracts prevent finish-reason variations from corrupting **recursive traversal state**. Fallback chunk policies handle **constrained VRAM and RAM**. Structured-output hardening absorbs imperfect model responses without pipeline failure.",
      "**Fully offline tree-RAG** with Ollama — no API keys. Seamless provider switching via stable internal contracts. Regression risk reduced through e2e coverage across document types and model sizes.",
    ],
    github: "https://github.com/ughshwin/PageIndexOllama",
  },
  {
    index: "03",
    slug: "research-it",
    title: "Research-It — Fully Local RAG System",
    company: "Open Source",
    logo: "https://cdn.simpleicons.org/github/ffffff",
    logoHeight: 18,
    status: "Shipped",
    devStatus: "completed",
    tags: [
      "LEANN / HNSW Indexing",
      "Dense Embeddings",
      "Ollama / Local LLMs",
      "Multi-Source Ingestion",
      "PyMuPDF · BeautifulSoup",
      "Privacy-First",
    ],
    impact:
      "Fully offline academic document QA · reproducible HNSW indexes · zero API dependency",
    summary: [
      "Academic RAG assumed **cloud inference by default** — air-gapped institutions and low-VRAM machines had no private path from ingestion to QA.",
      "Built a **local-first retrieval stack**: LEANN/HNSW indexes, dense embeddings, Ollama inference, and normalized ingestion across PDFs, HTML, and paper folders.",
      "Chunk overlap, tuned **Top-K** and context windows, plus PyMuPDF and BeautifulSoup cleanup fix retrieval quality before errors reach query time.",
      "**API-free academic QA** on **sub-1GB quantized models** · reproducible HNSW artifacts for air-gapped use · ingestion and retrieval run without cloud credentials.",
    ],
    bullets: [
      "Sensitive academic papers had **no private processing path** — all RAG required external inference APIs; researchers on **CPU-only or low-VRAM hardware** had no viable local inference option; institutions with air-gap requirements were blocked by all existing tooling.",
      "Researchers with sensitive papers had no offline RAG that handled mixed sources — local PDFs, arXiv URLs, paper directories — without exposing data to external inference APIs or cloud indexing.",
      "Fully local RAG: **LEANN/HNSW vector indexing** with dense embeddings (facebook/contriever), Ollama-backed inference, multi-source ingestion (PDFs, academic HTML, directories). Smart chunking with overlap, **configurable Top-K (3–4)** and **context windows (1024–1536 tokens)**. Quantized model support for CPU-only hardware.",
      "Reproducible index artifacts enable **air-gapped operation**. Context-window and Top-K settings tuned for recall vs. coherence tradeoff. PyMuPDF + BeautifulSoup handle varied PDF quality before indexing — not at query time.",
      "**API-free document QA** across academic sources. Runs on **sub-1GB quantized models**. Designed for air-gapped institutional research.",
    ],
    github: "https://github.com/ughshwin/research-it",
  },
  {
    index: "04",
    slug: "hsbc-voice",
    title: "Real-Time AI Voice Infrastructure for Banking",
    company: "HSBC",
    logo: "https://cdn.simpleicons.org/hsbc/DB0011",
    logoHeight: 22,
    status: "Client Delivery",
    tags: [
      "SIP/Voice Orchestration (PJSIP · RFC 3261)",
      "CPU-Pinned Processes · asyncio + uvloop",
      "GCP Infrastructure (Packer · GCE · HPA)",
      "Cross-Stack Observability",
      "LLM Inference Pipeline",
      "Cost Engineering",
    ],
    impact:
      "1,600+ concurrent sessions · 7× VM capacity · ~$1.3M annualized savings · MTTR ~1–2 hrs → ~5 min",
    summary: [
      "Voice infrastructure ran on **GIL'd threading causing memory ballooning** — capped at **20 calls per VM**; documentation took **10–15 minutes**; incident recovery demanded **1–2 hours**.",
      "Replaced with **CPU-pinned parallel processes** to escape GIL and **asyncio + uvloop** to replace the threading layer — each SIP session a coroutine across SBC, STT, and LLM stages.",
      "Built **cross-stack log correlation**, SIPp load testing, and secure media transport — capacity, observability, and cost treated as one system.",
      "**7× per-VM capacity** · **1,600+ sessions** sustained · **$118K → $8K/month** · MTTR **1–2 hr → ~5 min** · docs **10–15 min → 2–3 min**.",
    ],
    bullets: [
      "**GIL'd threading caused memory ballooning** — concurrent sessions saturated at 20 per VM before packet loss rose above 10%; available hardware capacity was highly under-utilised; post-call documentation required **10–15 minutes of manual effort** per interaction with no automated path; fragmented cross-service logs with no correlation layer meant incidents required **1–2 hours of manual reconstruction** to identify root cause.",
      "HSBC voice AI ran on GIL'd threading with **memory ballooning**, capped at **20 concurrent calls per VM**. Post-call documentation: **10–15 min per interaction**. Inference cost: **~$118K/month**. Incident recovery: **1–2 hours** — fragmented logs, no unified observability layer.",
      "Led a **4-engineer team**. Owned **Packer automation across all project modules** — standardizing GCE image builds for the full SIP stack **(SBC → STT → LLM inference)**. Replaced GIL'd threading (memory ballooning) with **CPU-pinned parallel processes** to escape GIL, and rewrote the concurrency layer with **asyncio + uvloop** to replace threading — eliminating GIL contention across the full pipeline. Built **SIPp load test suite** (2,000 concurrent users). Architected **cross-stack log-correlation** over GCP Logging APIs — **250K+ log lines in under 5 seconds**.",
      "**<2s E2E transcription latency**, <5% packet loss at 1,600+ concurrent sessions. libsrtp + DTLS/SRTP for in-transit security. Grafana-Prometheus with MACD triggers. Migrated **n2-standard-32 → c4-standard-8**, improving transcript length **30–40% under load**.",
      "**7× per-VM capacity (20 → 140–160 calls)**. **1,600+ sessions** sustained. Documentation: **10–15 min → 2–3 min**. Compute: **$118K → $8K/month (~$1.3M annualized savings)**. MTTR: **1–2 hours → ~5 minutes**.",
    ],
    github: null,
  },
  {
    index: "05",
    slug: "azure-infra-docs",
    title: "AI-Powered Azure Infrastructure Documentation Engine",
    company: "Coforge",
    logo: COFORGE_LOGO,
    logoHeight: 18,
    status: "Client Delivery",
    tags: [
      "Azure Resource Graph API",
      "Live State Extraction",
      "Network & Security Config Mapping",
      "PlantUML Diagram Generation",
      "Few-Shot LLM Prompting",
      "Fabrication Guardrails",
    ],
    impact:
      "~2–3 days → ~2–3 hours documentation turnaround · 104 resource groups/project · zero fabricated components",
    summary: [
      "Azure documentation relied on **manual exports and hand-drawn diagrams** — every project took **2–3 days** and drifted from live state.",
      "Built a **live-state extraction pipeline** — subscription scan, topology mapping, and security analysis generate documents from current resource evidence.",
      "**Few-shot prompting** grounds generation in extracted inventory; guardrails reject any component without a matching live resource in the estate.",
      "**2–3 days → ~2–3 hours** · **104 resource groups** per engagement · **zero fabricated components** · manual PlantUML authoring removed from delivery.",
    ],
    bullets: [
      "Infrastructure documentation required **manual extraction from Azure** — 2–3 days per project; **PlantUML diagrams were authored by hand** from memory or stale exports; documented architecture drifted from live infrastructure state with **no mechanism to detect or correct divergence**.",
      "Enterprise infrastructure documentation required manual Azure subscription extraction — **2–3 days per project**. Produced stale views, delayed governance reviews, and documented state that drifted from live infrastructure.",
      "Built a Streamlit engine accepting a **subscription ID**, auto-generating SDDs and **PlantUML diagrams** via automated inventory extraction, network flow mapping, security config analysis, and dependency graph construction. **Few-shot LLM prompting** grounds architecture rationale in live state. **Validation guardrails** cross-check every generated component against extracted inventory.",
      "Guardrail layer enforces that every generated component maps to a **verified live resource** — hallucinated topology can't reach governance docs. Outputs regenerated from live subscription state — no cached snapshots, no documentation drift.",
      "Documentation: **2–3 days → ~2–3 hours**. Average **104 resource groups per project**. Eliminated manual PlantUML authoring. Live-state grounding replaced manual transcription.",
    ],
    github: null,
  },
  {
    index: "06",
    slug: "airline-contract-intelligence",
    title: "AI Contract Intelligence System for Airline Agreements",
    company: "Amex GBT",
    logo: "https://cdn.simpleicons.org/americanexpress/2E77BC",
    logoHeight: 18,
    status: "Client Delivery",
    tags: [
      "PDF Table Extraction (Camelot · Ghostscript)",
      "GPT-4o Normalization",
      "One-Shot Prompting",
      "Mixed-Format Document Handling",
      "Contract Intelligence Pipeline",
    ],
    impact:
      "~96% extraction accuracy · automated normalization across varied airline PDF schemas",
    summary: [
      "Airline agreements mixed **scan-quality and readable PDF tables**, and carrier template drift made manual review the only reliable extraction path.",
      "**Camelot + Ghostscript** extracted tables from both formats; **GPT-4o one-shot normalization** mapped varied carrier layouts into one contract view.",
      "The pipeline preserves context without per-carrier tuning — low-quality scans, nested tables, and layout drift are handled inside one extraction flow.",
      "**~96% extraction accuracy** across mixed airline PDFs · automated normalization replaced manual review · commercial term queries gained a real-time support path.",
    ],
    bullets: [
      "Airline contract tables were **reviewed manually** — slow, error-prone, and couldn't scale to the volume of carrier agreements; **template drift across carriers** meant each format required separate handling logic; sales and support queries on contract terms had **no real-time resolution path**.",
      "Airline contract PDFs for AMEX GBT mixed **image-embedded and readable tables**, with varied schemas and template drift across carriers. Manual review was slow, error-prone, and couldn't scale.",
      "Document intelligence pipeline: **Camelot + Ghostscript** extract tables from both image-embedded and readable PDF sources. **GPT-4o with one-shot prompting** normalizes across diverse contract formats — clause normalization, table structuring, schema-consistent output.",
      "One-shot prompting maintains contextual coherence across carrier templates **without per-carrier fine-tuning**. Camelot + Ghostscript in combination covers the full format range — from scan-quality images to nested programmatic tables.",
      "**~96% extraction accuracy** across airline contract Q&A. Automated normalization replaced manual review. Real-time query resolution for sales and customer support.",
    ],
    github: null,
  },
  {
    index: "07",
    slug: "here-app",
    title: "Here.app – Multilingual Vehicle Intelligence Platform",
    company: "HDFC ERGO",
    logo: HDFC_LOGO,
    logoHeight: 22,
    status: "Client Delivery",
    tags: [
      "RAG",
      "163 Languages",
      "QA-Gated Retrieval",
      "Structured Spec Database",
      "Dynamic Data Retrieval",
      "Vehicle Intelligence",
    ],
    impact:
      "~97% factual accuracy · 163 languages · reduced manual escalation on specification queries",
    summary: [
      "Vehicle assistants answered **specification queries inconsistently across languages** — the same request could contradict itself, making manual escalation the safe fallback.",
      "Built a **RAG system** over a structured vehicle database with image-linked attributes — every answer grounded in one canonical source.",
      "**QA-gated retrieval** validates lookup quality before generation, while **163-language delivery** stays anchored to one data model instead of post-hoc translation.",
      "**~97% factual accuracy** across **163 languages** · grounded responses reduced manual escalation on configuration, pricing, and feature-specification queries at scale.",
    ],
    bullets: [
      "Vehicle spec chatbots produced **inconsistent and factually unreliable answers** — the same query in different languages could return contradictory results; **manual support escalation** was the only fallback for spec-heavy queries, creating volume bottlenecks at scale.",
      "HDFC Bank's vehicle intelligence required accurate answers on structured specification data across **163 languages**. Standard chatbots failed on spec queries — generating inconsistent answers that increased manual support escalation.",
      "**RAG-based vehicle intelligence assistant** grounded in a curated specification database with image-linked attributes. **QA-tested retrieval pipeline** with dynamic data lookup across **163 languages** — localized responses grounded in the same structured data, not translated post-hoc.",
      "QA-gated retrieval enforces factual grounding before responses are served — no speculative answers on spec queries. Structured specification database acts as a single source of truth across all 163 language boundaries. Accuracy validated across full coverage before production.",
      "**~97% factual accuracy** across **163 languages**. Reduced manual support escalation on spec-heavy queries.",
    ],
    github: null,
  },
  {
    index: "08",
    slug: "laminar-metamorph-polymorph",
    title: "Laminar · Metamorph · Polymorph — AI Delivery Toolchain",
    company: "Gida Technologies",
    logo: GIDA_LOGO,
    logoHeight: 28,
    status: "Client Delivery",
    tags: [
      "AI CMS (Laminar)",
      "No-Code Chatbot Builder (Metamorph)",
      "API Utility Engine (Polymorph)",
      "163-Language Content Generation",
      "cURL-to-20+ Language Conversion",
      "AI-Generated Visuals",
    ],
    impact:
      "Three interlinked AI tools · 163-language content generation · cURL-to-20+ language API conversion",
    summary: [
      "Content generation, chatbot delivery, and API conversion lived in **separate tools with manual handoffs** — output drifted across every project.",
      "Designed a **three-part AI toolchain**: Laminar for multilingual content, Metamorph for no-code chatbots, and Polymorph for API conversion scaffolds.",
      "Each tool ships **standardized deployable artifacts** — brand-consistent visuals, multilingual content at scale, and cURL-derived code across 20+ languages.",
      "**Three fragmented workflows unified** · **163-language content generation** at scale · no-code bot delivery cut engineering dependency · API work accelerated.",
    ],
    bullets: [
      "Content generation, bot deployment, and API conversion each required **separate tools and manual handoff steps** — inconsistent output quality across every client engagement; **multilingual content at scale** had no standardized generation path; chatbot delivery required **engineering involvement** for every new deployment or update.",
      "Teams building multilingual products, chatbots, and API integrations operated with **fragmented tooling** — content generation, bot deployment, and API code conversion each required separate workflows and produced inconsistent output quality.",
      "Designed and shipped **three interlinked AI tools**: **Laminar** — AI CMS for multilingual content generation across **163+ languages** with AI-generated visuals and multi-format export; **Metamorph** — no-code chatbot builder from prompts or documentation; **Polymorph** — cURL-to-**20+ language** API converter with endpoint scaffolding.",
      "**Standardized output artifacts** across all three tools produce deployable outputs — not drafts. 163+ language generation maintains consistent quality without per-language customization. AI-generated visuals produce brand-consistent outputs from prompts across client deployments.",
      "**Three fragmented workflows replaced** by a unified toolchain. **163-language content generation at scale**. No-code bot deployment removed engineering dependency from chatbot delivery.",
    ],
    github: null,
  },
  {
    index: "09",
    slug: "skill-recommendation-engine",
    title: "Graph-Based Skill Recommendation Engine",
    company: "Prismforce",
    logo: prismforceLogoImg,
    logoHeight: 28,
    status: "Client Delivery",
    tags: [
      "Weighted Directed Graph",
      "Multi-Level Skill Hierarchy",
      "Dynamic Node Updates",
      "Mathematical Scoring Heuristics",
      "Real-Time Inference",
      "NVIDIA T4",
    ],
    impact:
      "+30% recommendation relevance · sub-50ms latency · single NVIDIA T4 under production load",
    summary: [
      "Skill recommendations ignored **hierarchical relationships**, taxonomy changes forced **full batch retraining**, and live inference missed the **sub-50ms** target.",
      "Built a **weighted directed graph** over multi-level skill hierarchies with typed edges and lightweight scoring — structure, not retraining, drives relevance.",
      "Dynamic node insertion and deterministic traversal keep the graph current; latency was profiled at the **99th percentile** under production load.",
      "**+30% relevance** · **sub-50ms inference** on a single **NVIDIA T4** · taxonomy expansion no longer required batch retraining · live updates stayed current.",
    ],
    bullets: [
      "The recommendation system **ignored hierarchical skill relationships** — related skills treated as independent nodes with no structural modeling; **every taxonomy expansion triggered full batch retraining**, blocking updates until recompute completed; inference latency under production concurrency **exceeded the sub-50ms SLA** required for live platform use.",
      "Prismforce needed real-time skill recommendations against a **large, evolving taxonomy**. The existing system missed hierarchical skill relationships, went stale under profile updates, and couldn't hit **sub-50ms latency** for live platform use.",
      "Real-time recommendation engine using a **weighted directed graph** encoding multi-level skill hierarchy relationships as typed edges with dynamic weight updates. **Lightweight mathematical scoring heuristics** minimize computational overhead per inference call. Update model handles **dynamic node additions without full graph recomputation**.",
      "**Deterministic traversal logic** produces consistent outputs under frequent profile and taxonomy updates. Heuristics keep inference paths predictable and bounded. **Latency profiled under realistic production concurrency** on NVIDIA T4 before deployment.",
      "**~30% improvement** in recommendation relevance. **Sub-50ms inference** on NVIDIA T4 under production load. **Dynamic updates eliminated batch retraining** on taxonomy expansion.",
    ],
    github: null,
  },
  {
    index: "10",
    slug: "pinns",
    title: "Physics-Informed Neural Networks (PINNs)",
    company: "BMS College of Engineering",
    logo: BMSCE_LOGO,
    logoHeight: 28,
    status: "Best Outgoing Project · 2022–23",
    tags: [
      "PINNs",
      "Dual-Loss Optimization",
      "PDEs / ODEs",
      "Fluid Dynamics",
      "Structural Mechanics",
      "Heat Transfer",
    ],
    impact:
      "Best Outgoing Project · BMSCE 2022–23 · 6 validated benchmarks across fluid, structural, and thermal domains",
    summary: [
      "Purely data-driven simulation needed **large labeled datasets** and produced **physically invalid solutions** when sparse data let models ignore governing laws.",
      "Developed a **dual-loss PINN framework** that embeds **PDE/ODE constraints** directly into optimization — data fit and physical law are solved together.",
      "Validated across **six benchmarks** spanning fluid, structural, and thermal domains, including Burgers' equation plus Neumann and Dirichlet variants.",
      "**Stable convergence** across three physics domains with limited data · HVAC and server-cooling use cases explored · **Best Outgoing Project — BMSCE 2022–23**.",
    ],
    bullets: [
      "Purely data-driven physics simulation required **large labeled datasets** expensive or impossible to generate experimentally; sparse training data produced **physically implausible solutions** — the model could satisfy the data loss while violating governing equations; no unified framework existed that validated across multiple physics domains simultaneously.",
      "Physics simulation (fluid dynamics, structural mechanics, heat transfer) is **unstable under purely data-driven approaches** — requires large labeled datasets that are expensive or impossible to generate, and produces physically implausible solutions under sparse data.",
      "**Dual-loss PINN framework** embedding governing **PDE/ODE constraints directly into the optimization objective** alongside data loss. Validated across **six benchmarks**: Burgers' equation, 1D heat conduction via pin fin, fixed-fixed column deflection, cantilever tip deflection, 1D transient cooling under **Neumann flux and Dirichlet boundary conditions**.",
      "Physics constraints act as a **regularizer** — preventing physically implausible solutions from satisfying data loss alone. Neumann and Dirichlet boundary condition variants validated generalizability across constraint types and problem geometries.",
      "**Stable convergence across 6 physics benchmarks** — fluid, structural, thermal — with limited labeled data. Applied use cases in HVAC thermal feedback and server cooling. **Best Outgoing Project — BMSCE 2022–23**.",
    ],
    github: null,
  },
  {
    index: "12",
    slug: "scholaros",
    title: "ScholarOS — Structured Research Execution Platform",
    company: "Personal",
    logo: "https://cdn.simpleicons.org/github/ffffff",
    logoHeight: 18,
    status: "In Development",
    tags: [
      "MCP Orchestrator · DAG Execution",
      "9 Deterministic Services",
      "Hypothesis · Critic Agent Loop",
      "Evidence-Bound Outputs",
      "Chroma · SQLite · Redis",
      "Local-First · Self-Hostable",
    ],
    impact:
      "5,479 chunks · 180 claims · 76 contradictions detected · 100% determinism rate · fully local execution",
    summary: [
      "Research copilots generate **fluent text without evidence traceability** — grounded synthesis and hallucination look identical, so no claim can be audited.",
      "**Five locked MCP services** cover literature mapping, contradiction detection, hypothesis critique, evidence extraction, and assembly through **schema-defined interfaces**.",
      "Only hypothesis critique remains agentic — **bounded to five iterations**; all other stages are deterministic with provenance preserved through **typed artifacts**.",
      "Each claim is **bound to source evidence**; contradiction detection marks where consensus breaks, keeping outputs falsifiable and useful beyond sessions.",
    ],
    bullets: [
      "Generic AI tools applied to academic research produce **fluent text with no evidence traceability** — hallucinated synthesis is structurally indistinguishable from grounded synthesis; literature review, contradiction detection, hypothesis validation, evidence extraction, and proposal drafting each require **separate manual workflows** with no shared execution model; hypothesis stress-testing relies on the same model that generated the hypothesis — no adversarial challenge, no convergence gate, **no provenance on the resulting claim**.",
      "ScholarOS is a **structured research execution platform** — five capabilities delivered as a DAG-executed MCP workflow, not a chatbox. Every output is **bound to source evidence**. Contradiction detection runs across the full corpus, not per-query. Hypothesis critique uses a **bounded Hypothesis / Critic agent loop** with convergence detection — not unconstrained generation. Nine services process research artifacts with rule-based, schema-defined, reproducible logic. **No service imports another service** — all data flows through the orchestrator via MCP tool invocations.",
      "**MCP Orchestrator** executes workflows as DAGs with pause/resume, session management, and full trace logging. Five capabilities: **Literature Mapping** (HDBSCAN clustering + LLM cluster labeling + paper ranking), **Contradiction & Consensus** (claim extraction → metric normalization → polarity/value divergence detection → Belief Engine confidence assignment), **Hypothesis & Critique** (bounded Hypothesis/Critic loop, max 5 iterations, grounded to source claim identifiers), **Multimodal Evidence Extraction** (tables, figures, metrics from PDFs → structured output), **Proposal Assistant** (validated hypotheses → Markdown/LaTeX with citation assembly). Data layer: **Chroma** (vector), **SQLite** (metadata), **Redis** (session). Local inference: **Ollama qwen2.5:32b**, **sentence-transformers all-MiniLM-L6-v2**.",
      "**100% determinism rate** — identical inputs produce identical outputs; no stochastic processes in the deterministic pipeline. Nine independently testable services with no global state and no inter-service imports — all data flows through the orchestrator, **eliminating hidden state**. Agent reasoning is **explicitly bounded**: max 5 iterations per hypothesis loop with required grounding to source claim identifiers. March 2026 validation: **5,479 chunks processed**, **180 claims extracted**, **76 contradictions detected**.",
      "**Five research output artifacts** — ClusterMap (JSON), Contradiction Report (JSON), Validated Hypotheses (JSON), Research Proposals (Markdown · LaTeX), Extracted Evidence (CSV · JSON). **Fully local and self-hostable** — no external API dependency for any deterministic pipeline stage.",
    ],
    github: "https://github.com/ughshwin/ScholarOS",
  },
  {
    index: "11",
    slug: "controla",
    title: "controla — Local-First Self-Improving Inference OS",
    company: "Personal",
    logo: "https://cdn.simpleicons.org/github/ffffff",
    logoHeight: 18,
    status: "In Development",
    tags: [
      "Local-First Inference OS",
      "19 Backends · 7 Modalities",
      "Closed Learning Loop (EWMA)",
      "Redis-Backed Priority Scheduler",
      "VRAM-Aware Routing",
      "Policy Versioning · Replay Validation",
    ],
    impact:
      "19 backends · 7 modalities · closed learning loop · routing accuracy compounds with every deployment",
    summary: [
      "**Local inference routing is stateless by default** — prior outcomes are ignored, so each request repeats the same blind dispatch mistakes.",
      "Every request feeds **contextual EWMA weight learning**, so routing adapts to workload; the system **improves as it runs** without retuning.",
      "**Policy updates are replay-validated before promotion** — candidate routes degrading latency, accuracy, or SLA coverage are blocked before reaching live traffic.",
      "Inference becomes a **managed workload** — routing is versioned policy, feedback is structured reward signal, and learning compounds without operator retuning.",
    ],
    bullets: [
      "**Static routing** in local inference stacks assigns every request to the same backend regardless of task type, VRAM headroom, or load history — no task-aware dispatch, no hardware state, no learning from prior outcomes; **modality coverage is fragmented** across disjoint infrastructure with no unified API surface; learning state is **in-memory only** — a process restart erases every routing insight accumulated; **no policy validation mechanism** means routing changes go live blind with no regression gate against historical performance data.",
      "controla is a **local-first inference OS** — 19 backends across 7 modalities (text gen, STT, TTS, image generation, embeddings, vision, reasoning) under one OpenAI-compatible API. Every request is classified, scored against **6 dimensions**, scheduled, dispatched, and observed. Routing policy learns from execution telemetry — **contextual EWMA weights per `(backend, task_type, complexity)`** persist across restarts via Redis. Not a gateway. Not a proxy. A **self-improving control plane** that treats inference as a managed system workload.",
      "**FeatureExtractor** classifies task type across 10 categories and 3 complexity levels before dispatch. **ScoringEngine** evaluates every candidate across capability, performance, resource, load, reliability, and context — VRAM-aware routing applies **−15 if model cannot fit, +1.5 when already loaded**. **Redis-backed priority queue** with per-user fairness enforcement, deadline-aware dispatch via `x-latency-budget` header, and starvation prevention. **ExecutionPlanner** decomposes high-complexity reasoning into typed step chains. **329 passing tests**.",
      "The **scoring engine is stateless and deterministic** — same inputs, same score; all learning lives above it in a versioned **RoutingPolicy** layer. **ReplayEngine** validates every policy candidate against historical data before promotion — gated on p95 latency regression and failure rate delta. **ε-greedy exploration** runs under hard guardrails: capability-matched and VRAM-safe backends only, within configured latency ceilings, on designated traffic buckets.",
      "**19 backends across 7 modalities** — text gen (vLLM · Ollama · TensorRT-LLM · NVIDIA NIM · ExLlamaV2 · LocalAI · AirLLM), STT (faster-whisper · Parakeet · Voxtral · WhisperX), TTS (Kokoro · Fish Audio), image generation (ComfyUI · Automatic1111 · InvokeAI), embeddings (Infinity · TEI), vision (Koboldcpp). Learning state **persists across restarts** via Redis. Routing accuracy compounds with usage.",
    ],
    github: "https://github.com/ughshwin/controla",
  },
];

const SUMMARY_LABELS = ["Problem", "System", "Design", "Outcome"];

function ProjectCard({ p, index }: { p: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  const showOutcome = hovered || revealed;

  const isAward = p.status === "Best Outgoing Project · 2022–23";
  const statusColor = isAward
    ? "#facc15"
    : p.status === "Client Delivery"
      ? "#22d3ee"
      : p.devStatus === "completed"
        ? "#4ade80"
        : "#facc15";
  const statusBorder = isAward
    ? "rgba(250,204,21,0.35)"
    : p.status === "Client Delivery"
      ? "rgba(34,211,238,0.4)"
      : p.devStatus === "completed"
        ? "rgba(74,222,128,0.35)"
        : "rgba(250,204,21,0.35)";
  const statusBg = isAward
    ? "rgba(250,204,21,0.06)"
    : p.status === "Client Delivery"
      ? "rgba(34,211,238,0.08)"
      : p.devStatus === "completed"
        ? "rgba(74,222,128,0.06)"
        : "rgba(250,204,21,0.06)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.025 }}
      transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (isMobile && !revealed) {
          setRevealed(true);
          return;
        }
        window.location.href = `/projects/${p.slug}`;
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1.6rem",
        borderRadius: "8px",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.15)"}`,
        background: "transparent",
        transition: "border-color 0.2s, color 0.2s",
        cursor: "pointer",
      }}
    >
      {/* Title + badge row */}
      <div
        style={{
          display: "flex",
          flexDirection: isDesktop ? "row" : "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: isDesktop ? "0.75rem" : "0.5rem",
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
            flex: 1,
          }}
        >
          {p.title}
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
            marginTop: isDesktop ? "3px" : 0,
            color: statusColor,
            border: `1px solid ${statusBorder}`,
            background: statusBg,
          }}
        >
          {p.status}
          {isAward && " 🏆"}
        </span>
      </div>

      {/* Company */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <img
          src={p.logo}
          alt={p.company}
          style={{
            height: `${p.logoHeight}px`,
            width: "auto",
            maxWidth: "72px",
            objectFit: "contain",
            opacity: 0.85,
          }}
          onError={(e) =>
            ((e.currentTarget as HTMLImageElement).style.display = "none")
          }
        />
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: "0.7rem",
            letterSpacing: "0.09em",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          {p.company}
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

      {/* Bullets — first 3 always visible; 4th (Outcome) revealed on hover */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "0.65rem",
        }}
      >
        {(p.summary as string[]).slice(0, 3).map((bullet, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "0.65rem",
              alignItems: "flex-start",
              ...(i === 2 && !showOutcome
                ? {
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 20%, transparent 100%)",
                    maskImage:
                      "linear-gradient(to bottom, black 20%, transparent 100%)",
                  }
                : {}),
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
                width: "76px",
                lineHeight: 1.5,
              }}
            >
              {SUMMARY_LABELS[i]}
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

        {/* 4th bullet (Outcome) — fades in on hover */}
        <AnimatePresence>
          {showOutcome && (
            <motion.div
              key="outcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
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
                  width: "76px",
                  lineHeight: 1.5,
                }}
              >
                {SUMMARY_LABELS[3]}
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
                {renderBullet(p.summary[3])}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer: index + arrow */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
          paddingTop: "0.25rem",
        }}
      >
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: "0.62rem",
            color: "rgba(255,255,255,0.18)",
            letterSpacing: "0.1em",
          }}
        >
          {p.index}
        </span>
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
    </motion.div>
  );
}

export function Projects() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [isStuck, setIsStuck] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = document.querySelector(
      ".hologram-interface",
    ) as HTMLElement | null;
    if (!root) return;
    const check = () => {
      const top = sectionRef.current?.offsetTop ?? 0;
      setIsStuck((prev) => {
        if (!prev && root.scrollTop > top + 10) return true;
        if (prev && root.scrollTop < top + 7) return false;
        return prev;
      });
    };
    root.addEventListener("scroll", check, { passive: true });
    return () => root.removeEventListener("scroll", check);
  }, []);

  const visibleProjects = projects.filter(
    (p) =>
      p.title !== "ScholarOS — Structured Research Execution Platform" &&
      p.title !== "controla — Local-First Self-Improving Inference OS",
  );

  const orderedProjects = [...visibleProjects].sort((a, b) => {
    const aIsAward = a.status === "Best Outgoing Project · 2022–23";
    const bIsAward = b.status === "Best Outgoing Project · 2022–23";
    if (aIsAward === bIsAward) return 0;
    return aIsAward ? 1 : -1;
  });

  const maxPerRow = isMobile ? 1 : isTablet ? 2 : 3;
  const rows = useEqualRows(orderedProjects.length, maxPerRow);

  return (
    <section
      ref={sectionRef}
      id="projects"
      style={{
        padding: isMobile ? "2.75rem 4vw 4rem" : "6.5rem 6vw 10rem",
        background: "transparent",
        position: "relative",
      }}
    >
      {/* Sticky heading block */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          marginLeft: isMobile ? "-4vw" : "-6vw",
          marginRight: isMobile ? "-4vw" : "-6vw",
          paddingLeft: isMobile ? "4vw" : "6vw",
          paddingRight: isMobile ? "4vw" : "6vw",
          paddingTop: "0.85rem",
          paddingBottom: "0.85rem",
          background: isStuck
            ? "linear-gradient(to right, rgba(5,5,8,0.52) 0%, rgba(5,5,8,0.52) 45%, rgba(5,5,8,0) 88%)"
            : "transparent",
          backdropFilter: isStuck ? "blur(6px)" : "none",
          WebkitBackdropFilter: isStuck ? "blur(6px)" : "none",
          transition: "background 0.3s ease",
          marginBottom: "5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            marginBottom: "1rem",
          }}
        >
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: isStuck ? "0.5rem" : "0.62rem",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
              transition: "font-size 0.3s ease",
            }}
          >
            04 — Projects
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
        <div style={{ overflow: "hidden", background: "transparent" }}>
          <motion.h2
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            style={{
              fontFamily: FONT_SERIF,
              fontSize: isStuck
                ? isMobile
                  ? "clamp(1.26rem, 4.9vw, 2.8rem)"
                  : "clamp(1.8rem, 3.6vw, 3.3rem)"
                : isMobile
                  ? "clamp(1.8rem, 7vw, 4rem)"
                  : "clamp(3rem, 6vw, 5.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              color: "#fafaf8",
              margin: 0,
              transition: "font-size 0.30s ease",
            }}
          >
            Delivered, Scaled.
          </motion.h2>
        </div>
        {/* Hint */}
        <div style={{ textAlign: "right", marginTop: "0.6rem" }}>
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: "0.58rem",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.28)",
            }}
          >
            Tap to dive deeper
          </span>
        </div>
      </div>

      <EqualGridRenderer
        rows={rows}
        renderCard={(idx) => (
          <ProjectCard p={orderedProjects[idx]} index={idx} />
        )}
      />
    </section>
  );
}
