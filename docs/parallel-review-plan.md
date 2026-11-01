# Two editions, one website: the Technical Review build plan

Date: 28 October 2026

## The build contract

Build a complete second presentation of the current website under **`/review`**. The existing edition stays at its current URLs. Every current public page, section destination, project, research page, article, download, diagram, and piece of content has a corresponding place in the Review edition.

**The original site supplies the content. `/editions/review` supplies the visual system.**

The sample is a design reference, not the content source. Its shortened career list, rewritten project titles, invented introductory copy, and selected subset of projects must not become the production content. For example, the original homepage heading remains **“Ashwin Gupta”**. Original project and article titles remain verbatim. The original article about the cosmos stays verbatim in the journal edition, including its discussion of the original design.

Preserve words, punctuation, capitalisation, numbers, caveats, dates, status labels, attribution, links, semantic emphasis, lists, quotations, code, equations, diagram labels, and document assets. Keep section and document reading order. Layout changes may change line wrapping and visual grouping; they must not rewrite, abbreviate, combine, or omit content. Edition labels, contents navigation, breadcrumbs, and the edition switch are presentation controls and must stay outside the compared content blocks.

### Non-negotiable: preserve the existing Mermaid work

**The existing Mermaid rendering is protected work. It must survive this transformation intact.** The user has invested substantial time and effort in getting it right. This migration must preserve that result, its two-tab presentation, and the full depth of the case study.

- Keep **both existing HSBC tabs**, their exact labels, ordering, default state, switching behavior, and complete contents. Keep **all eight existing diagrams**, in their original tab/section associations and reading order.
- Preserve Mermaid source verbatim, including every node, edge, sequence, label, note, grouping, and diagram type. Preserve the current renderer, initialization configuration, layout algorithm, typography, colours, strokes, arrowheads, spacing, sizing behavior, and resulting diagram appearance. Do not retheme diagrams to cobalt merely to match the publication.
- Preserve the comparison table, captions, explanations, caveats, and all surrounding technical prose. A cleaner page is not permission to reduce the technical depth or replace detailed diagrams with summaries.
- The permitted changes are the **surrounding page background, publication layout, and placement of the existing content**. Treat each diagram and its established rendering surface as a protected component placed inside the new layout. Retain its own existing theme/background where needed to preserve its appearance and contrast.
- Do not replace the renderer with screenshots, hand-drawn approximations, simplified diagrams, raw-source-only fallbacks, or an alternative diagram library. Do not upgrade Mermaid as part of this visual migration. Isolate the existing rendering from inherited journal CSS.
- Renderer/source parity and rendered checks of **both tabs** are release requirements. If a layout change degrades the diagrams or tab behavior, fix or revert that layout change; do not weaken the requirement or silently accept a reduced version.

**The Technical Review style guide governs the page around the diagrams. The working original governs the diagrams themselves.** This preservation requirement takes precedence wherever a general restyling instruction elsewhere in this plan could imply changing the established Mermaid rendering.

This document is the implementation plan. The companion `review-route-inventory.json` records the route audit and reference hashes; it does not implement the new edition.

## 1. The complete route map

Use a prefix rule, not a new set of invented slugs:

```text
Review destination = /review + original pathname
Original /         = /review
```

Preserve hashes and query parameters. Preserve original casing and slug spelling. Every document must work when opened directly, refreshed, bookmarked, or reached through browser Back/Forward.

### Full documents: 15

| Current URL | Review URL |
| --- | --- |
| `/` | `/review` |
| `/articles` | `/review/articles` |
| `/work/ashwingupta-dev` | `/review/work/ashwingupta-dev` |
| `/work/azure-infra-docs` | `/review/work/azure-infra-docs` |
| `/work/here-app` | `/review/work/here-app` |
| `/work/hsbc` | `/review/work/hsbc` |
| `/work/pageindexollama` | `/review/work/pageindexollama` |
| `/work/skill-recommendation-engine` | `/review/work/skill-recommendation-engine` |
| `/research/controla` | `/review/research/controla` |
| `/research/physclip` | `/review/research/physclip` |
| `/research/pinns` | `/review/research/pinns` |
| `/research/scholaros` | `/review/research/scholaros` |
| `/articles/the-layer-nobody-talks-about` | `/review/articles/the-layer-nobody-talks-about` |
| `/articles/the-space-between-stars` | `/review/articles/the-space-between-stars` |
| `/articles/what-it-takes-to-leave-a-system-alone` | `/review/articles/what-it-takes-to-leave-a-system-alone` |

