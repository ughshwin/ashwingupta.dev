# Design Thinking Document — ashwingupta.dev

---

## The Central Thesis

This portfolio has one argument to make before a single word of copy is read: **the person who built this thinks differently**. Every design decision is downstream of that single intent. The cosmos isn't decoration. It's the most honest metaphor available for the kind of work being done — distributed, non-obvious, requiring perceptual patience.

The site doesn't ask the visitor to read about Ashwin's abilities. It demonstrates them.

---

## 1. The Background — `AIBackground.tsx`

### What it is

A full-viewport `canvas` element rendering three simultaneous visual systems: a **neural network graph** (nodes + edges + travelling packets), **floating particles** (small bouncing dots), and **dust motes** (600 slowly-drifting specks of light with breeze-path motion and mouse repulsion).

### Why it exists

The AI field has a visual vocabulary problem. Most engineer portfolios represent "AI" with a gradient or a stock photo of a chip. This background renders the actual structural metaphor: a **living graph where information travels between nodes**. Packets move between nodes; arrival activates the node; edges brighten. It's an abstraction of an inference pipeline, a RAG system, a distributed workload — which is exactly what the person builds.

The dust motes are the cosmos layer. At low opacity, they read as stars — a field of ambient light that signals depth, scale, and that there is more world beyond the screen's edge. Editorial spaces do this with photography and texture. This does it with engineered motion.

### How it enhances UX

- The background is **never competing for attention** — it lives at opacity levels so low (nodes at 0.05–0.18 alpha, dust motes at 0.07–0.22) that the content in front always wins.
- **Mouse interaction** matters critically: nodes near the cursor repel gently, and dust motes spring away then decay back. This makes the environment feel responsive rather than decorative — you are _inside_ something, not _looking at_ something. The spell of immersion holds.
- **Tab visibility guard**: RAF pauses when the tab is hidden. This is an invisible detail with real consequence — it signals professional-grade performance thinking, and it means the animation state is always fresh when the user returns.
- The **scanlines** (every 4px, pre-rendered to an offscreen canvas, drawn once per frame via `drawImage`) simulate the phosphor persistence of a CRT monitor — a trace of the control room aesthetic, the HUD aesthetic, the sense that what's being observed is _live telemetry_ not a static page.
- The **grid** (50px cells, slowly scrolling at 0.02px/frame) is almost invisible but creates orthographic structure. It grounds the floating nodes in a coordinate system, echoing architecture diagrams and system design docs.

### Significance in the larger picture

The background isn't a style choice — it's the first page of the argument. A visitor who lands and feels like they've entered an operational environment is already primed to read about inference routing and concurrency systems as things that _feel right_ here. The aesthetic and the content are not in two separate registers.

---

## 2. The Custom Cursor — `Cursor.tsx`

### What it is

The native OS cursor is replaced entirely with an SVG rendering of the **International Space Station**. On hover over interactive elements, the ISS dish fires five staggered arcs upward — the signal-emission animation.

### Why the ISS specifically

Three reasons converge:

1. **The cosmos theme demands it.** A plain circle cursor would be technically custom but thematically inert. The ISS is the most recognisable human-built object in space — it belongs in this environment.

2. **The ISS is a system.** It has a truss, solar panel arrays, communication dishes, module stubs. It's a visual metaphor for a complex, multi-component, carefully engineered structure that does one thing extremely well under harsh constraints. That's AI systems architecture.

3. **The hover state tells a story.** When the cursor rests on a button or link, the ISS dish emits arcs — five of them, 0.36s staggered so two are always mid-travel. The dish is communicating. The signal is going out. It transforms a routine UI affordance (hover feedback) into something that feels like a micro-narrative.

### How it enhances UX

- **lerp animation at 0.4 factor** (40% of the gap per frame): the cursor trails the pointer with physical weight. This is one of the most powerful UX micro-details — it makes movement feel like it has mass. Visitors don't consciously notice it, but the site _feels smoother_ because of it.
- **`translate3d` with `willChange: transform`**: the cursor wrapper never triggers paint or layout. It's on its own compositor layer — cursor movement is pure GPU.
- **`cursor: none !important` injected globally**: the native cursor is eliminated at the stylesheet level, not just `body`. This is a subtle correctness fix — without it, the native cursor bleeds through in iframes, shadow DOM, or CSS-driven cursor overrides.
- **`isClickable()` walks the DOM tree**: because `getComputedStyle` can't detect cursor intent after the `!important` injection, the code walks ancestors checking for semantic elements and `element.style.cursor === "pointer"` (inline styles, immune to stylesheet injection). This is careful defensive engineering.
- **Disappears when mouse leaves viewport**: opacity 0 on `document.mouseleave`. Small touch. Prevents the orphaned cursor glitch.

