# Virtual Cosmos — Implementation Plan & BRD

> **Status**: Pre-implementation  
> **Target**: Production-grade global deployment  
> **Stack**: Astro + React + TypeScript + Vercel + Supabase + Three.js

---

## Table of Contents

1. [Vision & Overview](#1-vision--overview)
2. [Business Requirements](#2-business-requirements)
3. [User Stories & Acceptance Criteria](#3-user-stories--acceptance-criteria)
4. [System Architecture](#4-system-architecture)
5. [Galaxy Renderer](#5-galaxy-renderer)
6. [Eligibility Tracking](#6-eligibility-tracking)
7. [Security Architecture](#7-security-architecture)
8. [Backend Schema & Data Model](#8-backend-schema--data-model)
9. [API Design](#9-api-design)
10. [VMWR — Virtual Milky Way Registry](#10-vmwr--virtual-milky-way-registry)
11. [Postcard Generation](#11-postcard-generation)
12. [Gift Flow](#12-gift-flow)
13. [Global Scale & Robustness](#13-global-scale--robustness)
14. [Performance Budget](#14-performance-budget)
15. [Implementation Phases](#15-implementation-phases)
16. [Required Credentials & Integrations](#16-required-credentials--integrations)
17. [Open Decisions](#17-open-decisions)

---

## 1. Vision & Overview

**Virtual Cosmos** is an interactive feature embedded in the personal portfolio. It renders the Milky Way galaxy as a real-time WebGL visualization using 2^15 = 32,768 stars. Visitors who meaningfully engage with the portfolio earn the right to name one of those stars. Named stars persist for 90 days, are publicly visible in the **Virtual Milky Way Registry (VMWR)**, and generate a shareable postcard with a binary star ID.

### Core Concept

- Galaxy is a permanent fixture of the portfolio homepage — the **Virtual Cosmos** section.
- Stars are identified by a 15-digit binary ID (`000000000000000` – `111111111111111`).
- Star naming is earned, not instant — gating ensures only genuine visitors participate.
- Named stars expire after 90 days, returning to the pool.
- Names are globally unique at any point in time — no two active stars can share a name.
- Visitors can name a star for themselves, or gift one to someone else for an occasion.
- VMWR is a public, always-live registry of all currently active named stars.

### Why This Exists on a Portfolio

- Proof of technical depth (WebGL, distributed systems, Edge architecture).
- Creates genuine social memory — visitors remember and share their star.
- Differentiates the portfolio from every other developer portfolio on the internet.
- Binary star ID is a deliberate CS aesthetic — readable only by those in the know.

---

## 2. Business Requirements

### BR-01: Galaxy Visualization

- Render 32,768 stars arranged in a Milky Way spiral galaxy structure.
- Must run at 60fps on modern desktop and mobile hardware.
- Must not block initial page load or degrade Core Web Vitals.
- Galaxy section loads lazily — WebGL context initializes only when section enters viewport.
- Star twinkling and slow galaxy rotation are continuous animations, zero CPU cost per frame.

### BR-02: Eligibility Criteria

A visitor earns star-naming rights when **all three** conditions are satisfied:

| Condition              | Requirement                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| Time on site           | ≥ 3 minutes (180,000ms) of active tab time                                                        |
| Meaningful interaction | ≥ 1 click on a content item: article, project, research entry, featured item                      |
| Full homepage scroll   | Must scroll through entire homepage (not jump via nav — must physically scroll past all sections) |

### BR-03: Star Naming

- Visitor selects a name for their star (free text, validated).
- Name must be globally unique among all currently active (non-expired) stars (case-insensitive).
- On successful claim: visitor receives star ID (binary), star name, expiry date, and postcard.
- Star is assigned randomly from the available pool.

### BR-04: Star Expiry

- Stars expire 90 days after claim.
- Expired stars return to the available pool.
- Expired star names become available again (a new person can claim the same name after the previous holder's star expires).

### BR-05: Gift Flow

- Visitor can name a star as a gift: provide gift_from (their name), star_name (recipient/occasion name), occasion (free text).
- Postcard wording changes to: "[gift_from] gifts you star [binary_id] to celebrate [occasion]".
- Gift stars count against the same 32,768 pool and same name-uniqueness constraint.

### BR-06: Postcard

- Every successful claim generates a downloadable/shareable postcard image.
- Format: PNG, 1200×630px (Open Graph dimensions).
- Contains: binary star ID, star name, claim date, expiry date, gift wording if applicable.
- Generated client-side (Canvas API) — no server-side image generation.
- Shareable via Web Share API on mobile; download link on desktop.

### BR-07: VMWR

- Public page showing all currently active named stars.
- Fields visible: binary star ID, name, occasion (if gift), days remaining, date named.
- gift_from is **not** shown publicly to protect gifter privacy.
- Searchable by name or binary star ID.
- Sortable: most recent, name alphabetical, expiry soonest.
- Shows live count: "X of 32,768 stars currently named".
- Galaxy view option: same WebGL render with named stars highlighted in gold.

### BR-08: Bot & Abuse Prevention

- Behavioral bot detection layered with third-party challenge (Turnstile).
- Rate limiting: 1 star claim per IP per 24 hours.
- Eligibility tokens are single-use, signed, time-limited.
- All writes are server-side via Vercel Edge Functions — browser never touches DB directly.
- SQL injection prevented at client (input validation), transport (parameterized queries only), and DB (RLS).

### BR-09: Global Scale

- Must handle traffic spikes from social sharing (postcard going viral).
- VMWR read traffic served from cache — DB read load near zero at scale.
- All claim logic runs at Vercel Edge (global PoP network) — low latency worldwide.
- Zero downtime deploys via Vercel.

---

## 3. User Stories & Acceptance Criteria

### US-01: New Visitor

**As** a first-time visitor,  
**I want** to discover the galaxy visualization while exploring the portfolio,  
**So that** I have a reason to engage deeply with the content.

**AC:**

- Galaxy renders within 2s of section entering viewport.
- Galaxy does not cause layout shift or block scroll.
- A subtle CTA appears: "Earn your star — explore the portfolio."

### US-02: Eligible Visitor Naming a Star

**As** a visitor who has met all three eligibility criteria,  
**I want** to name a star for myself,  
**So that** I have a personal, lasting (90-day) connection to this portfolio.

**AC:**

- Galaxy section shows "You've earned a star" badge after criteria met.
- Clicking the badge opens a claim modal.
- Modal shows: name input, uniqueness feedback (live check), confirm button.
- On success: modal shows binary star ID, name, expiry date.
- Named star glows gold in the galaxy view immediately.
- Postcard download/share is available on success screen.

### US-03: Visitor Gifting a Star

**As** a visitor who wants to celebrate an occasion,  
**I want** to name a star as a gift for someone else,  
**So that** I can share a unique, memorable keepsake.

**AC:**

- Claim modal has toggle: "For me" / "Gift to someone".
- Gift mode adds fields: "Your name", "Star name (recipient/occasion)", "Occasion".
- Postcard wording reflects gift context.
- Gift_from is stored but never shown in VMWR.

### US-04: Visitor Browsing VMWR

**As** any visitor (with or without a star),  
**I want** to explore the registry of all named stars,  
**So that** I can see the community of visitors and find my own star.

**AC:**

- VMWR loads within 1s (cached response).
- Shows count badge: "X / 32,768 stars named".
- Search by name returns results within 200ms.
- Each entry shows: binary ID, name, occasion, days remaining.
- Galaxy view highlights named stars on hover with tooltip.

### US-05: Returning Visitor

**As** a returning visitor who previously named a star,  
**I want** to see my star still exists,  
**So that** I feel a lasting connection to the portfolio.

**AC:**

- Star ID stored in localStorage on successful claim.
- On return visit, "Your star" widget in the galaxy section shows the stored star.
- If star has expired: "Your star [ID] has expired — scroll through to earn a new one."

---

## 4. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER (Client)                      │
│                                                          │
│  ┌──────────────┐  ┌─────────────────┐  ┌────────────┐ │
│  │ Three.js     │  │ Eligibility     │  │ Postcard   │ │
│  │ Galaxy       │  │ Tracker         │  │ Generator  │ │
│  │ Renderer     │  │ (time+scroll+   │  │ (Canvas    │ │
│  │ (WebWorker   │  │  interaction)   │  │  API)      │ │
│  │  for init)   │  │                 │  │            │ │
│  └──────────────┘  └─────────────────┘  └────────────┘ │
│           │                  │                           │
│           └──────────────────┼───────────────────────── │
│                              ▼                           │
│              POST /api/request-eligibility-token         │
│              POST /api/claim-star                        │
│              GET  /api/vmwr                              │
│              GET  /api/check-name                        │
└─────────────────────────────────────────────────────────┘
                              │
                  ┌───────────▼───────────┐
                  │  VERCEL EDGE NETWORK  │
                  │  (40+ global PoPs)    │
                  │                       │
                  │  ┌─────────────────┐  │
                  │  │ Edge Middleware  │  │
                  │  │ • Arcjet WAF     │  │
                  │  │ • Bot Detection  │  │
                  │  │ • Rate Limiting  │  │
                  │  └────────┬────────┘  │
                  │           │           │
                  │  ┌────────▼────────┐  │
                  │  │ Edge Functions  │  │
                  │  │ /api/*          │  │
                  │  └────────┬────────┘  │
                  └───────────┼───────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
    ┌─────────▼──────┐  ┌─────▼────┐  ┌──────▼──────┐
    │   SUPABASE     │  │ VERCEL   │  │ CLOUDFLARE  │
    │   POSTGRES     │  │   KV     │  │ TURNSTILE   │
    │                │  │  Redis   │  │             │
    │ • stars table  │  │          │  │ • CAPTCHA   │
    │ • RLS policies │  │ • Rate   │  │   validate  │
    │ • PgBouncer    │  │   limits │  │             │
    │   pooler       │  │ • Nonces │  │             │
    │ • read replica │  │ • VMWR   │  │             │
    │   (Pro)        │  │   cache  │  │             │
    └────────────────┘  └──────────┘  └─────────────┘
```

### Runtime Request Flow

```
Claim Star:
  Browser → Arcjet Edge Middleware
          → POST /api/request-eligibility-token
            (behavioral payload → KV rate check → sign JWT → return token)
          → Turnstile challenge rendered in modal
          → POST /api/claim-star
            (Arcjet bot detect → Turnstile validate → JWT verify + nonce consume → DB atomic claim)
          → Return star data → client renders postcard

VMWR Read:
  Browser → GET /api/vmwr
          → Edge Function checks KV cache (TTL 30s)
          → Cache hit: return immediately
          → Cache miss: query Supabase → store in KV → return
          → (99%+ of reads never reach Supabase at scale)
```

---

## 5. Galaxy Renderer

### Technology Choice

**Three.js `BufferGeometry` + `Points` — single draw call for all 32,768 stars.**

| Approach         | 32k stars @ 60fps                    | Choice  |
| ---------------- | ------------------------------------ | ------- |
| DOM/CSS nodes    | Impossible (<1fps)                   | No      |
| SVG elements     | ~15fps                               | No      |
| Canvas 2D        | ~40fps low-end                       | No      |
| **WebGL Points** | **60fps on any GPU made after 2015** | **Yes** |

### New Dependency

```
three: ^0.170.0
@types/three: ^0.170.0
```

Code-split — loaded only for the Virtual Cosmos section.

### Galaxy Generation Algorithm

All star positions computed once in a **Web Worker** on first load, stored in `Float32Array`, uploaded to GPU. Zero per-frame CPU cost for positions.

```ts
// workers/galaxy-gen.worker.ts
// Runs off main thread — keeps scroll and interaction fully responsive during init

function generateMilkyWay(count: number): GalaxyBuffers {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count); // for per-star twinkling
  const starTypes = new Uint8Array(count); // 0=main-seq 1=giant 2=young-blue 3=old-red

  const ARMS = 4;
  const TWIST = 3.5; // spiral tightness
  const DISK_THICKNESS = 0.025;
  const BULGE_FRACTION = 0.12; // 12% of stars in central bulge

  // Star color palette (physically motivated)
  const COLORS = [
    [1.0, 1.0, 0.85], // main sequence (yellow-white, like Sun)
    [1.0, 0.7, 0.4], // red giants
    [0.6, 0.8, 1.0], // young blue stars (spiral arm tips)
    [1.0, 0.95, 0.8], // old white stars (bulge)
  ];

  function gaussian(): number {
    // Box-Muller transform
    return (
      Math.sqrt(-2 * Math.log(Math.random())) *
      Math.cos(2 * Math.PI * Math.random())
    );
  }

  for (let i = 0; i < count; i++) {
    const isBulge = Math.random() < BULGE_FRACTION;
    let x: number, y: number, z: number;

    if (isBulge) {
      // Spherical gaussian cluster at center
      const r = Math.abs(gaussian()) * 0.12;
      const θ = Math.random() * Math.PI * 2;
      const φ = Math.acos(2 * Math.random() - 1);
      x = r * Math.sin(φ) * Math.cos(θ);
      y = r * Math.sin(φ) * Math.sin(θ);
      z = r * Math.cos(φ) * 0.4; // flatten slightly
    } else {
      // Logarithmic spiral arm
      const arm = Math.floor(Math.random() * ARMS);
      const r = Math.pow(Math.random(), 0.5) * 0.9 + 0.05; // bias toward center
      const θ_arm = arm * ((Math.PI * 2) / ARMS);
      const θ_spiral = θ_arm + r * TWIST + gaussian() * 0.25;

      x = r * Math.cos(θ_spiral) + gaussian() * 0.025;
      y = r * Math.sin(θ_spiral) + gaussian() * 0.025;
      // Disk thins toward edges
      z = gaussian() * DISK_THICKNESS * (1 - r * 0.7);
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Color: blue tips on arms, yellow core, random variation
    const distFromCenter = Math.sqrt(x * x + y * y);
    const colorIdx = isBulge
      ? 3
      : distFromCenter > 0.7
        ? 2 // outer arms: blue young stars
        : distFromCenter < 0.15
          ? 3 // core: old white
          : Math.random() < 0.15
            ? 1 // 15% red giants scattered
            : 0; // majority: main sequence

    const [r, g, b] = COLORS[colorIdx];
    colors[i * 3] = r + (Math.random() - 0.5) * 0.1;
    colors[i * 3 + 1] = g + (Math.random() - 0.5) * 0.1;
    colors[i * 3 + 2] = b + (Math.random() - 0.5) * 0.1;

    sizes[i] = 0.3 + Math.random() * 0.7; // base size variation
    seeds[i] = Math.random() * 100;
    starTypes[i] = colorIdx;
  }

  return { positions, colors, sizes, seeds, starTypes };
}
```

### Vertex Shader (Twinkling + Named Star Glow)

```glsl
// All animation GPU-side — zero CPU per frame
uniform float uTime;
uniform float uPixelRatio;

attribute float seed;
attribute float size;
attribute float isNamed;   // 0.0 or 1.0 — set when star names load from API

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  // Twinkling: each star has unique phase via seed
  float twinkle = sin(uTime * 1.8 + seed * 6.283) * 0.25 + 0.75;

  // Named stars pulse with stronger glow
  float namePulse = isNamed * (sin(uTime * 2.5 + seed) * 0.4 + 1.6);
  float finalSize = size * twinkle * (1.0 + namePulse) * uPixelRatio;

  gl_PointSize = finalSize * (300.0 / -mvPosition.z);
  gl_Position  = projectionMatrix * mvPosition;
}
```

```glsl
// Fragment shader
uniform sampler2D uStarTexture; // pre-baked soft circle sprite

varying vec3 vColor;
varying float vIsNamed;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float dist = length(uv);
  if (dist > 0.5) discard;

  // Glow falloff
  float alpha = smoothstep(0.5, 0.0, dist) * 0.8;

  // Named stars: gold tint
  vec3 finalColor = vIsNamed > 0.5
    ? mix(vColor, vec3(1.0, 0.85, 0.2), 0.7)
    : vColor;

  gl_FragColor = vec4(finalColor, alpha);
}
```

### Lazy Loading Strategy

```tsx
// components/VirtualCosmos.tsx
import { useEffect, useRef } from "react";

export function VirtualCosmos() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<GalaxyRenderer | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || rendererRef.current) return;

        // Dynamic import — Three.js only loads when section is visible
        const { GalaxyRenderer } = await import("../lib/galaxy/GalaxyRenderer");
        rendererRef.current = new GalaxyRenderer(containerRef.current!);
        observer.disconnect();
      },
      { threshold: 0.1 },
    );

    observer.observe(containerRef.current!);
    return () => observer.disconnect();
  }, []);

  return <div ref={containerRef} className="w-full h-screen relative" />;
}
```

### Star Picking (Hover/Click on 32k Points)

```ts
// Throttled raycasting — runs at most once per animation frame
class StarPicker {
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private pending = false;

  constructor(
    private camera: THREE.Camera,
    private points: THREE.Points,
  ) {
    this.raycaster.params.Points!.threshold = 0.008;
  }

  onMouseMove(e: MouseEvent, canvas: HTMLCanvasElement) {
    if (this.pending) return;
    this.pending = true;

    requestAnimationFrame(() => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        ((e.clientY - rect.top) / rect.height) * -2 + 1,
      );
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const hits = this.raycaster.intersectObject(this.points);
      this.pending = false;
      return hits[0]?.index ?? null;
    });
  }
}
```

For truly massive interaction load, fall back to a spatial hash grid (divide galaxy space into cells, check only neighboring cells on raycast — O(1) average).

---

## 6. Eligibility Tracking

### Three-Condition Gate

```ts
// lib/eligibility/tracker.ts

interface EligibilityState {
  sessionStart: number;
  threeMinutes: boolean;
  interacted: boolean;
  fullyScrolled: boolean;
  interactionTimestamps: number[]; // for behavioral analysis
  scrollLog: Array<{ pos: number; t: number }>;
  mouseEvents: Array<{ x: number; y: number; t: number }>;
}

export class EligibilityTracker {
  private state: EligibilityState = {
    sessionStart: performance.now(),
    threeMinutes: false,
    interacted: false,
    fullyScrolled: false,
    interactionTimestamps: [],
    scrollLog: [],
    mouseEvents: [],
  };

  private listeners: Array<() => void> = [];

  start() {
    this.trackTime();
    this.trackInteractions();
    this.trackScroll();
    this.trackMouse();
  }

  private trackTime() {
    // Use Page Visibility API — pause timer when tab is hidden
    let accumulatedTime = 0;
    let lastVisible = performance.now();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        accumulatedTime += performance.now() - lastVisible;
      } else {
        lastVisible = performance.now();
      }
    });

    const check = () => {
      if (this.state.threeMinutes) return;
      const total = document.hidden
        ? accumulatedTime
        : accumulatedTime + (performance.now() - lastVisible);
      if (total >= 180_000) {
        this.state.threeMinutes = true;
        this.notify();
      } else {
        setTimeout(check, 10_000);
      }
    };
    setTimeout(check, 10_000);
  }

  private trackInteractions() {
    // Content selectors — expand as sections are added
    const CONTENT_SELECTORS = [
      '[data-track="project"]',
      '[data-track="research"]',
      '[data-track="featured"]',
      '[data-track="article"]',
      '[data-track="experience"]',
    ];

    const handler = () => {
      if (!this.state.interacted) {
        // Require interaction after 30s minimum (blocks bots that click immediately)
        const elapsed = performance.now() - this.state.sessionStart;
        if (elapsed < 30_000) return;
        this.state.interacted = true;
        this.state.interactionTimestamps.push(performance.now());
        this.notify();
      } else {
        this.state.interactionTimestamps.push(performance.now());
      }
    };

    CONTENT_SELECTORS.forEach((sel) => {
      document
        .querySelectorAll(sel)
        .forEach((el) =>
          el.addEventListener("click", handler, { passive: true }),
        );
    });
  }

  private trackScroll() {
    // Use IntersectionObserver on the footer — harder to fake than scrollY check
    const footer = document.querySelector("footer");
    if (!footer) return;

    window.addEventListener(
      "scroll",
      () => {
        this.state.scrollLog.push({
          pos: window.scrollY,
          t: performance.now(),
        });
      },
      { passive: true },
    );

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !this.state.fullyScrolled) {
          // Must have accumulated real scroll distance (not teleport)
          const totalScrollDistance = this.state.scrollLog.reduce(
            (acc, e, i) => {
              if (i === 0) return acc;
              return acc + Math.abs(e.pos - this.state.scrollLog[i - 1].pos);
            },
            0,
          );

          // Must have scrolled more than 80% of page height cumulatively
          if (totalScrollDistance > document.body.scrollHeight * 0.8) {
            this.state.fullyScrolled = true;
            this.notify();
          }
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(footer);
  }

  private trackMouse() {
    document.addEventListener(
      "mousemove",
      (e) => {
        // Sample at most 20 events/sec to keep array manageable
        const last = this.state.mouseEvents[this.state.mouseEvents.length - 1];
        if (last && performance.now() - last.t < 50) return;
        this.state.mouseEvents.push({
          x: e.clientX,
          y: e.clientY,
          t: performance.now(),
        });
      },
      { passive: true },
    );
  }

  private notify() {
    if (this.isEligible()) this.listeners.forEach((fn) => fn());
  }

  isEligible(): boolean {
    return (
      this.state.threeMinutes &&
      this.state.interacted &&
      this.state.fullyScrolled
    );
  }

  getBehavioralPayload(): BehavioralPayload {
    return {
      elapsed_ms: performance.now() - this.state.sessionStart,
      scroll_log_count: this.state.scrollLog.length,
      scroll_total_distance: this.state.scrollLog.reduce(
        (acc, e, i) =>
          i === 0
            ? acc
            : acc + Math.abs(e.pos - this.state.scrollLog[i - 1].pos),
        0,
      ),
      scroll_stddev_ratio: this.computeScrollVariance(),
      interaction_count: this.state.interactionTimestamps.length,
      first_interaction_delay_ms: this.state.interactionTimestamps[0]
        ? this.state.interactionTimestamps[0] - this.state.sessionStart
        : 0,
      mouse_entropy: this.computeMouseEntropy(),
      webgl_renderer: this.getWebGLRenderer(),
    };
  }

  private computeScrollVariance(): number {
    const log = this.state.scrollLog;
    if (log.length < 10) return 0;
    const velocities = log
      .slice(1)
      .map((e, i) => Math.abs(e.pos - log[i].pos) / (e.t - log[i].t + 0.001))
      .filter((v) => v > 0);
    const mean = velocities.reduce((s, v) => s + v, 0) / velocities.length;
    const stddev = Math.sqrt(
      velocities.reduce((s, v) => s + (v - mean) ** 2, 0) / velocities.length,
    );
    return mean > 0 ? stddev / mean : 0; // coefficient of variation
  }

  private computeMouseEntropy(): number {
    const events = this.state.mouseEvents;
    if (events.length < 30) return 0;
    const angles: number[] = [];
    for (let i = 2; i < events.length; i++) {
      const dx1 = events[i - 1].x - events[i - 2].x;
      const dy1 = events[i - 1].y - events[i - 2].y;
      const dx2 = events[i].x - events[i - 1].x;
      const dy2 = events[i].y - events[i - 1].y;
      if (dx1 === 0 && dy1 === 0) continue;
      angles.push(Math.atan2(dy2 * dx1 - dx2 * dy1, dx2 * dx1 + dy2 * dy1));
    }
    const mean = angles.reduce((s, a) => s + a, 0) / angles.length;
    const variance =
      angles.reduce((s, a) => s + (a - mean) ** 2, 0) / angles.length;
    return Math.min(Math.sqrt(variance), 1);
  }

  private getWebGLRenderer(): string {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") as WebGLRenderingContext | null;
    if (!gl) return "none";
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "unknown";
  }

  onEligible(fn: () => void) {
    this.listeners.push(fn);
  }
}
```

### Data Attributes Required

Every clickable content item in the portfolio must carry a `data-track` attribute. Add to:

| Component                                      | Attribute                 |
| ---------------------------------------------- | ------------------------- |
| `Projects.tsx` — project cards                 | `data-track="project"`    |
| `Research.tsx` — research entries              | `data-track="research"`   |
| `Featured.tsx` — featured items                | `data-track="featured"`   |
| `ExperienceTimeline.tsx` — company/role expand | `data-track="experience"` |

---

## 7. Security Architecture

### 7.1 Input Sanitization

```ts
// lib/validation.ts
const NAME_MAX = 50;
const SAFE_NAME = /^[\p{L}\p{N}\s'\-\.]+$/u;

export function validateStarName(raw: string): string {
  const name = raw.trim().replace(/\s+/g, " ");
  if (!name || name.length > NAME_MAX)
    throw new ValidationError("invalid_length");
  if (!SAFE_NAME.test(name)) throw new ValidationError("invalid_chars");
  if (/[\x00-\x1F\x7F]/.test(name)) throw new ValidationError("control_chars");
  return name;
}

export function validateOccasion(raw: string): string {
  const occ = raw.trim().replace(/\s+/g, " ");
  if (occ.length > 100) throw new ValidationError("occasion_too_long");
  if (/[\x00-\x1F\x7F]/.test(occ)) throw new ValidationError("control_chars");
  return occ;
}
```

### 7.2 Supabase Security

```sql
-- All writes use service_role (server-side only, key never exposed to browser)
-- anon key grants read-only access to active stars for VMWR

ALTER TABLE stars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_active" ON stars
  FOR SELECT
  USING (expires_at > NOW());

CREATE POLICY "service_role_all" ON stars
  FOR ALL
  USING (auth.role() = 'service_role');
```

The `SUPABASE_SERVICE_ROLE_KEY` is **only** used in Vercel Edge Functions (server-side env var). It is never exposed to the browser. The browser uses the `SUPABASE_ANON_KEY` only for VMWR reads.

### 7.3 Eligibility JWT

```ts
// lib/jwt.ts — runs in Vercel Edge Function
import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.CLAIM_JWT_SECRET);

export async function signEligibilityToken(
  payload: EligibilityTokenPayload,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m") // 10 minute window to complete claim
    .sign(SECRET);
}

export async function verifyEligibilityToken(
  token: string,
): Promise<EligibilityTokenPayload> {
  const { payload } = await jwtVerify(token, SECRET);
  return payload as EligibilityTokenPayload;
}

interface EligibilityTokenPayload {
  ip: string;
  nonce: string; // UUID, consumed on use
  risk_score: number; // 0-100, logged for audit
  iat: number;
  exp: number;
}
```

### 7.4 Nonce Storage (Replay Prevention)

All nonces stored in Vercel KV with 10-minute TTL. On claim, nonce is deleted atomically. Second attempt with same nonce → 409 Conflict.

### 7.5 Bot Detection Scoring

```ts
// api/request-eligibility-token.ts
function scoreBotRisk(payload: BehavioralPayload): number {
  let risk = 0;

  // WebGL: software renderer = very strong bot signal
  if (
    /swiftshader|llvmpipe|softpipe|virtualbox|vmware/i.test(
      payload.webgl_renderer,
    )
  )
    risk += 45;

  // Mouse: no movement or perfectly linear = bot
  if (payload.mouse_entropy < 0.05) risk += 30;
  else if (payload.mouse_entropy < 0.15) risk += 15;

  // Scroll: perfectly uniform velocity = scripted
  if (payload.scroll_stddev_ratio < 0.1) risk += 25;
  else if (payload.scroll_stddev_ratio < 0.2) risk += 10;

  // Interaction: too fast (< 30s) = bot
  if (payload.first_interaction_delay_ms < 30_000) risk += 20;

  // Too few scroll events for claimed distance = fake
  if (payload.scroll_log_count < 15 && payload.elapsed_ms > 60_000) risk += 15;

  return Math.min(risk, 100);
}

// Risk threshold: >= 60 → reject as bot
const RISK_THRESHOLD = 60;
```

### 7.6 Rate Limiting

All rate limits stored in Vercel KV.

| Limit                              | Key                 | TTL    |
| ---------------------------------- | ------------------- | ------ |
| 1 eligibility token per IP per 24h | `elig:{ip}`         | 86400s |
| 3 claim attempts per IP per hour   | `claim:{ip}:{hour}` | 3600s  |
| 1 name-check per IP per second     | `namecheck:{ip}`    | 1s     |
| 5 VMWR requests per IP per second  | `vmwr:{ip}`         | 1s     |

### 7.7 Arcjet Middleware

Runs at the Vercel Edge before any function. Handles:

- Playwright/Puppeteer/headless Chrome detection (ML-based, not just `navigator.webdriver`)
- Shield WAF (OWASP top 10 protection)
- DDoS protection at application layer

```ts
// middleware.ts
import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/next";
import type { NextRequest } from "next/server";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:MONITOR"],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 10,
      capacity: 20,
    }),
  ],
});

export default async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/api/")) return;
  const decision = await aj.protect(req);
  if (decision.isDenied())
    return new Response("Access denied", { status: 403 });
}
```

### 7.8 Cloudflare Turnstile

Invisible CAPTCHA. Renders in the claim modal. Token validated server-side before claim proceeds.

```ts
// lib/turnstile.ts
export async function validateTurnstile(
  token: string,
  ip: string,
): Promise<boolean> {
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ip,
      }),
    },
  );
  const data = await res.json();
  return data.success === true;
}
```

---

## 8. Backend Schema & Data Model

### 8.1 Supabase SQL Schema

```sql
-- Star pool: pre-populate all 32,768 rows at setup
-- Unclaimed stars have name=NULL, expires_at in the past

CREATE TABLE stars (
  star_id     SMALLINT        PRIMARY KEY CHECK (star_id >= 0 AND star_id <= 32767),
  name        TEXT,           -- NULL = unclaimed
  gift_from   TEXT,           -- NULL = self-named
  occasion    TEXT,           -- NULL = no occasion
  claimed_at  TIMESTAMPTZ,
  expires_at  TIMESTAMPTZ
);

-- Enforce name uniqueness only among currently active stars (case-insensitive)
CREATE UNIQUE INDEX stars_active_name_lower_idx
  ON stars (LOWER(name))
  WHERE expires_at > NOW() AND name IS NOT NULL;

-- Fast lookups for available stars and expiry scanning
CREATE INDEX stars_expires_at_idx ON stars (expires_at);
CREATE INDEX stars_star_id_idx    ON stars (star_id);

-- Historical log (soft archive — never deleted, for "hall of fame" feature)
CREATE TABLE star_history (
  id          BIGSERIAL       PRIMARY KEY,
  star_id     SMALLINT        REFERENCES stars(star_id),
  name        TEXT            NOT NULL,
  gift_from   TEXT,
  occasion    TEXT,
  claimed_at  TIMESTAMPTZ     NOT NULL,
  expired_at  TIMESTAMPTZ     NOT NULL
);

-- Trigger: archive to star_history when a star is reclaimed (name changes)
CREATE OR REPLACE FUNCTION archive_star_on_reclaim()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.name IS NOT NULL AND OLD.expires_at <= NOW() THEN
    INSERT INTO star_history (star_id, name, gift_from, occasion, claimed_at, expired_at)
    VALUES (OLD.star_id, OLD.name, OLD.gift_from, OLD.occasion, OLD.claimed_at, OLD.expires_at);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER star_archive_trigger
  BEFORE UPDATE ON stars
  FOR EACH ROW
  WHEN (OLD.name IS DISTINCT FROM NEW.name)
  EXECUTE FUNCTION archive_star_on_reclaim();
```

### 8.2 Seed Script

```ts
// scripts/seed-stars.ts — run once at project setup
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const BATCH_SIZE = 500;
const TOTAL = 32768;

for (let start = 0; start < TOTAL; start += BATCH_SIZE) {
  const rows = Array.from(
    { length: Math.min(BATCH_SIZE, TOTAL - start) },
    (_, i) => ({
      star_id: start + i,
      name: null,
      expires_at: new Date(0).toISOString(), // epoch = immediately available
    }),
  );
  await supabase.from("stars").insert(rows);
  console.log(`Seeded ${start + rows.length} / ${TOTAL}`);
}
```

### 8.3 Atomic Claim Query

```sql
-- Function: claim_star(p_name, p_gift_from, p_occasion)
-- Returns the claimed star row, or raises exception on failure

CREATE OR REPLACE FUNCTION claim_star(
  p_name      TEXT,
  p_gift_from TEXT DEFAULT NULL,
  p_occasion  TEXT DEFAULT NULL
)
RETURNS TABLE (
  star_id    SMALLINT,
  name       TEXT,
  gift_from  TEXT,
  occasion   TEXT,
  claimed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER  -- runs as owner (service_role), bypasses RLS for write
AS $$
DECLARE
  v_star_id SMALLINT;
BEGIN
  -- Lock and pick one available star atomically
  SELECT s.star_id INTO v_star_id
  FROM stars s
  WHERE s.expires_at <= NOW()
    AND s.name IS NULL OR s.expires_at <= NOW()  -- available = expired or never claimed
  ORDER BY RANDOM()
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'no_stars_available';
  END IF;

  -- Check name uniqueness (partial index handles this, but explicit check for clear error)
  IF EXISTS (
    SELECT 1 FROM stars
    WHERE LOWER(name) = LOWER(p_name)
      AND expires_at > NOW()
  ) THEN
    RAISE EXCEPTION 'name_taken';
  END IF;

  -- Claim it
  UPDATE stars SET
    name       = p_name,
    gift_from  = p_gift_from,
    occasion   = p_occasion,
    claimed_at = NOW(),
    expires_at = NOW() + INTERVAL '90 days'
  WHERE star_id = v_star_id
  RETURNING stars.star_id, stars.name, stars.gift_from, stars.occasion, stars.claimed_at, stars.expires_at
  INTO star_id, name, gift_from, occasion, claimed_at, expires_at;

  RETURN NEXT;
END;
$$;
```

### 8.4 Connection Pooling

Always connect to Supabase via the **PgBouncer pooler URL** (not direct connection):

```
# Direct (DO NOT USE for edge functions — exhausts connections)
SUPABASE_URL=postgresql://...@db.xxx.supabase.co:5432/postgres

# Pooler (USE THIS — transaction mode, scales to thousands of concurrent requests)
SUPABASE_URL=postgresql://...@xxx.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## 9. API Design

All endpoints are **Vercel Edge Functions** (not Node.js serverless — Edge runs globally at PoP nearest user).

### POST `/api/request-eligibility-token`

Validates behavioral payload, issues signed JWT.

**Request:**

```json
{
  "elapsed_ms": 185000,
  "scroll_log_count": 94,
  "scroll_total_distance": 14320,
  "scroll_stddev_ratio": 0.62,
  "interaction_count": 3,
  "first_interaction_delay_ms": 45000,
  "mouse_entropy": 0.71,
  "webgl_renderer": "ANGLE (NVIDIA, NVIDIA GeForce RTX 3080 Direct3D11 vs_5_0 ps_5_0)"
}
```

**Response (success):**

```json
{ "token": "<signed-JWT>" }
```

**Response (bot detected):**

```json
{ "error": "bot_detected", "code": 403 }
```

**Response (rate limited):**

```json
{ "error": "rate_limited", "retry_after": 86400 }
```

---

### POST `/api/claim-star`

Claims a star. Requires eligibility JWT + Turnstile token.

**Request:**

```json
{
  "name": "Nova",
  "eligibility_token": "<JWT>",
  "turnstile_token": "<Turnstile response>",
  "gift_from": null,
  "occasion": null
}
```

**Response (success):**

```json
{
  "star_id": 14892,
  "star_id_binary": "011101000101100",
  "name": "Nova",
  "claimed_at": "2026-05-30T14:22:10Z",
  "expires_at": "2026-08-28T14:22:10Z"
}
```

**Response (name taken):**

```json
{ "error": "name_taken", "code": 409 }
```

**Response (no stars available):**

```json
{ "error": "pool_exhausted", "next_expiry": "2026-06-02T08:15:00Z" }
```

---

### GET `/api/check-name?name=<value>`

Real-time uniqueness check as user types in modal (debounced, 500ms).

**Response:**

```json
{ "available": true }
// or
{ "available": false }
```

Rate limited to 1 req/sec/IP via KV.

---

### GET `/api/vmwr`

Returns all active named stars. Edge-cached in Vercel KV (TTL 30s).

**Query params:** `?page=1&per_page=100&sort=recent&search=nova`

**Response:**

```json
{
  "total": 847,
  "pool_size": 32768,
  "page": 1,
  "per_page": 100,
  "stars": [
    {
      "star_id": 14892,
      "star_id_binary": "011101000101100",
      "name": "Nova",
      "occasion": null,
      "claimed_at": "2026-05-30T14:22:10Z",
      "expires_at": "2026-08-28T14:22:10Z",
      "days_remaining": 89
    }
  ]
}
```

---

### GET `/api/vmwr/star/:star_id`

Single star detail (for VMWR detail view / postcard share URL).

---

## 10. VMWR — Virtual Milky Way Registry

### Route

`/cosmos` — new top-level page (added to Astro routes + vercel.json rewrites).

### Layout

```
┌─────────────────────────────────────────────────┐
│  Virtual Milky Way Registry                     │
│  847 / 32,768 stars currently named             │
│                                                 │
│  [Search by name or star ID...]  [Sort ▾]       │
│                                                 │
│  ┌─────────┬──────────────┬────────┬──────────┐ │
│  │ Star ID │ Name         │Occasion│ Expires  │ │
│  ├─────────┼──────────────┼────────┼──────────┤ │
│  │ 011101… │ Nova         │   —    │ 89 days  │ │
│  │ 000010… │ Andromeda    │ Wedding│ 42 days  │ │
│  └─────────┴──────────────┴────────┴──────────┘ │
│                                                 │
│  [1] [2] [3] … [9]                              │
│                                                 │
│  ── Galaxy View ──────────────────────────────  │
│  [Same WebGL galaxy, named stars glow gold]     │
│  [Hover star → tooltip with name]               │
│  [Click star → detail card]                     │
└─────────────────────────────────────────────────┘
```

### Named Stars in Galaxy

After VMWR fetch, merge named star IDs into the WebGL buffer:

```ts
// After fetching VMWR data
const namedIds = new Set(vmwrStars.map((s) => s.star_id));
const isNamedAttr = points.geometry.attributes.isNamed;

for (let i = 0; i < 32768; i++) {
  isNamedAttr.array[i] = namedIds.has(i) ? 1.0 : 0.0;
}
isNamedAttr.needsUpdate = true;
```

### Hall of Fame (Historical)

Secondary tab on `/cosmos` showing all-time named stars from `star_history` table. Paginated, not cached (read traffic negligible).

---

## 11. Postcard Generation

100% client-side. No server image generation.

```ts
// lib/postcard/generate.ts

interface PostcardData {
  starId: number;
  starIdBinary: string;
  name: string;
  claimedAt: string;
  expiresAt: string;
  isGift: boolean;
  giftFrom?: string;
  occasion?: string;
}

export async function generatePostcard(data: PostcardData): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d")!;

  // Background: deep space
  const bg = ctx.createLinearGradient(0, 0, 1200, 630);
  bg.addColorStop(0, "#02050f");
  bg.addColorStop(0.5, "#060d1a");
  bg.addColorStop(1, "#020408");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1200, 630);

  // Subtle star field
  for (let i = 0; i < 200; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * 1200,
      Math.random() * 630,
      Math.random() * 1.2,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = `rgba(255,255,255,${0.1 + Math.random() * 0.4})`;
    ctx.fill();
  }

  // Gold accent line
  ctx.strokeStyle = "#c8a84b";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 150);
  ctx.lineTo(500, 150);
  ctx.stroke();

  // Binary Star ID (hero element)
  ctx.font = 'bold 52px "DM Mono", monospace';
  ctx.fillStyle = "#c8a84b";
  ctx.fillText(data.starIdBinary, 80, 130);

  // Main label
  ctx.font = '18px "DM Mono", monospace';
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillText("VIRTUAL MILKY WAY REGISTRY", 80, 80);

  // Star name or gift text
  if (data.isGift && data.giftFrom && data.occasion) {
    ctx.font = 'bold 42px "DM Sans", sans-serif';
    ctx.fillStyle = "#ffffff";
    ctx.fillText(data.name, 80, 240);

    ctx.font = '22px "DM Sans", sans-serif';
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText(`gifted by ${data.giftFrom}`, 80, 290);
    ctx.fillText(`to celebrate ${data.occasion}`, 80, 325);
  } else {
    ctx.font = 'bold 42px "DM Sans", sans-serif';
    ctx.fillStyle = "#ffffff";
    ctx.fillText(data.name, 80, 240);

    ctx.font = '22px "DM Sans", sans-serif';
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText("has claimed this star", 80, 290);
  }

  // Expiry
  ctx.font = '16px "DM Mono", monospace';
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillText(
    `Active until ${new Date(data.expiresAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    80,
    390,
  );

  // Portfolio URL watermark
  ctx.font = '14px "DM Mono", monospace';
  ctx.fillStyle = "rgba(200,168,75,0.5)";
  ctx.fillText("ashwingupta.dev/cosmos", 80, 580);

  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob!), "image/png"),
  );
}

export async function shareOrDownloadPostcard(
  blob: Blob,
  starIdBinary: string,
) {
  const file = new File([blob], `star-${starIdBinary}.png`, {
    type: "image/png",
  });

  // Mobile: Web Share API with file
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      title: `My star in the Virtual Milky Way`,
      text: `I named star ${starIdBinary} in the Virtual Milky Way Registry`,
      files: [file],
    });
    return;
  }

  // Desktop: download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `star-${starIdBinary}.png`;
  a.click();
  URL.revokeObjectURL(url);
}
```

---

## 12. Gift Flow

Gift is a mode toggle in the claim modal.

### UI States

**Self mode (default):**

```
Star Name: [____________]
           ✓ "Nova" is available

[Claim My Star]
```

**Gift mode:**

```
Star Name (for whom / occasion):  [____________]
Your Name (gift_from, private):   [____________]
Occasion:                         [____________]
                                  e.g. "our anniversary"

[Gift This Star]
```

### Postcard distinction

```
Self:    "Nova has claimed star 011101000101100"
Gift:    "Ashwin gifts you star 011101000101100 to celebrate our anniversary"
```

`gift_from` is stored in DB but **never returned in any public API response**.

### localStorage State

```ts
interface ClaimedStar {
  star_id: number;
  star_id_binary: string;
  name: string;
  claimed_at: string;
  expires_at: string;
  is_gift: boolean;
}

// Store on successful claim
localStorage.setItem("virtual_cosmos_star", JSON.stringify(claimedStar));

// On revisit: restore state, show "Your star" widget in galaxy section
```

---

## 13. Global Scale & Robustness

### Traffic Model

Assume a viral postcard sharing event drives 50,000 unique visitors in 24 hours.

| Endpoint                         | Traffic      | Strategy                                               |
| -------------------------------- | ------------ | ------------------------------------------------------ |
| Homepage (static)                | 50k req/24h  | CDN edge cache, no origin hits                         |
| Galaxy JS bundle                 | 50k req/24h  | Immutable cache header, CDN                            |
| `/api/vmwr`                      | 200k req/24h | Vercel KV cache, TTL 30s → max 2,880 Supabase hits/24h |
| `/api/check-name`                | 500k req/24h | KV rate limit (1/sec/IP), indexed DB query             |
| `/api/request-eligibility-token` | 5k req/24h   | KV rate limit (1/IP/24h)                               |
| `/api/claim-star`                | 1k req/24h   | Fully validated, atomic DB write                       |

**Supabase hit rate at peak: ~3,000 queries/24h** — trivial even on free tier.

### VMWR Cache Strategy

```ts
// api/vmwr.ts
const KV_KEY = "vmwr:active:p{page}";
const KV_TTL = 30; // seconds

export async function getVMWR(page: number, perPage: number) {
  const kv = getKV();
  const cacheKey = `vmwr:active:p${page}:pp${perPage}`;

  // Serve from cache
  const cached = await kv.get(cacheKey, "json");
  if (cached) return cached;

  // Cache miss: query Supabase
  const { data } = await supabase
    .from("stars")
    .select("star_id, name, occasion, claimed_at, expires_at")
    .gt("expires_at", new Date().toISOString())
    .order("claimed_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  const result = {
    stars: data?.map((s) => ({
      ...s,
      star_id_binary: s.star_id.toString(2).padStart(15, "0"),
      days_remaining: Math.ceil(
        (new Date(s.expires_at).getTime() - Date.now()) / 86_400_000,
      ),
    })),
  };

  // Cache result
  await kv.set(cacheKey, JSON.stringify(result), { ex: KV_TTL });
  return result;
}

// Invalidate VMWR cache on every successful claim
export async function invalidateVMWRCache() {
  const kv = getKV();
  // Pattern delete all VMWR keys (Vercel KV supports scan)
  const keys = await kv.keys("vmwr:active:*");
  await Promise.all(keys.map((k) => kv.del(k)));
}
```

### Star Pool Exhaustion

If all 32,768 stars are simultaneously active (extremely unlikely but theoretically possible):

```ts
// api/claim-star.ts — after 'pool_exhausted' error from DB
const { data: nextExpiry } = await supabase
  .from("stars")
  .select("expires_at")
  .gt("expires_at", new Date().toISOString())
  .order("expires_at", { ascending: true })
  .limit(1)
  .single();

return Response.json(
  {
    error: "pool_exhausted",
    message: "All stars are currently named. Check back soon.",
    next_available: nextExpiry?.expires_at,
  },
  { status: 503 },
);
```

UI shows: "All 32,768 stars are named — a star becomes available on [date]."

### Graceful Degradation

If Supabase is unavailable:

- VMWR shows last cached version from Vercel KV.
- Claim flow shows: "Star naming is temporarily unavailable. Your eligibility is saved — try again shortly."
- Galaxy renderer continues to function (pure client-side).

### Vercel Configuration

```json
// vercel.json additions
{
  "headers": [
    {
      "source": "/cosmos",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, s-maxage=30, stale-while-revalidate=60"
        }
      ]
    },
    {
      "source": "/api/vmwr",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, s-maxage=30, stale-while-revalidate=60"
        }
      ]
    },
    {
      "source": "/api/claim-star",
      "headers": [{ "key": "Cache-Control", "value": "no-store" }]
    }
  ],
  "functions": {
    "src/api/claim-star.ts": { "runtime": "edge" },
    "src/api/request-eligibility-token.ts": { "runtime": "edge" },
    "src/api/vmwr.ts": { "runtime": "edge" },
    "src/api/check-name.ts": { "runtime": "edge" }
  }
}
```

### Database Robustness

- **PgBouncer pooler** always (never direct connection from edge functions).
- **Read replica** (Supabase Pro): VMWR queries route to read replica, claim writes to primary.
- **pg_cron** (Supabase built-in): daily job to vacuum expired star entries and refresh materialized stats.
- **Connection limit**: Edge Functions use `?connection_limit=1&pool_timeout=0` in connection string. Each invocation gets one pooled connection, released immediately.

```sql
-- pg_cron: daily cleanup + stats refresh (runs at 00:00 UTC)
SELECT cron.schedule('cleanup-expired-stars', '0 0 * * *', $$
  -- Nothing to delete (soft archive via trigger), just analyze for query planner
  ANALYZE stars;
  ANALYZE star_history;
$$);
```

---

## 14. Performance Budget

| Metric                         | Budget                        | Strategy                                      |
| ------------------------------ | ----------------------------- | --------------------------------------------- |
| LCP (Largest Contentful Paint) | < 2.5s                        | Galaxy lazy-loads, not in LCP path            |
| FID / INP                      | < 100ms                       | Galaxy init in Web Worker                     |
| CLS                            | 0                             | Galaxy section has fixed height               |
| Three.js bundle                | < 180KB gzipped               | Code-split, loaded only for `/cosmos` section |
| Galaxy init time               | < 300ms after section visible | Web Worker + GPU upload                       |
| Star positions memory          | < 2MB GPU                     | Float32Arrays, no per-frame allocation        |
| VMWR first load                | < 1s                          | Edge cache, 30s TTL                           |
| Claim flow end-to-end          | < 2s                          | Edge Functions + pooled DB                    |

### Bundle Splitting Strategy

```ts
// Three.js is ~580KB min, ~170KB gzip
// Split it completely from main bundle

// In VirtualCosmos.tsx
const initGalaxy = async (container: HTMLDivElement) => {
  // This entire import tree (Three.js + galaxy code) is a separate chunk
  const { GalaxyRenderer } = await import(
    /* webpackChunkName: "galaxy" */
    "../lib/galaxy/GalaxyRenderer"
  );
  return new GalaxyRenderer(container);
};
```

---

## 15. Implementation Phases

### Phase 1: Galaxy Renderer (Standalone, No Backend)

**Deliverable**: WebGL galaxy renders in portfolio, 60fps, lazy loaded.

Steps:

1. `pnpm add three @types/three`
2. Create `src/lib/galaxy/` directory.
3. Implement `galaxy-gen.worker.ts` — star position generation.
4. Implement `GalaxyRenderer.ts` — Three.js setup, vertex/fragment shaders, animation loop.
5. Implement `StarPicker.ts` — raycaster with RAF throttle.
6. Create `VirtualCosmos.tsx` section component — lazy init via IntersectionObserver.
7. Add `VirtualCosmos` to `App.tsx` between appropriate sections.
8. **Verify**: 60fps on desktop Chrome + mobile Safari. No LCP regression. No layout shift.

---

### Phase 2: Eligibility Tracker

**Deliverable**: All three criteria tracked; `onEligible` fires correctly.

Steps:

1. Implement `src/lib/eligibility/tracker.ts` (full code above).
2. Add `data-track` attributes to `Projects.tsx`, `Research.tsx`, `Featured.tsx`, `ExperienceTimeline.tsx`.
3. Wire `EligibilityTracker` into `App.tsx` — start on mount.
4. Add "Earn your star" CTA to galaxy section — visible before eligible, "You've earned a star" badge after.
5. **Verify**: Manually trigger all three conditions in order. Badge appears. DevTools: check all three flags flip correctly. Verify tab-hidden time does not count.

---

### Phase 3: Supabase Setup

**Deliverable**: Database live, seeded, RLS locked down.

Steps:

1. Create Supabase project (see [Section 16](#16-required-credentials--integrations)).
2. Run schema SQL (Section 8.1).
3. Run seed script (Section 8.2) — creates all 32,768 rows.
4. Enable RLS, apply policies (Section 7.2).
5. Create `claim_star` Postgres function (Section 8.3).
6. Configure pg_cron daily job.
7. Verify pooler URL accessible from Vercel.
8. **Verify**: Manual `SELECT` from anon key returns empty (no active stars). `INSERT` via service role creates a star. Duplicate name insert raises correct exception.

---

### Phase 4: Vercel Edge Functions + KV

**Deliverable**: All four API endpoints live, rate-limited, validated.

Steps:

1. Enable Vercel KV in project (see Section 16).
2. Install deps: `pnpm add jose @arcjet/next @vercel/kv`.
3. Create `src/api/` directory.
4. Implement `request-eligibility-token.ts` — behavioral scoring, KV rate limit, JWT sign.
5. Implement `claim-star.ts` — Arcjet + Turnstile + JWT verify + nonce consume + DB call.
6. Implement `vmwr.ts` — KV cache + paginated Supabase query.
7. Implement `check-name.ts` — KV rate limit + DB uniqueness check.
8. Update `vercel.json` with edge runtime declarations.
9. **Verify**: Hit each endpoint with curl. Check rate limits fire correctly. Check bot-risk scoring with fake payload values. Verify nonce cannot be reused.

---

### Phase 5: Claim Modal + Star Flow

**Deliverable**: End-to-end claim flow works in browser.

Steps:

1. Implement `ClaimModal.tsx` — name input, live uniqueness check (debounced 500ms), self/gift toggle, gift fields.
2. Implement Turnstile widget integration (client-side JS snippet + server validation).
3. Implement `useClaim` hook — orchestrates: get eligibility token → show Turnstile → submit claim → store in localStorage.
4. On success: show star ID (binary), name, expiry, postcard button.
5. Named star immediately glows gold in galaxy view.
6. "Your Star" widget: on revisit, reads localStorage, shows stored star, warns if expired.
7. **Verify**: Full flow end-to-end in dev. Try duplicate name → 409 handled gracefully. Try expired token → correct error. Try bot risk > 60 → 403. Postcard downloads correctly.

---

### Phase 6: VMWR Page

**Deliverable**: `/cosmos` page fully functional.

Steps:

1. Create Astro page `src/pages/cosmos.astro`.
2. Create `VMWR.tsx` React component — table + search + sort + pagination.
3. Integrate galaxy view on VMWR page — same `GalaxyRenderer`, load named star IDs from VMWR API, update `isNamed` buffer attribute.
4. Add `/cosmos` to `vercel.json` rewrites.
5. Add nav link to cosmos page.
6. Implement Hall of Fame tab (query `star_history`).
7. **Verify**: VMWR loads within 1s. Search works. Named stars glow in galaxy view. Hover tooltip shows name.

---

### Phase 7: Postcard Generation + Gift Flow

**Deliverable**: Postcard generates correctly for self + gift. Share works on mobile.

Steps:

1. Implement `src/lib/postcard/generate.ts` (full code in Section 11).
2. Load portfolio fonts (DM Mono, DM Sans) into Canvas using `FontFace` API.
3. Implement gift mode in `ClaimModal.tsx` — toggle and additional fields.
4. Test postcard on both desktop (download) and mobile (Web Share API).
5. Verify gift postcard wording is correct.
6. Verify `gift_from` never appears in VMWR API response.
7. **Verify**: Download postcard on Chrome desktop. Share on iOS Safari. Check all text renders with correct fonts. Check expiry date format is correct.

---

### Phase 8: Robustness + Load Testing

**Deliverable**: System handles 50k concurrent users without degradation.

Steps:

1. Enable Vercel Pro (or ensure project is on correct plan for Edge Functions).
2. Upgrade Supabase to Pro — enable read replica.
3. Configure Arcjet production key.
4. Configure Cloudflare Turnstile production keys.
5. Load test `/api/vmwr` with k6 or Artillery: 1000 req/sec for 60 seconds. Verify KV cache absorbs load.
6. Load test `/api/check-name`: 100 req/sec. Verify rate limiting fires correctly.
7. Simulate pool exhaustion: set all 32,768 stars to active, attempt claim → verify graceful 503 response.
8. Simulate Supabase outage: verify VMWR serves stale KV cache, claim returns helpful error.
9. Run Lighthouse audit: verify LCP, INP, CLS all within budget.
10. **Verify**: k6 report shows < 200ms p95 on VMWR. Zero 5xx under normal load. Galaxy section scores 60fps on mid-range Android.

---

## 16. Required Credentials & Integrations

> **ACTION REQUIRED** — The following accounts, keys, and configurations must be set up before Phase 3 onwards can be implemented. Each item specifies exactly what is needed.

---

### 16.1 Supabase Project

**What to do:**

1. Go to [supabase.com](https://supabase.com) → New Project.
2. Region: choose closest to Vercel deployment region (likely `us-east-1`).
3. Note the following (needed in Vercel env vars):

| Env Var                     | Where to find                                                           | Notes                                          |
| --------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------- |
| `SUPABASE_URL`              | Project Settings → API → Project URL                                    | `https://xxx.supabase.co`                      |
| `SUPABASE_ANON_KEY`         | Project Settings → API → anon/public                                    | Used in browser for VMWR reads only            |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → service_role                                   | **Server-side only. Never expose to browser.** |
| `SUPABASE_POOLER_URL`       | Project Settings → Database → Connection Pooling → Transaction mode URI | Use this for all Edge Function DB connections  |

**Recommended plan**: Start on Free tier for development. Upgrade to **Pro ($25/mo)** before launch for:

- Read replica (VMWR performance)
- 7-day PITR (disaster recovery)
- No connection limits on pooler
- Dedicated compute (no cold starts)

---

### 16.2 Vercel KV (Redis)

**What to do:**

1. In Vercel dashboard → Storage → Create KV Database.
2. Name: `virtual-cosmos-kv`.
3. Region: `iad1` (US East) or closest to Supabase region.
4. Connect to project → Vercel auto-injects these env vars:

| Env Var                       | Auto-injected by Vercel | Notes                        |
| ----------------------------- | ----------------------- | ---------------------------- |
| `KV_REST_API_URL`             | Yes                     | Used by `@vercel/kv` client  |
| `KV_REST_API_TOKEN`           | Yes                     | Used by `@vercel/kv` client  |
| `KV_REST_API_READ_ONLY_TOKEN` | Yes                     | Not needed for this use case |

**Plan**: Free tier (30k commands/day) sufficient for development. Monitor in production — upgrade to Pro KV ($20/mo) if command count exceeds limit during traffic spikes.

---

### 16.3 Arcjet

**What to do:**

1. Go to [arcjet.com](https://arcjet.com) → Sign up → New Site.
2. Add site domain: `ashwingupta.dev` (or your portfolio domain).
3. Note:

| Env Var      | Where to find                     |
| ------------ | --------------------------------- |
| `ARCJET_KEY` | Arcjet dashboard → Site → API Key |

**Plan**: Free tier (10k requests/month). Upgrade to Pro if traffic exceeds this.

**Install**: `pnpm add @arcjet/next`

---

### 16.4 Cloudflare Turnstile

**What to do:**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Turnstile → Add widget.
2. Widget type: **Invisible** (no user friction).
3. Allowed hostnames: add `ashwingupta.dev` and `localhost`.
4. Note:

| Env Var                          | Where to find             | Used in                   |
| -------------------------------- | ------------------------- | ------------------------- |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile widget settings | Browser (client-side)     |
| `TURNSTILE_SECRET_KEY`           | Turnstile widget settings | Vercel Edge Function only |

**Cost**: Free, unlimited.

---

### 16.5 JWT Secret

**What to do:**
Generate a cryptographically random 32-byte secret and add to Vercel env vars:

```bash
# Generate in terminal
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

| Env Var            | Value                   |
| ------------------ | ----------------------- |
| `CLAIM_JWT_SECRET` | Output of above command |

---

### 16.6 Vercel Project Settings

**What to configure:**

1. Vercel Dashboard → Project → Settings → Functions → Edge Runtime: ensure enabled.
2. Environment Variables: add all vars from 16.1–16.5 to Production + Preview environments.
3. Framework Preset: **Astro** (should be auto-detected).
4. Build Command: `astro build` (already in `package.json`).

**Vercel Plan requirement:**

- **Free (Hobby)**: Edge Functions limited, no SLA. Acceptable for early launch.
- **Pro ($20/mo)**: Required for: custom domains with advanced certs, 100GB bandwidth, higher Edge Function limits. **Recommended for production launch.**

---

### 16.7 New Dependencies to Install

```bash
pnpm add three @types/three
pnpm add @supabase/supabase-js
pnpm add @vercel/kv
pnpm add jose
pnpm add @arcjet/next
```

---

### 16.8 Domain / DNS

If using a custom subdomain for the VMWR (`cosmos.ashwingupta.dev`):

1. Add CNAME in DNS provider → `cname.vercel-dns.com`.
2. Add domain alias in Vercel project settings.

Alternatively, VMWR lives at `ashwingupta.dev/cosmos` (simpler, no DNS change needed — just add to vercel.json rewrites).

---

### 16.9 Monitoring

**Recommended (optional but valuable for production):**

| Tool                  | Purpose                                      | Cost                     |
| --------------------- | -------------------------------------------- | ------------------------ |
| Vercel Analytics      | Already installed (`@vercel/analytics`)      | Free                     |
| Vercel Speed Insights | Already installed (`@vercel/speed-insights`) | Free                     |
| Supabase Dashboard    | DB query performance, slow query log         | Included                 |
| Sentry                | Error tracking for Edge Functions            | Free tier (5k errors/mo) |

Sentry setup (optional):

```bash
pnpm add @sentry/nextjs
```

| Env Var      | Source                  |
| ------------ | ----------------------- |
| `SENTRY_DSN` | Sentry project settings |

---

## 17. Open Decisions

These require your input before implementation or have non-obvious tradeoffs:

### OD-01: Star ID Range

- **Option A**: 0–32767 (15-bit binary: `000000000000000` – `111111111111111`). Clean.
- **Option B**: 1–32768 (1 to 2^15 as stated). Last ID = `1000000000000000` (16 digits). Breaks the "15-char postcard" aesthetic.
- **Recommendation**: Option A. The binary ID is a visual motif — 15 consistent digits looks better on the postcard. Mention "0-indexed from the galactic origin" in copy if asked.
  ANS: Recommendation accepted, proceed.

### OD-02: Name Expiry + Reuse

- When "Nova" expires after 90 days, can a new visitor claim "Nova"?
- **Recommendation**: Yes — names return to pool. This is stated in the spec and makes the registry feel alive. The partial index handles this correctly.
  ANS: Recommendation accepted, proceed.

### OD-03: Email Collection (Optional)

- Currently: no email collected. No expiry notification possible.
- **Option**: Add optional email field at claim time. Send expiry reminder at day 80.
- Requires: email service (Resend.com — free 3k emails/month), email column in stars table, edge function for scheduled send.
- **Recommendation**: Add in Phase 9 post-launch if demand exists. Don't build now.
  ANS: Recommendation accepted, proceed.

### OD-04: Mobile Eligibility (Touch Devices)

- "Full scroll" on mobile is harder to fake but also harder for IntersectionObserver to detect cleanly.
- Mouse entropy score is irrelevant on touch devices (no `mousemove` events).
- Replace mouse entropy with **touch event entropy** on mobile: track `touchmove` velocity variance instead.
- Need to detect `navigator.maxTouchPoints > 0` and swap scoring method.
  ANS: Recommendation accepted, proceed.

### OD-05: Galaxy Section Placement

- Where in the homepage does the Virtual Cosmos section appear?
- Current sections: Hero → About → Skills → Experience → Featured → Research → Projects → Contact.
- **Recommendation**: Place between Research and Projects (mid-page). Visitor who has scrolled to Research has already seen ~70% of content. Galaxy section acts as a visual palate cleanser and reward signal before final sections.

  ANS: intro to galaxy and eligibility are shown to the use in of 2 cases -

* User just opened the site, small welcome screen overwriting main website displays cosmos details with proceed to site appearing post 30s of welcome screen, use this 30s to setup everything on the main site and the galaxy located at /VirCos
* User completed all eligible criteria and is at contact section, pop up card currently says 'Somewhere between the hero and here, you decided to keep going. Thank you for taking the time to know me a little more than you already did. Want to check out my articles next? Read them here.' add second option to visit galaxy as viewer/claimer
  OR
* Display the criteria failed and ask if user wants to revisit and complete criteria or end his session and close website. Redirect as per user input

### OD-06: Star Selection — Random vs. User-Chosen

- Currently: random assignment from available pool.
- Alternative: show visitor a small preview of 5 random available stars in the galaxy, let them pick one.
- Adds delight but increases complexity (temporary reservation needed to prevent race condition on "picked but not yet claimed" state).
- **Recommendation**: Random for Phase 1. Add "pick your region of the galaxy" in a future phase.
  ANS: Fully random until further information provided by me (Ashwin)

### OD-07: VMWR Privacy Disclosure

- VMWR is a public registry. Names entered are publicly visible for 90 days.
- Must show clear disclosure before claim: "The name you enter will be publicly visible in the Virtual Milky Way Registry for 90 days."
- **Legal note**: Do not collect PII. Star names should be pseudonyms/occasion names, not real full names. Add this to the claim modal copy.
  ANS: Recommend only, do not flag or force random names, legal matters can possibly be handled by saying, we told the user not to reveal PII, he didn't listen

### OD-08: Supabase Region

- Choose Supabase project region matching Vercel deployment region.
- Vercel defaults to `us-east-1` (iad1). Supabase equivalent: `us-east-1`.
- Latency between Vercel Edge Function and Supabase matters for claim endpoint. Same region = ~1ms. Cross-region = 50–150ms.
  ANS: will take care

---

_Last updated: 2026-05-30_  
_Author: Ashwin Gupta_