### Section destinations: eight

Mirror `/about`, `/impact`, `/stack`, `/experience`, `/recommendations`, `/featured`, `/projects`, and `/contact` as `/review/<same-section>`.

These currently show the homepage at the corresponding section. Keep that behavior: the Review URLs render the complete Review homepage and land on the matching original section ID. Native anchors must also work, such as `/review#projects`. Section destinations share the Review homepage's canonical content identity.

Use document scrolling in Review. Any script that updates the address as sections are read must retain the `/review` prefix. Avoid changing pathname on every scroll if ordinary anchors and the contents state provide the same navigation benefit.

### Redirect destinations: nine

Mirror all eight entries from `src/data/project-routes.json`. For example:

```text
/projects/hsbc-voice        → /work/hsbc
/review/projects/hsbc-voice → /review/work/hsbc
```

Also mirror `/research` → `/projects` as `/review/research` → `/review/projects`.

Generate hosting redirects and static fallbacks from the same map. Do not let a Review alias redirect out to the original edition. The audit therefore covers **32 route destinations: 15 documents + eight sections + nine redirects**. Design studies under `/editions` are development references, not portfolio content to mirror.

## 2. Freeze the reference before implementation

Keep `/editions/review`, its rendered style guide, and the other studies available. Do not progressively change the reference to match whatever the implementation happens to become.

Record a rendered desktop, tablet, and phone reference for the selected sample, plus the style-guide panels. The inventory already records hashes of the five source files that define the studies. Keep reference assets separate from production rendering so production edits cannot silently alter the reference.

The approved Review design rules are:

| Element | Reference |
| --- | --- |
| Page | `#F7F8FA` |
| Ink | `#1D293B` |
| Supporting text | `#536176` |
| Cobalt accent | `#244AC0` |
| Dividing rules | `#CCD2DD` |
| Figure/result wash | `#E9EDF6` |
| Display type | Playfair Display, regular; selective italic emphasis |
| Body type | DM Sans, regular; medium/semibold for hierarchy |
| Labels and annotations | DM Mono, regular |
| Desktop frame | Maximum 1280px including 52px side padding |
| Desktop contents | 225px rail, 42px gap; 180px rail below 1100px |
| Reading measure | Paragraphs generally capped near 650px; figures/tables may span the content area |
| Responsive structure | Rail becomes horizontal contents at 800px; 20px side padding at phone widths |
| Editorial components | Fine rules, numbered context labels, precise metadata, restrained tags, washed figures and result strips |
| Motion | Static reading surface and native scrolling; small functional interactions only |

Apply this system to every page type. A long technical case study should feel like another page in the same publication, not a return to the cosmic UI or a generic blog theme. Retain the sample's typography, whitespace, hierarchy, and restraint while accommodating the full original text.

Exception: the existing Mermaid diagrams retain their established rendering, theme, and internal typography. Their surrounding frames and position can follow the publication layout; their internals are not a new design exercise.

## 3. One source of content, two renderers

Do not maintain separately copied prose in two page trees. Initially move content by direct, verbatim extraction, then have both editions consume the shared source. A future edit to a paragraph, metric, role, quote, or link must appear in both editions from one edit.

The current site contains two main authoring forms:

1. Homepage copy and data embedded in React components: `Hero`, `About`, `ExperienceTimeline`, `Impact`/`impactData`, `Featured`, `Projects`, `Research`, `Recommendations`, `Skills`, and `Contact`; also contextual copy in `App` and the site utilities.
2. Complete Astro documents containing the article and case-study bodies, metadata, tables, and diagrams.

Extract the homepage's data, labels, and rich text into presentation-independent modules. Preserve arrays and strings exactly, including bold spans and original ordering. Keep colours, animation configuration, and geometry in the presentation layer. Do not import an animated React component just to obtain its content catalog.

Extract each Astro document's semantic body into a shared content component or structured document. Render the same body through the original and Review layouts. Extract original metadata and article-list entries as shared data too. Keep source prose authored once; avoid a build that depends on scraping yesterday's `dist` directory, copying generated HTML, or maintaining a second manually edited article.

Preserve the original edition through the extraction. Astro's scoped styles, globally scoped case-study CSS, inline colours, and rich-text helpers need deliberate handling: moving markup into a component changes style scope. Validate each original page immediately after extraction before building its Review presentation.

Suggested implementation boundaries:

```text
src/content/portfolio/        Shared homepage copy, catalogs, quotes, labels
src/content/documents/        Shared case-study and article bodies/metadata
src/lib/edition-routes.ts     Prefixing, inverse mapping, alias normalization
src/layouts/ReviewLayout.astro
src/components/review/        Publication shell and content presentations
src/styles/review/            Tokens, shell, document and component styles
src/pages/review/             Prefix-preserving route adapters
```

These directories are implementation guidance; avoid introducing a CMS or new framework for this work.

## 4. The complete homepage, translated into the publication

Use the original nine-section sequence and headings. The left rail indexes those sections; it must not replace them with the sample's much shorter selection.

| Original content | Review representation | What must survive |
| --- | --- | --- |
| Hero | Profile opening with original heading, portrait, copy, and links | Every original description, status, social link, résumé action, and feedback message |
| About | Editorial prose and clearly separated subsections | All pillars, boundaries, highlights, awards, dates, logos, and live dataset figures |
| Experience | Structured chronology | Every professional and educational entry, exact dates, roles, and all bullets |
| Impact | Grouped evidence ledger | Every category, metric, unit, source, contextual label, destination, and freshness message |
| Featured | Full project abstracts | All items, status badges, subtitles, context/approach/system/outcome text, and destinations |
| Projects & research | Complete project/research index | All projects and research entries, every summary and detail, tags, caveats, publication and repository links |
| Recommendations | Editorial quotation blocks | Every full quotation, name, title, employer, relationship, and date |
| Stack | Categorised technical index | Every category, technology, qualifying detail, and relevant logo |
| Contact | Publication contact section | All original invitation copy, locations, social/contact actions, résumé, feedback, and footer copy |

Hover-only text must become readable through the static layout or an explicit keyboard-accessible expansion. Do not replace four detailed paragraphs with a shorter sentence. Preserve all content that is revealed on mobile taps, tabs, expansion, or hover, not only the initial desktop screenshot.

Include the original end-of-page thank-you wording in an appropriate closing block. Preserve meaningful information and actions from the clocks/HUD as an unobtrusive publication utility area, including available time, exploration, and session readouts. Decorative particles, cursor trails, blur, spatial framing, and animation are presentation and do not need an animated counterpart. Do not activate unused components merely because their source files exist: the coverage inventory is based on what the current site actually renders and reveals.

## 5. Detail pages: complete editorial documents

### Work and research

Use the Review masthead, stable contents rail, original title/subtitle/status metadata, and full original section bodies. Build the contents from existing headings rather than rewriting them. Technical tables and diagrams can use a wider measure than narrative prose.

Preserve all original code, equations, captions, lists, research caveats, external citations, and PDF links. Keep working repository actions. Research status such as “In Development” must remain exactly as authored.

Two pages require dedicated treatment:

- **HSBC:** preserve all eight Mermaid diagrams, the before/after content, both tabs, the comparison table, and every accompanying explanation. **Preserve the current diagram rendering itself**, including source, configuration, internal colours, typography, geometry, labels, and behavior. Change only the surrounding page background/layout and where these existing components sit. Preserve tab switching and the original association of each diagram with its tab. Support touch/keyboard use and readable horizontal overflow without shrinking labels into illegibility. Keep all content accessible for print/no-JavaScript use without replacing the normal working Mermaid rendering. Scope initialization to the document so switching edition or navigating back does not double-bind handlers or erase diagram source.
- **PINNs:** preserve both **Foundation · 2023** and **Enterprise Framework · 2025** tabs and their complete contents, including all six benchmarks/workflows and whitepaper/publication destinations. Both bodies must remain present in the HTML and printable/readable when enhancement is unavailable.

### Dedicated Mermaid preservation procedure

1. **Capture the working original before extraction.** Record the Mermaid source and configuration in `src/pages/work/hsbc.astro`, the bundled `/vendor/mermaid.min.js` version/file hash, relevant diagram/tab styles and scripts, and each diagram's tab/section association. Capture rendered screenshots of every diagram in both tabs at desktop and phone widths, including the complete before/after page states.
2. **Move the existing implementation intact.** Share or reuse the established source and rendering behavior. Make only the changes needed to mount it within the Review document. Do not refactor the renderer, rewrite diagrams, change themes, or alter layout algorithms while migrating the page.
3. **Protect its styling boundary.** Journal rules for `svg`, `text`, `path`, `pre`, fonts, colours, line heights, and containers must not cascade into the Mermaid output. Preserve the established rendering surface and give large diagrams enough space or horizontal scrolling. Moving a figure must not crop its notes, arrowheads, labels, or edges.
4. **Exercise the complete lifecycle.** Open the page directly, switch tabs repeatedly, resize, navigate away and back, and switch editions. Confirm every diagram renders in the right tab, hidden-panel measurement does not distort layout, source is not lost after SVG replacement, and initialization neither duplicates nor disappears. Do not flatten both tabs into one reduced view.
5. **Compare content and rendered output.** Require exact source/configuration equality and matching diagram/tab counts. Compare all eight rendered diagrams against the original at equivalent available diagram widths; account only for dynamic SVG IDs and outer-page placement. Any changed internal layout, styling, missing labels, clipping, or switching regression must be resolved before completion. Check the original edition again too.