### Significance

The cursor is the most personal element on the site. Nobody accidentally builds an ISS cursor. It signals a specific kind of person — one who thinks about their tools as expressive surfaces, not just functional ones.

---

## 3. Scroll Damping — `App.tsx`

### What it is

The `.hologram-interface` div intercepts `wheel` events and drives scroll position through a **10% lerp per frame** (`el.scrollTop += diff * 0.1`), rAF-driven. The native scroll is suppressed.

### Why it exists

Browsers default to immediate scroll response on high-precision mice and trackpads, and momentum-scroll on touch. Neither of these fits the atmosphere of this site. Immediate scroll makes animated content feel abrupt — the Experience Timeline's comet, the parallax layers, the sticky transitions — all of them depend on smooth, continuous scroll position to look correct.

The dampening creates the sensation of **moving through space rather than flipping pages**. It's the same UX principle used in cinematic UI demos: when the world moves at the speed of intent rather than the speed of input, it reads as a richer environment.

### How it enhances UX

- `target` is updated by every `wheel` event, but only one rAF loop runs at a time — scroll input is batched, not one-rAF-per-event.
- When idle (`!rafId`), `target` re-syncs from `el.scrollTop` — this is the "stale target" fix: instant nav jumps (hash navigation, section links) don't get fought by the lerp loop.
- `__portfolioScrollTop` is exposed on `window` — the scroll-to-top button and section navigation use this so animated scroll and damped scroll are the same system.
- Touch devices use native scroll (which already has momentum physics) — the damping is **desktop-only**.

### Significance

This is the detail the article refers to as "three refactors to get right." It's invisible until absent. A site that scrolls at native speed through this content would feel like a PowerPoint. The damping is what makes it feel like something you're navigating rather than consuming.

---

## 4. The Hero Section — `Hero.tsx`

### Layout logic

Two-column grid (single on mobile): large editorial typography left, profile photo right. The left column has three independently animated layers (`layerText`, `layerPhoto`, `layerPills`) that parallax against each other on mouse movement.

### The name reveal animation

`Ashwin` and `Gupta` each slide up from `y: "105%"` with a delay offset (0.5s and 0.65s) using the easing `[0.76, 0, 0.24, 1]` — a strong ease-in cubic bezier. This is an editorial lift: the name arrives with authority rather than fading in. The `overflow: hidden` wrapper clips the slide, so the text appears to emerge from below a baseline. It's a typographic entrance used in high-end magazine digital editions.

### Why the eyebrow line precedes the name

"Not what a model outputs — how the system decides, executes, and holds under load." This runs before the name because it frames who this person is _before_ the name makes them Google-able. It reorders the cognitive sequence: understand what they do → learn who they are. This is intentional. The name in giant type would otherwise be the first thing to land, and the visitor would context-switch to LinkedIn before reading the qualifier.

### The 3D photo tilt

On mouse move, the photo layer gets `perspective(1000px) rotateY(Xdeg) rotateX(-Ydeg) translate(px, py)`. The text layer moves ±8px max (shallow), the pills move ±14px (deeper), the photo gets full 3D perspective. The three layers moving at different rates creates **depth of field** — the brain parses the scene as three-dimensional.

On `mouseleave`, transform resets with `cubic-bezier(0.23,1,0.32,1)` — an elastic ease that bounces the layers back to neutral. The transition is deliberately slower (0.9s) than the tracking (0.08s), so the layers float back rather than snap.

### The status pill at the bottom

`Optimising: Residuals • Not: Roles` with a pulsing red dot. The dot pulses (`animation: pulse 2s infinite`). This is a status indicator — the visual language of a "live" or "recording" indicator. The message is a positioning statement, but the visual says: _this is not a static bio, this is a live readout_.

### The navigation bar

All links placed at equal intervals in a CSS grid — deliberate geometric equality, not left-heavy. Each link hover activates an `rgba` gradient that rises from the bottom (like light bouncing off a surface). The nav is present but barely legible at rest (35% opacity). It surfaces on approach. The **Work** dropdown has a 140ms close-delay timer — enough that a cursor moving from "Work" to the dropdown doesn't accidentally dismiss it.

---

## 5. About Section — `About.tsx`

### The highlights marquee

"The Gold and the Glory" — a horizontal ticker running the significant career highlights at 45s loop. Two sets duplicated seamlessly for infinite scroll. This is a newspaper-style ticker, a stock-feed style, a real-time broadcast style. Awards and metrics that would be lost in a list are instead always visible, always moving — they can't be skipped because they're ambient.

