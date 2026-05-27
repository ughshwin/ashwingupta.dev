import { motion } from "motion/react";
import { useState } from "react";
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
    title: "ashwingupta.dev - Design Handoff to Production",
    company: "Personal",
    logo: "https://cdn.simpleicons.org/vercel/ffffff",
    logoHeight: 18,
    status: "Shipped",
    devStatus: "completed",
    tags: [
      "Spatial UI Architecture",
      "TypeScript / React",
      "Canvas 2D",
      "Astro • Vercel",
      "Performance Engineering",
      "Domain & DNS",
    ],
    impact:
      "Live at ashwingupta.dev • 90% image reduction • 72% JS bundle cut • 400 CSS DOM nodes eliminated",
    summary: [
      "The original portfolio claimed performance engineering while shipping **400 animated DOM nodes** and a **2 MB JPEG hero** - self-defeating on load.",
      "Rebuilt as a **three-layer spatial interface** - environment shell, Canvas particle field, hologram surface - collapsing all visual effects into one system.",
      "**Offscreen pre-rendering**, visibility-gated RAF, lazy loading, and WebP + fetchpriority preloads cut work at the source, making optimization structural not cosmetic.",
      "**90% image reduction** • **72% JS cut** • frame time **18–25ms → 4–6ms** • stable **60fps** under throttle • **400 animated DOM nodes** removed.",
    ],
    bullets: [
      "A portfolio site is its own proof unit. The designer baseline was self-defeating - the first thing a hiring manager measured was a **performance failure on the site claiming performance engineering**.",
      "Designer baseline: **400 CSS-animated DOM particles**, **2 MB JPEG** hero, Google Fonts loaded per-component, **72 unvetted dependencies**. The site needed to signal systems thinking - and was doing the opposite.",
      "Rebuilt end-to-end. **Three-layer spatial architecture** (environment, canvas particle field, hologram interface). All visual effects collapsed into a **single Canvas 2D RAF loop**. Images to WebP with fetchpriority preload. Below-fold sections split via **React.lazy + Suspense**.",
      "Scanline texture pre-rendered to offscreen canvas (**1 drawImage vs 270 fillRect/frame**). Edge cache rebuilt every 3 frames. RAF paused on visibility change. Mouse tracking gated behind RAF. **Stable 60 FPS under CPU throttle**.",
      "Image: **2 MB → 211 KB (90%)**. JS bundle: **72% cut**. DOM nodes: **400 CSS-animated eliminated**. Font requests: **3 → 0**. Canvas frame time: **18–25 ms → 4–6 ms**.",
    ],
    github: "https://github.com/ughshwin/ashwingupta.dev",
  },
  {
    index: "02",
    slug: "pageindexollama",
    title: "PageIndexOllama - Local-First Fork of PageIndex",
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
      "Fully offline tree-RAG execution • vendor lock-in eliminated • provider-agnostic runtime",
    summary: [
      "Tree-RAG was **hardwired to one provider contract** - completion differences silently corrupted recursive traversal; failures surface only at collapse.",
      "Added a **provider-routing layer** with **finish-reason normalization**, so traversal depends on stable internal contracts, not whichever runtime answered.",
      "Prompt externalization, bounded concurrency, and hierarchical fallback stabilize long-document runs on **local models** with uneven outputs and limited memory.",
      "**Fully offline tree-RAG** across Ollama, llama.cpp, and vLLM - provider switching is transparent, with no external API keys required.",
    ],
    bullets: [
      "All inference required a **live OpenAI API key** - offline or air-gapped execution was blocked entirely; **provider switches corrupted traversal silently** with no error surface; token encoding differences across providers produced inconsistent chunk boundaries with no visible signal.",
      "PageIndex's tree RAG was hardcoded to **OpenAI's API contract** - inline prompt strings, non-normalized completion handling. **Local or offline deployment was impossible**. Any provider change broke traversal.",
      "Forked and refactored: **provider-routing abstraction** resolved via env vars. **Finish-reason normalization layer** stabilizes recursive traversal across model outputs. Prompts externalized into a registry loader. **Bounded async concurrency** across TOC generation and summarization. Hierarchical fallback for large-document robustness.",
      "Normalized completion contracts prevent finish-reason variations from corrupting **recursive traversal state**. Fallback chunk policies handle **constrained VRAM and RAM**. Structured-output hardening absorbs imperfect model responses without pipeline failure.",
      "**Fully offline tree-RAG** with Ollama - no API keys. Seamless provider switching via stable internal contracts. Regression risk reduced through e2e coverage across document types and model sizes.",
    ],
    github: "https://github.com/ughshwin/PageIndexOllama",
  },
  {
    index: "03",
    slug: "research-it",
    title: "Research-It - Fully Local RAG System",
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
      "PyMuPDF • BeautifulSoup",
      "Privacy-First",
    ],
    impact:
      "Fully offline academic document QA • reproducible HNSW indexes • zero API dependency",
    summary: [
      "Academic RAG assumed **cloud inference by default** - air-gapped institutions and low-VRAM machines had no private path from ingestion to QA.",
      "Built a **local-first retrieval stack**: LEANN/HNSW indexes, dense embeddings, Ollama inference, and normalized ingestion across PDFs, HTML, and paper dirs.",
      "Chunk overlap, tuned **Top-K** and context windows; PyMuPDF and BeautifulSoup cleanup fix retrieval quality, before errors reach query time.",
      "**API-free academic QA** on **sub-1GB quantized models** • reproducible HNSW artifacts for air-gapped use • ingestion and retrieval run without cloud credentials.",
    ],
    bullets: [
      "Sensitive academic papers had **no private processing path** - all RAG required external inference APIs; researchers on **CPU-only or low-VRAM hardware** had no viable local inference option; institutions with air-gap requirements were blocked by all existing tooling.",
      "Researchers with sensitive papers had no offline RAG that handled mixed sources - local PDFs, arXiv URLs, paper directories - without exposing data to external inference APIs or cloud indexing.",
      "Fully local RAG: **LEANN/HNSW vector indexing** with dense embeddings (facebook/contriever), Ollama-backed inference, multi-source ingestion (PDFs, academic HTML, directories). Smart chunking with overlap, **configurable Top-K (3–4)** and **context windows (1024–1536 tokens)**. Quantized model support for CPU-only hardware.",
      "Reproducible index artifacts enable **air-gapped operation**. Context-window and Top-K settings tuned for recall vs. coherence tradeoff. PyMuPDF + BeautifulSoup handle varied PDF quality before indexing - not at query time.",
      "**API-free document QA** across academic sources. Runs on **sub-1GB quantized models**. Designed for air-gapped institutional research.",
    ],
    github: "https://github.com/ughshwin/research-it",
  },
  {
    index: "04",
    slug: "hsbc-voice",
    title: "Conversational Analytics - HSBC",
    company: "HSBC",
    logo: "https://cdn.simpleicons.org/hsbc/DB0011",
    logoHeight: 22,
    status: "Client Delivery",
    tags: [
      "SIP/Voice Orchestration (PJSIP • RFC 3261)",
      "CPU-Pinned Processes • asyncio + uvloop",
      "GCP Infrastructure (Packer • GCE • HPA)",
      "Cross-Stack Observability",
      "LLM Inference Pipeline",
      "Cost Engineering",
    ],
    impact:
      "1,600+ concurrent sessions • 7× VM capacity • ~$1.3M annualized savings • MTTR ~1–2 hrs → ~10 min",
    summary: [
      "GIL'd threading on a **32-core VM** left 31 cores idle - memory ballooning capped sessions at **20 per VM**; documentation **10–15 min**; incident recovery **1–2 hours**.",
      "Migrated to **8-core VM**; **8 CPU-pinned parallel instances** via taskset escaped GIL; **asyncio + uvloop** replaced threading - each SIP session a coroutine across SBC, STT, and LLM.",
      "Built **cross-stack log correlation**, SIPp load testing, and secure media transport - capacity, observability, and cost treated as one system.",
      "**7× per-VM capacity** • **1,600+ sessions** sustained • **$118K → $8K/month** • MTTR **1–2 hr → ~10 min** • docs **10–15 min → 2–3 min**.",
    ],
    bullets: [
      "**GIL'd threading caused memory ballooning** - concurrent sessions saturated at 20 per VM before packet loss rose above 10%; available hardware capacity was highly under-utilised; post-call documentation required **10–15 minutes of manual effort** per interaction with no automated path; fragmented cross-service logs with no correlation layer meant incidents required **1–2 hours of manual reconstruction** to identify root cause.",
      "The platform ran on GIL'd threading with **memory ballooning** on a **32-core VM** - capped at **20 concurrent calls**, 31 cores idle. Post-call documentation: **10–15 min per interaction**. Inference cost: **~$118K/month**. Incident recovery: **1–2 hours** - fragmented logs, no unified observability layer.",
      "Led a **4-engineer team**. Owned **Packer automation across all project modules** - standardizing GCE image builds for the full SIP stack **(SBC → STT → LLM inference)**. Migrated from **32-core n2-standard-32** to **8-core c4-standard-8**; deployed **8 CPU-pinned parallel instances** via <code>taskset</code> - one per core, escaping GIL entirely. Rewrote concurrency with **asyncio + uvloop**, eliminating memory ballooning. Built **SIPp load test suite** (2,000 concurrent users). Architected **cross-stack log-correlation** over GCP Logging APIs - **250K+ log lines in under 5 seconds**.",
      "**<2s E2E transcription latency**, <5% packet loss at 1,600+ concurrent sessions. libsrtp + DTLS/SRTP for in-transit security. Grafana-Prometheus with MACD triggers. Migrated **n2-standard-32 → c4-standard-8**, improving transcript length **30–40% under load**.",
      "**7× per-VM capacity (20 → 140–160 calls)**. **1,600+ sessions** sustained. Documentation: **10–15 min → 2–3 min**. Compute: **$118K → $8K/month (~$1.3M annualized savings)**. MTTR: **1–2 hours → ~10 minutes**.",
    ],
    github: null,
  },
  {
    index: "05",
    slug: "azure-infra-docs",
    title: "Azure Infrastructure Documentation Engine",
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
      "~2–3 days → ~2–3 hours documentation turnaround • 104 resource groups/project • zero fabricated components",
    summary: [
      "Azure docs relied on **manual exports and hand-drawn diagrams** - every project took **2–3 days** and drifted from live state.",
      "Built a **live-state extraction pipeline** - subscription scan, topology mapping, and security config analysis auto-generate SDDs and PlantUML from live resource evidence.",
      "**Few-shot prompting** grounds generation in extracted inventory; guardrails reject any component without a matching live resource - fabrication blocked from governance docs.",
      "**2–3 days → ~2–3 hours** • **104 resource groups** per engagement • **zero fabricated components** • manual PlantUML authoring removed.",
    ],
    bullets: [
      "Infrastructure documentation required **manual extraction from Azure** - 2–3 days per project; **PlantUML diagrams were authored by hand** from memory or stale exports; documented architecture drifted from live infrastructure state with **no mechanism to detect or correct divergence**.",
      "Enterprise infrastructure documentation required manual Azure subscription extraction - **2–3 days per project**. Produced stale views, delayed governance reviews, and documented state that drifted from live infrastructure.",
      "Built a Streamlit engine accepting a **subscription ID**, auto-generating SDDs and **PlantUML diagrams** via automated inventory extraction, network flow mapping, security config analysis, and dependency graph construction. **Few-shot LLM prompting** grounds architecture rationale in live state. **Validation guardrails** cross-check every generated component against extracted inventory.",
      "Guardrail layer enforces that every generated component maps to a **verified live resource** - hallucinated topology can't reach governance docs. Outputs regenerated from live subscription state - no cached snapshots, no documentation drift.",
      "Documentation: **2–3 days → ~2–3 hours**. Average **104 resource groups per project**. Eliminated manual PlantUML authoring. Live-state grounding replaced manual transcription.",
    ],
    github: null,
  },
  {
    index: "06",
    slug: "airline-contract-intelligence",
    title: "Airline Contract Intelligence System",
    company: "Amex GBT",
    logo: "https://cdn.simpleicons.org/americanexpress/2E77BC",
    logoHeight: 18,
    status: "Client Delivery",
    tags: [
      "PDF Table Extraction (Camelot • Ghostscript)",
      "GPT-4o Normalization",
      "One-Shot Prompting",
      "Mixed-Format Document Handling",
      "Contract Intelligence Pipeline",
    ],
    impact:
      "~96% extraction accuracy • automated normalization across varied airline PDF schemas",
    summary: [
      "Airline contracts mixed **scan-quality and readable PDF tables**; carrier template drift made manual review the only reliable extraction path.",
      "**Camelot + Ghostscript** extracted tables from both formats; **GPT-4o one-shot normalization** mapped carrier layouts into a schema-consistent output.",
      "One-shot prompting preserves coherence across carrier templates - no per-carrier tuning; covers full format range from scan images to nested tables.",
      "**~96% extraction accuracy** across airline contract Q&A • automated normalization replaced manual review • real-time query resolution, sales and support.",
    ],
    bullets: [
      "Airline contract tables were **reviewed manually** - slow, error-prone, and couldn't scale to the volume of carrier agreements; **template drift across carriers** meant each format required separate handling logic; sales and support queries on contract terms had **no real-time resolution path**.",
      "Airline contract PDFs for AMEX GBT mixed **image-embedded and readable tables**, with varied schemas and template drift across carriers. Manual review was slow, error-prone, and couldn't scale.",
      "Document intelligence pipeline: **Camelot + Ghostscript** extract tables from both image-embedded and readable PDF sources. **GPT-4o with one-shot prompting** normalizes across diverse contract formats - clause normalization, table structuring, schema-consistent output.",
      "One-shot prompting maintains contextual coherence across carrier templates **without per-carrier fine-tuning**. Camelot + Ghostscript in combination covers the full format range - from scan-quality images to nested programmatic tables.",
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
      "~97% factual accuracy • 163 languages • reduced manual escalation on specification queries",
    summary: [
      "Vehicle assistants answered **specification queries inconsistently across languages** - the same request could contradict itself, making manual escalation the safe fallback.",
      "Built a **RAG system** over a structured vehicle database with image-linked attributes - every answer grounded in one canonical source.",
      "**QA-gated retrieval** validates lookup quality before generation, while **163-language delivery** stays anchored to one data model instead of post-hoc translation.",
      "**~97% factual accuracy** across **163 languages** • grounded responses reduced manual escalation on configuration, pricing, and feature-specification queries at scale.",
    ],
    bullets: [
      "Vehicle spec chatbots produced **inconsistent and factually unreliable answers** - the same query in different languages could return contradictory results; **manual support escalation** was the only fallback for spec-heavy queries, creating volume bottlenecks at scale.",
      "HDFC Bank's vehicle intelligence required accurate answers on structured specification data across **163 languages**. Standard chatbots failed on spec queries - generating inconsistent answers that increased manual support escalation.",
      "**RAG-based vehicle intelligence assistant** grounded in a curated specification database with image-linked attributes. **QA-tested retrieval pipeline** with dynamic data lookup across **163 languages** - localized responses grounded in the same structured data, not translated post-hoc.",
      "QA-gated retrieval enforces factual grounding before responses are served - no speculative answers on spec queries. Structured specification database acts as a single source of truth across all 163 language boundaries. Accuracy validated across full coverage before production.",
      "**~97% factual accuracy** across **163 languages**. Reduced manual support escalation on spec-heavy queries.",
    ],
    github: null,
  },
  {
    index: "08",
    slug: "laminar-metamorph-polymorph",
    title: "Laminar • Metamorph • Polymorph - AI Delivery Toolchain",
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
      "Three interlinked AI tools • 163-language content generation • cURL-to-20+ language API conversion",
    summary: [
      "Content generation, chatbot delivery, and API conversion required **separate tools with manual handoffs** - output drifted across every project.",
      "Built **three-part AI toolchain**: Laminar for multilingual content, Metamorph for no-code chatbots, Polymorph for API conversion scaffolds.",
      "Each tool ships **standardized deployable artifacts** - brand-consistent visuals, multilingual content at scale, cURL-derived code across 20+ languages.",
      "**Three fragmented workflows unified** • **163-language content generation** at scale • no-code bot delivery removed engineering dependency • API work accelerated.",
    ],
    bullets: [
      "Content generation, bot deployment, and API conversion each required **separate tools and manual handoff steps** - inconsistent output quality across every client engagement; **multilingual content at scale** had no standardized generation path; chatbot delivery required **engineering involvement** for every new deployment or update.",
      "Teams building multilingual products, chatbots, and API integrations operated with **fragmented tooling** - content generation, bot deployment, and API code conversion each required separate workflows and produced inconsistent output quality.",
      "Designed and shipped **three interlinked AI tools**: **Laminar** - AI CMS for multilingual content generation across **163+ languages** with AI-generated visuals and multi-format export; **Metamorph** - no-code chatbot builder from prompts or documentation; **Polymorph** - cURL-to-**20+ language** API converter with endpoint scaffolding.",
      "**Standardized output artifacts** across all three tools produce deployable outputs - not drafts. 163+ language generation maintains consistent quality without per-language customization. AI-generated visuals produce brand-consistent outputs from prompts across client deployments.",
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
      "+30% recommendation relevance • sub-50ms latency • single NVIDIA T4 under production load",
    summary: [
      "Skill recommendations ignored **hierarchical relationships**, taxonomy changes forced **full batch retraining**, and live inference missed the **sub-50ms** SLA.",
      "Built a **weighted directed graph** over multilevel skill hierarchies with typed edges, lightweight scoring - structure, not retraining, drives relevance.",
      "Dynamic node insertion and deterministic traversal keep the graph current; latency was profiled at the **99th percentile** under production load.",
      "**+30% relevance** • **sub-50ms inference** on one **NVIDIA T4** • taxonomy expansion no longer required batch retraining • live updates stayed current.",
    ],
    bullets: [
      "The recommendation system **ignored hierarchical skill relationships** - related skills treated as independent nodes with no structural modeling; **every taxonomy expansion triggered full batch retraining**, blocking updates until recompute completed; inference latency under production concurrency **exceeded the sub-50ms SLA** required for live platform use.",
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
    status: "Best Outgoing Project • 2022–23",
    tags: [
      "PINNs",
      "Dual-Loss Optimization",
      "PDEs / ODEs",
      "Fluid Dynamics",
      "Structural Mechanics",
      "Heat Transfer",
    ],
    impact:
      "Best Outgoing Project • BMSCE 2022–23 • 6 validated benchmarks across fluid, structural, and thermal domains",
    summary: [
      "Purely data-driven simulation needed **large labeled datasets** and produced **physically invalid solutions** when sparse data let models ignore governing laws.",
      "Developed a **dual-loss PINN framework** that embeds **PDE/ODE constraints** directly into optimization - data fit and physical law are solved together.",
      "Validated across **six benchmarks** spanning fluid, structural, and thermal domains, including Burgers' equation plus Neumann and Dirichlet variants.",
      "**Stable convergence** across three physics domains with limited data • HVAC and server-cooling use cases explored • **Best Outgoing Project - BMSCE 2022–23**.",
    ],
    bullets: [
      "Purely data-driven physics simulation required **large labeled datasets** expensive or impossible to generate experimentally; sparse training data produced **physically implausible solutions** - the model could satisfy the data loss while violating governing equations; no unified framework existed that validated across multiple physics domains simultaneously.",
      "Physics simulation (fluid dynamics, structural mechanics, heat transfer) is **unstable under purely data-driven approaches** - requires large labeled datasets that are expensive or impossible to generate, and produces physically implausible solutions under sparse data.",
      "**Dual-loss PINN framework** embedding governing **PDE/ODE constraints directly into the optimization objective** alongside data loss. Validated across **six benchmarks**: Burgers' equation, 1D heat conduction via pin fin, fixed-fixed column deflection, cantilever tip deflection, 1D transient cooling under **Neumann flux and Dirichlet boundary conditions**.",
      "Physics constraints act as a **regularizer** - preventing physically implausible solutions from satisfying data loss alone. Neumann and Dirichlet boundary condition variants validated generalizability across constraint types and problem geometries.",
      "**Stable convergence across 6 physics benchmarks** - fluid, structural, thermal - with limited labeled data. Applied use cases in HVAC thermal feedback and server cooling. **Best Outgoing Project - BMSCE 2022–23**.",
    ],
    github: null,
  },
  {
    index: "12",
    slug: "scholaros",
    title: "ScholarOS - Structured Research Execution Platform",
    company: "Personal",
    logo: "https://cdn.simpleicons.org/github/ffffff",
    logoHeight: 18,
    status: "In Development",
    tags: [
      "MCP Orchestrator • DAG Execution",
      "9 Deterministic Services",
      "Hypothesis • Critic Agent Loop",
      "Evidence-Bound Outputs",
      "Chroma • SQLite • Redis",
      "Local-First • Self-Hostable",
    ],
    impact:
      "5,479 chunks • 180 claims • 76 contradictions detected • 100% determinism rate • fully local execution",
    summary: [
      "Research copilots generate **fluent text without evidence traceability** - grounded synthesis and hallucination look identical, so no claim can be audited.",
      "**Five locked MCP services** cover literature mapping, contradiction detection, hypothesis critique, evidence extraction, and assembly through **schema-defined interfaces**.",
      "Only hypothesis critique remains agentic - **bounded to five iterations**; all other stages are deterministic with provenance preserved through **typed artifacts**.",
      "Each claim is **bound to source evidence**; contradiction detection marks where consensus breaks, keeping outputs falsifiable and useful beyond sessions.",
    ],
    bullets: [
      "Generic AI tools applied to academic research produce **fluent text with no evidence traceability** - hallucinated synthesis is structurally indistinguishable from grounded synthesis; literature review, contradiction detection, hypothesis validation, evidence extraction, and proposal drafting each require **separate manual workflows** with no shared execution model; hypothesis stress-testing relies on the same model that generated the hypothesis - no adversarial challenge, no convergence gate, **no provenance on the resulting claim**.",
      "ScholarOS is a **structured research execution platform** - five capabilities delivered as a DAG-executed MCP workflow, not a chatbox. Every output is **bound to source evidence**. Contradiction detection runs across the full corpus, not per-query. Hypothesis critique uses a **bounded Hypothesis / Critic agent loop** with convergence detection - not unconstrained generation. Nine services process research artifacts with rule-based, schema-defined, reproducible logic. **No service imports another service** - all data flows through the orchestrator via MCP tool invocations.",
      "**MCP Orchestrator** executes workflows as DAGs with pause/resume, session management, and full trace logging. Five capabilities: **Literature Mapping** (HDBSCAN clustering + LLM cluster labeling + paper ranking), **Contradiction & Consensus** (claim extraction → metric normalization → polarity/value divergence detection → Belief Engine confidence assignment), **Hypothesis & Critique** (bounded Hypothesis/Critic loop, max 5 iterations, grounded to source claim identifiers), **Multimodal Evidence Extraction** (tables, figures, metrics from PDFs → structured output), **Proposal Assistant** (validated hypotheses → Markdown/LaTeX with citation assembly). Data layer: **Chroma** (vector), **SQLite** (metadata), **Redis** (session). Local inference: **Ollama qwen2.5:32b**, **sentence-transformers all-MiniLM-L6-v2**.",
      "**100% determinism rate** - identical inputs produce identical outputs; no stochastic processes in the deterministic pipeline. Nine independently testable services with no global state and no inter-service imports - all data flows through the orchestrator, **eliminating hidden state**. Agent reasoning is **explicitly bounded**: max 5 iterations per hypothesis loop with required grounding to source claim identifiers. March 2026 validation: **5,479 chunks processed**, **180 claims extracted**, **76 contradictions detected**.",
      "**Five research output artifacts** - ClusterMap (JSON), Contradiction Report (JSON), Validated Hypotheses (JSON), Research Proposals (Markdown • LaTeX), Extracted Evidence (CSV • JSON). **Fully local and self-hostable** - no external API dependency for any deterministic pipeline stage.",
    ],
    github: "https://github.com/ughshwin/ScholarOS",
  },
];

const PROJECT_DETAIL_PATHS: Partial<Record<string, string>> = {
  "ashwingupta-dev": "/work/ashwingupta-dev",
  pageindexollama: "/work/pageindexollama",
  "research-it": "/work/research-it",
  "azure-infra-docs": "/work/azure-infra-docs",
  "airline-contract-intelligence": "/work/airline-contract-intelligence",
  "laminar-metamorph-polymorph": "/work/laminar-metamorph-polymorph",
  "skill-recommendation-engine": "/work/skill-recommendation-engine",
};

const SUMMARY_LABELS = ["Problem", "System", "Design", "Outcome"];

// Featured card for HSBC / Controla
function FeaturedCard({
  p,
  caseStudyHref,
  caseStudyLabel,
}: {
  p: Project;
  caseStudyHref: string;
  caseStudyLabel: string;
}) {
  const [hovered, setHovered] = useState(false);
  const isMobile = useIsMobile();

  const isHSBC = p.slug === "hsbc-voice";
  const accentColor = isHSBC ? "#22d3ee" : "#e8e0d0";
  const accentBorder = isHSBC
    ? "rgba(34,211,238,0.4)"
    : "rgba(232,224,208,0.25)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: isMobile ? "1.6rem" : "2.4rem",
        borderRadius: "8px",
        border: `1px solid ${hovered ? accentBorder : "rgba(255,255,255,0.12)"}`,
        background: "transparent",
        transition: "border-color 0.25s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent top line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: accentColor,
          opacity: hovered ? 0.7 : 0.3,
          transition: "opacity 0.25s",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "1.5rem" : "3vw",
          alignItems: "start",
        }}
      >
        {/* Left: header info */}
        <div>
          {/* Company + status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "1.2rem",
            }}
          >
            <img
              src={p.logo}
              alt={p.company}
              style={{
                height: `${p.logoHeight}px`,
                width: "auto",
                maxWidth: "60px",
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
                fontSize: "0.62rem",
                letterSpacing: "0.09em",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              {p.company}
            </span>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: "0.52rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "2px 8px",
                borderRadius: "20px",
                color: accentColor,
                border: `1px solid ${accentBorder}`,
                background: isHSBC
                  ? "rgba(34,211,238,0.06)"
                  : "rgba(232,224,208,0.04)",
              }}
            >
              {p.status}
            </span>
          </div>

          <h3
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 800,
              fontSize: isMobile ? "1.4rem" : "1.7rem",
              color: "#fafaf8",
              lineHeight: 1.2,
              margin: "0 0 1rem",
              letterSpacing: "0.02em",
            }}
          >
            {p.title}
          </h3>

          <p
            style={{
              fontFamily: FONT_MONO,
              fontSize: "0.62rem",
              letterSpacing: "0.06em",
              color: accentColor,
              opacity: 0.9,
              marginBottom: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            {p.impact}
          </p>

          {/* CTA link */}
          <a
            href={caseStudyHref}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: FONT_MONO,
              fontSize: "0.62rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: accentColor,
              textDecoration: "none",
              border: `1px solid ${accentBorder}`,
              borderRadius: "4px",
              padding: "8px 14px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = isHSBC
                ? "rgba(34,211,238,0.08)"
                : "rgba(232,224,208,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            {caseStudyLabel} →
          </a>
        </div>

        {/* Right: summary bullets */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}
        >
          {p.summary.slice(0, 3).map((bullet, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "0.65rem",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.58rem",
                  color: "rgba(255,255,255,0.2)",
                  marginTop: "4px",
                  flexShrink: 0,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  width: "70px",
                }}
              >
                {SUMMARY_LABELS[i]}
              </span>
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: "0.85rem",
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.55)",
                  textAlign: "justify",
                  textJustify: "inter-word",
                }}
              >
                {renderBullet(bullet)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div
        style={{
          display: "flex",
          gap: "5px",
          flexWrap: "wrap",
          marginTop: "1.5rem",
          paddingTop: "1.2rem",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {p.tags.map((t) => (
          <span
            key={t}
            style={{
              fontFamily: FONT_MONO,
              fontSize: "0.52rem",
              letterSpacing: "0.07em",
              color: "rgba(255,255,255,0.35)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "2px",
              padding: "3px 7px",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// Compact secondary card
function ProjectCard({ p, index }: { p: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  const showOutcome = hovered || revealed;

  const isAward = p.status === "Best Outgoing Project • 2022–23";
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
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (isMobile && !revealed) {
          setRevealed(true);
          return;
        }
        window.location.href =
          PROJECT_DETAIL_PATHS[p.slug] ?? `/projects/${p.slug}`;
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "1.4rem",
        borderRadius: "8px",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.1)"}`,
        background: "transparent",
        transition: "border-color 0.2s",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.85rem",
          overflow: "hidden",
          maxHeight: showOutcome ? "1000px" : "14rem",
          transition: "max-height 0.5s cubic-bezier(0.76, 0, 0.24, 1)",
          ...(!showOutcome
            ? {
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 75%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, black 75%, transparent 100%)",
              }
            : {}),
        }}
      >
        {/* Title + badge row */}
        <div
          style={{
            display: "flex",
            flexDirection: isDesktop ? "row" : "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "0.5rem",
          }}
        >
          <p
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 800,
              fontSize: "1.35rem",
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
              fontSize: "0.5rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              padding: "3px 8px",
              borderRadius: "20px",
              flexShrink: 0,
              alignSelf: "flex-start",
              color: statusColor,
              border: `1px solid ${statusBorder}`,
              background: statusBg,
            }}
          >
            {p.status}
          </span>
        </div>

        {/* Company */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
            src={p.logo}
            alt={p.company}
            style={{
              height: `${Math.min(p.logoHeight, 32)}px`,
              width: "auto",
              maxWidth: "56px",
              objectFit: "contain",
              opacity: 0.8,
            }}
            onError={(e) =>
              ((e.currentTarget as HTMLImageElement).style.display = "none")
            }
          />
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: "0.62rem",
              letterSpacing: "0.09em",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            {p.company}
          </span>
        </div>

        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

        {/* All bullets - always rendered; mask fades last bullet until hover */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {p.summary.map((bullet, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "0.55rem",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.56rem",
                  color: "rgba(255,255,255,0.2)",
                  marginTop: "3px",
                  flexShrink: 0,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  width: "58px",
                }}
              >
                {SUMMARY_LABELS[i]}
              </span>
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: "0.82rem",
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.5)",
                  textAlign: "justify",
                  textJustify: "inter-word",
                }}
              >
                {renderBullet(bullet)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow - outside masked div, always fully visible */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "auto",
        }}
      >
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: "0.65rem",
            color: hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
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

  const secondaryProjects = projects.filter(
    (p) =>
      p.slug !== "hsbc-voice" &&
      p.slug !== "here-app" &&
      p.slug !== "pinns" &&
      p.slug !== "scholaros",
  );

  const orderedSecondary = [...secondaryProjects].sort((a, b) => {
    const aIsAward = a.status === "Best Outgoing Project • 2022–23";
    const bIsAward = b.status === "Best Outgoing Project • 2022–23";
    if (aIsAward === bIsAward) return 0;
    return aIsAward ? 1 : -1;
  });

  const maxPerRow = isMobile ? 1 : isTablet ? 2 : 3;
  const rows = useEqualRows(orderedSecondary.length, maxPerRow);

  return (
    <section
      id="projects"
      style={{
        position: "relative",
        background: "transparent",
        padding: isMobile ? "5rem 4vw" : "4rem 0",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
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
              Projects
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
                lineHeight: 1.1,
                letterSpacing: "0.02em",
                color: "#fafaf8",
                margin: 0,
              }}
            >
              Systems that had to hold.
            </motion.h2>
          </div>
        </div>

        {/* Content strip */}
        <div style={{ padding: isMobile ? "2rem 0 0" : "1.5rem 6vw 4rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <p
              style={{
                fontFamily: FONT_MONO,
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.28)",
                textTransform: "uppercase",
                marginBottom: "1.5rem",
              }}
            >
              All projects
            </p>
          </div>
          <EqualGridRenderer
            rows={rows}
            renderCard={(idx) => (
              <ProjectCard p={orderedSecondary[idx]} index={idx} />
            )}
          />
        </div>
      </div>
    </section>
  );
}