### Articles and article index

Keep the three original article cards with exact titles, subtitles, dates, tags, excerpts, order, and “Read” labels. Mirror each entire article with its existing heading hierarchy, paragraph sequence, emphasis, lists, and footer. No editorial polishing, shortened versions, new conclusions, or rewritten titles.

The current build contains approximately **18,140 words** across the 15 primary documents; the long-form articles are a substantial part of this scope. Word counts are a coverage signal, not a sufficient parity test.

## 6. Navigation must preserve the selected edition

Create one route mapper used by navigation, body links, cards, breadcrumbs, back links, utility links, and programmatic navigation.

- A Review project card opens the corresponding `/review/work/...` or `/review/research/...` page.
- A Review article stays under `/review/articles/...`.
- A Review “Back” link returns to the matching Review index or section, retaining existing `from` context where used.
- Recognise both relative internal URLs and absolute URLs pointing to the site's own origin. Rewrite only known page destinations; do not prefix asset, vendor, API, ownership, or download paths.
- Keep external URLs, email addresses, fragments, query values, download files, and link text unchanged except for the required edition prefix in internal page destinations.
- The edition switch maps the current logical page in both directions. `/work/hsbc` ↔ `/review/work/hsbc`; `/articles/x#section` ↔ `/review/articles/x#section`; `/experience` ↔ `/review/experience`.
- Use a normal document navigation across editions. Do not let Astro's persisted cosmic background, clock island, HUD, or transition state leak into the Review document.

The requested original homepage remains at `/`. After the complete mirror passes verification, expose a clear Review entry in the existing experience and a reciprocal switch in Review. Replacing the four-story entrance with a two-edition choice is a separate entrance treatment; it must not be used as a reason to move the existing homepage or gate deep links.

## 7. Shared assets, live information, and useful behavior

Reference the same résumé PDF, whitepaper, published paper, portrait, logos, repository URLs, and external profiles. Do not create asset URLs relative to `/review` accidentally. Use presentation filters only when needed for legibility, without changing asset identity.

Reuse the existing Kaggle counts, recorded fallbacks, formatting, refresh interval, and stale/live behavior. A flat page can have a small functional island; “flat” does not mean its data or actions become incomplete. Test both editions with the same fixed data snapshots to distinguish missing content from legitimate time differences.

Keep copy-email behavior and exact success/failure messages, résumé downloads, browser history, direct anchors, article navigation, and top-of-page access. Present these controls in the journal style. Share utility state by logical document identity so visiting the same content in a second edition does not count as a new piece of content explored.

Respect existing clock fallback/permission behavior. A different visual edition must not introduce a new location-permission requirement or lose information when the existing fallback is used.

## 8. Metadata and discovery

Preserve the existing content identity, publication dates, person/research schemas, descriptions, and original canonical routes. The two presentations should not be advertised as newly authored or separately dated work.

Use the corresponding original document as the canonical URL for its Review duplicate. Use `/` for Review homepage/section variants. Keep the original 15-document sitemap, RSS, ownership files, and reading guide coherent; alternative visual routes should not double-count the same articles as new publications. Provide ordinary crawlable internal links to the alternate presentation. Keep the `/editions` design studies noindexed.

Review pages need working titles, descriptions, share images, and structured data appropriate to the same underlying content. Update existing verification deliberately to recognise alternate presentation routes without weakening the checks on the original site. No fabricated dates or metrics.

## 9. Implementation order and completion gates