The gold colour (`#f5ca40`) is the only warm accent in an otherwise cool, achromatic palette. It calls attention precisely because nothing else uses it.

### The three pillars

Inference as a System / Execution Under Constraints / Physics-Informed Scientific ML — these aren't skills, they're **worldviews**. Each card has a tiny 5px white dot as a bullet, a serif title, and body text at near-reading-weight opacity. The cards use `border: 1px solid rgba(255,255,255,0.11)` and near-transparent backgrounds — they're present but not loud. They frame the right column as the intellectual architecture, contrasting the left column's narrative.

### "What I Don't Do"

This box is deliberately lower contrast than the pillars. The negative space it creates — lines like "I don't ship AI wrappers dressed as products" — is as much a positioning signal as any achievement listed. In a sea of portfolios that say "I can build anything," specificity about what you refuse to do is extremely rare and very persuasive.

---

## 6. Experience Timeline — `ExperienceTimeline.tsx`

### What it is

A custom Gantt-style timeline rendered as a scroll-driven sticky section. The section occupies `vpH + maxOffset` pixels of scroll space but is always exactly one viewport tall — the extra scroll space drives an internal `chartOffset` that translates the chart upward. A white "spine" runs down the centre; a comet head and particle trail follow the scroll position.

### Why this format instead of a list

A list orders experience chronologically and forces the reader to reconstruct the timeline mentally. A Gantt chart **shows time passing** — you can see where roles overlapped, how long each lasted, how the density of activity changed. The professional track runs right of the spine; education runs left. The visual separation of tracks makes the parallel life visible: studying while working, multiple roles overlapping.

### The comet animation

The spine is a 1px white vertical line, cut into segments so year labels appear to interrupt it. As you scroll, the portion from the top to the current scroll position becomes brighter white (`opacity: 0.9`) — the spine "paints" downward as you travel through time.

At the leading edge: a 9px white circle (the comet head). On scroll, particle emission fires: white dots spawn at the spine with velocity in the scroll direction, then decay with exponential drag (`tailVelRef *= Math.pow(0.001, dt)` → ~50% remaining after 0.1s). The effect is a comet trailing as the spine writes itself into existence.

Why: time travel through a career should feel like motion. The comet is the metaphor made literal. You are moving through someone's history.

### The colour-coded projection strips

Each entry has a unique colour (`bmsce: #6fa3ff`, `coforge: #2ed4c8`, etc.). A 2px wide strip runs the full duration of the entry adjacent to the spine — proportional to months, time-accurate. These projection strips let the eye read duration and overlap at a glance before reading a single word of the card.

### Card placement algorithm

Cards are not randomly placed — `cardCenterY()` finds the **largest free sub-range** of the strip (the period when no other card from a sibling lane overlaps) and centres the card there. This prevents cards from clobbering each other while remaining time-accurate. On mobile, expanded cards push siblings below them downward with a `transition: top 0.45s cubic-bezier(0.76,0,0.24,1)` — the push is animated, not a jump.

---

## 7. Bottom-Right HUD — `BottomRightHUD.tsx`

Three widgets clustered in the bottom-right corner.

### Session Timer

Shows how long the visitor has been on the site. `sessionStorage`-persisted so page navigations don't reset it — the timer counts the whole visit, not just the current page.

**Why**: it turns a passive metric (time on site) into a visible, shared artifact. The visitor sees their own engagement. A visitor who has been browsing for 8 minutes is reminded of that investment — a gentle psychological anchor. It also says: this site is worth staying on long enough for the timer to matter.

### Explored Compass

Tracks `__portfolio_explored_v2` in `localStorage`: a map of `pathname → scroll depth`. A page counts as explored when the user has scrolled 100% of it. The filled percentage drives both the stroke offset of the SVG ring and the fill colour via `EXPLORED_COLOR_STOPS` — from red at 0%, through yellow, to blue at 60%, to green at 100%.

**Why**: it gamifies the site visit. There are 17 tracked pages. The visitor can see how much they've seen. The colour progression from red (cold) to green (fully explored) is an immediate visual language for progress that needs no legend. A visitor at 30% may feel the pull to see what the rest contains.

### Scroll-to-Top Button

Appears when the user has scrolled more than 60% of a viewport. The button carries its own SVG progress ring showing scroll position within the current page — so the button itself is live telemetry, not just a utility.

**Why**: in a single-page app with damped scroll and long sticky sections, "scroll back to top" can feel expensive. The progress ring on the button gives the user a sense of where they are, and the button's appearance is a depth cue — you are deep into the page.

---

## 8. Clock Widget — `ClockWidget.tsx`