| Phase | Deliverable | Gate before continuing |
| --- | --- | --- |
| 1. Reference & baseline | Immutable sample/reference captures; route and content/state inventory; protected Mermaid source/configuration and rendered baselines | All 32 destinations accounted for; both HSBC tab states and all eight diagrams captured before edits |
| 2. Shared content | Verbatim homepage catalogs, document bodies, metadata and rich text | Original text and functional states match the pre-extraction baseline; original visual regression checks pass |
| 3. Review foundation | Production tokens, masthead, contents rail, document flow, routes and edition mapper | Matches the rendered guide; style isolation and direct loads work |
| 4. Full homepage | All nine original sections and their complete contents | Section-by-section parity; all links stay in the intended edition |
| 5. Complex detail pages | HSBC and PINNs first, then the other eight work/research documents | Both HSBC tabs and all eight diagrams retain their established rendering and full content; all tables, downloads, and exact text pass parity checks |
| 6. Writing | Article index and all three complete articles | Exact article block sequence, links, emphasis, dates, and tags match |
| 7. Integration | Edition switch, section URLs, redirects, utilities, live data and metadata | No accidental escape from Review; aliases, refresh and history work |
| 8. Publication QA | Desktop/mobile/print checks across all document types; final regression suite | All acceptance criteria below pass; then production deployment through the existing hosting workflow |

This order front-loads the difficult content and routing problems. Do not treat finishing the homepage as finishing the edition.

## 10. Acceptance: how to prove these are parallel universes

### Exact content parity

- Build a per-document manifest of stable content blocks, not a loose keyword test. Compare headings, paragraphs, list items, quotations, metadata, code, math, captions, table cells, and diagram source between the two renderers.
- Permit whitespace/line-wrap differences and presentation wrappers only. Preserve punctuation, case, emphasis, units, and order. Do not use lower word-count thresholds as a substitute for equality.
- Compare shared catalog IDs and item counts. Include every entry in experience, impact, projects, featured work, research, recommendations, and stack.
- Compare all tab panels and hover/expanded states, even when initially hidden. Check static HTML and enhanced runtime states independently.
- Treat Mermaid as protected rendering as well as protected content: preserve the existing renderer file/version, source, configuration, styles, all eight outputs, and both HSBC tab states. Source equality alone does not prove rendering preservation.
- Compare external links and asset destinations exactly. Compare internal page links after stripping only the edition prefix and normalising the documented section aliases.
- Record presentation-only additions by explicit ID outside the content manifest, so a broad exclusion cannot hide missing paragraphs.
- Test live counters and clock/utility states against shared deterministic fixtures.

### Route and behavior parity

- Direct-load and refresh all 15 Review documents and all eight section URLs.
- Verify all nine Review redirects in static output and the hosting configuration.
- Follow every internal Review link and fragment; fail on unexpected exits to the original edition. Edition switches are the explicit exception.
- Exercise both edition-switch directions, back links, browser history, and selected tab states.
- Verify résumé/PDF actions, copy-email feedback, live/recorded/stale counts, and utility fallbacks.

### Visual and usability verification

- Compare the production shell and component specimens with the frozen rendered guide, not a newly restyled substitute.
- Inspect at 320px, 390px, 768px, 1024px, and desktop widths. Test complete-page overflow, long project titles, large tables, and Mermaid labels.
- Review the homepage, HSBC, PINNs, an ordinary case study, the article index, and the longest article by screenshot and keyboard navigation.
- Make a dedicated side-by-side comparison of every original HSBC diagram and its Review counterpart in both tabs. Check internal layout, typography, colours, labels, notes, connectors, sizing, and clipping. Only the surrounding page background/layout and content placement may differ.
- Ensure colour contrast, visible focus, heading hierarchy, skip navigation, tab semantics, and touch-sized controls remain usable.
- Print all content, including non-active tab panels; avoid clipped paragraphs or figures. Verify basic reading, links, and downloads without JavaScript.
- Keep cosmic styling/runtime isolated from Review. Load only functional enhancements where required; no animation runtime for static content.

### Regression and release

- Run the existing `npm run build:verified` checks and add meaningful route/content-parity checks covering the new edition.
- Verify that original routes, content, entrance behavior, design, schemas, sitemap, feed, and downloads remain intact after extraction.
- Maintain parity checks in the normal build so future content cannot quietly drift between editions.
- Completion means every mirrored destination and state works, all original wording is accounted for, and the complete Review site follows the approved rendered system.

## Audit artifacts

- `docs/review-route-inventory.json`: all 32 route destinations, current main-content word counts and hashes, five reference-source hashes.
- `/editions/review`: the selected rendered design and style guide.
- `src/data/project-routes.json`: authoritative project alias mappings.
- Existing source: the content authority. Inventory text hashes are based on the current local built HTML and deliberately do not claim to capture every runtime or hidden state.