Always shows `BLR` (Bangalore, IST). If the visitor is not in Bangalore, a second row appears with their nearest airport code and local time, resolved via `navigator.geolocation` and a haversine-distance match against 100+ airports.

**Why two clocks**: the site is built in Bangalore. Its author works in IST. Showing BLR is a locational identity marker. Showing the visitor's location is context-aware hospitality — "I see you, wherever you are." The dual-clock format is borrowed from global newsrooms and trading floors, environments where time difference is professionally relevant. It quietly signals: this work operates across timezones.

**Why airport codes**: IATA codes are more compact and more expressive than city names. `JFK`, `LHR`, `SIN` carry their own weight. They belong to the same visual vocabulary as the rest of the HUD — monospaced, uppercase, abbreviated, functional.

---

## 9. The Scroll-Complete Thank You — `App.tsx`

When the visitor reaches 98% scroll depth, the content blurs (`blur(4px) brightness(0.7)`) and a frosted-glass modal appears. Message: _"Somewhere between the hero and here, you decided to keep going. Thank you for taking the time to know me a little more than you already did."_

A 10-second countdown ring (animating SVG `strokeDashoffset`) auto-dismisses it. The ring uses the same green (`#4ade80`) as the scroll progress circle.

**Why**: this is the most human element on the site. Every other element is craft or information. This one is acknowledgment. A visitor who scrolled through the entire portfolio spent real time and real attention. The site notices. The countdown ring doesn't just dismiss — it counts down visibly, making the 10 seconds feel like a gift of presence rather than a loading state.

Only fires once (`thankYouFired.current = true`) — even if the user scrolls back to the top and returns.

---

## 10. Typography System

Three fonts, three functions:

| Font                                              | Role                                | Why                                                                                                              |
| ------------------------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Editorial New / Playfair Display** (serif, 800) | Display headings, section titles    | High contrast, editorial weight. The font of a newspaper front page or a luxury brand — authority through serif. |
| **DM Mono** (monospace)                           | Labels, metadata, nav, HUD elements | The technical register. Tabular numerals, fixed-width cadence. Signals precision.                                |
| **DM Sans**                                       | Body text, prose                    | Legible at all sizes, warm without being casual. The human voice.                                                |

The three-font system creates a **typographic hierarchy of authority**: serif (claim) → sans (support) → mono (data). A reader's eye learns to distinguish information types before reading the words.

The **warm ivory** (`#e8e0d0`, `#fafaf8`) for primary text against near-black backgrounds avoids the harshness of pure white-on-black. It's a printing-press warmth — the difference between a photocopied page and an offset-printed one.

---

## 11. The Hologram Layer — `holographic.css` / `HologramInterface.tsx`

All content inside `.hologram-content` gets `text-shadow: 0 0 14px rgba(167,226,255,0.2)`. An imperceptibly subtle blue-white glow — the CRT phosphor suggestion, the hologram suggestion, the "rendered light" suggestion.

It's not visible as a discrete element. It's felt as atmosphere. Photographs of real neon environments have this quality: text on backlit panels has a small bloom around it. This achieves the same effect with a single CSS property. On mobile the value is reduced to `0 0 10px rgba(167,226,255,0.16)`.

---

## 12. Section Entry Animations

Every section uses the same pattern: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}` with staggered delays. Some use `whileInView` for below-the-fold sections. The easing is consistently `[0.76, 0, 0.24, 1]` — an aggressive ease-in/out that makes motion feel decisive rather than floaty.

**Why the same easing throughout**: consistency creates a site-wide kinetic signature. The visitor doesn't consciously register it, but the site feels _coherent_ — designed as a whole rather than assembled from parts.

---

## 13. The "Optimising Residuals, Not Roles" Pulse

The red pulsing dot on the status strip at the bottom of the Hero borrows the visual language of live broadcast (the red "on air" dot), recording indicators, and operational dashboards. It says: this is not a resume. This is a live state.

The text — "Optimising: Residuals • Not: Roles" — is a compressed argument about professional philosophy. But the pulse makes it feel like telemetry. The word "optimising" gains different weight next to a blinking red light than it would in body text.

---

## Summary

Every element answers the same question in a different register: _what kind of person builds this?_

The ISS cursor says: someone who thinks in systems and in metaphors.  
The comet timeline says: someone for whom time and trajectory matter, not just titles.  
The background neural net says: someone who sees the living graph in the static list.  
The scroll damping says: someone who sweated the milliseconds nobody asked about.  
The thank-you at the end says: someone who knows the difference between building a product and building a relationship.

The site's argument isn't stated. It's demonstrated.
