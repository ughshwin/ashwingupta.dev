# Technical Review edition

The complete parallel edition is built at `/review`. All 15 authored documents,
eight homepage section destinations, and nine redirect destinations are mirrored.
The original website stays at its existing paths. The frozen visual reference
remains available at `/editions/review`.

The subsequent request to justify every text box adds a shared
`src/styles/text-alignment.css` import to all three layouts, including the layout
studies. Its universal rule overrides component and inline alignment without
excluding headings, controls, tables or diagram text boxes. Final lines retain
normal justification spacing. The historical layout-study source check excludes
only this explicitly requested import. Browser audits at 1280px and 390px found
no alignment exceptions or page overflow; both HSBC tabs and all eight diagram
geometries and labels still match the original captures.

The later Impact alignment request adds one scoped exception in `Impact.css`:
metric entry text is centered, and the readout contents are centered within
their boxes. Category headings and text outside entries retain justification.
Desktop and phone audits cover both the Review and interactive editions.

The subsequent presentation refinements make Impact metrics noninteractive,
remove their link underlines and arrows, and match source names to the visible
Featured / Research & Systems cards. Impact category headings are centered.
Recommendations keep their exact quote text, vertically center it in the
available card body, and group each name, designation, company and relationship
at the bottom. The Review edition removes the original body CV controls and
offers exactly one CV link at the end of the left rail on every page; paper
downloads remain available. Rail navigation is 13px on desktop and 12px on
phones, with its own scroll area when needed. Article hover/focus titles use
the same accent blue as project cards. Email copying displays a rectangular
status badge inside the clicked email entry, including failures and repeated
copies, without a floating toast. Checks cover both 1280px and 390px widths.

The later sidebar-spacing correction left-aligns the rail navigation and its
descendants, overriding the universal justification rule only in that menu.
The font size and all other content alignment remain unchanged.

The next typography adjustment matches navigation labels and their numbers to
the former tagline's 13px DM Sans styling, including on mobile, and removes the
"Same work. A different perspective." tagline. The edition switch and the
single CV link remain at the end of the column.

The next content/layout pass removes Coforge's four award/training bullets from
its experience summary while retaining them in Gold and Glory. Award entries
center their icons, titles, dates and descriptions; recommendation cards center
both the quotes and attribution. The portfolio project's Personal icon uses
the site's `/favicon.svg`. The hero and contact status copy, the hero Scroll
label, and its PyTorch/LLMs/RAG/GCP caption are removed from shared source.
The Review hero uses capped text columns to bring its portrait closer to the
name; phone layouts remain stacked. Browser checks cover 1440, 1280, 1024, 820,
580 and 390px widths, with no overlap or page overflow. All eight HSBC diagrams
retain their saved geometry and labels in both tabs at desktop/phone sizes.

The user's next request removes the hero portrait and its remaining
MLOps/GenAI caption entirely. The hero is a single text column, and the unused
portrait parallax code, visual sizing rules and homepage image preloads are
removed. The image asset remains available to the site's existing metadata.

The three hero contact shortcuts now live in the Review sidebar immediately
above its sole Download CV link. Both the icon group and CV text are centered
relative to the rail width. The shared Review layout supplies the shortcuts on
all pages; the Review renderer omits the original hero icon row. Email copying
still works, with its rectangular feedback inside the sidebar control group.
Desktop and mobile measurements confirm zero horizontal centering offset and
no overflow. The interactive edition retains its own original hero shortcuts.

The subsequent requested production refinement widens the frame to 1440px,
keeps its original left alignment while extending toward the right, increases
paragraph measure to 760px, and restores the portrait's original colour. Mobile
breakpoints are retained. Both Mermaid tabs were rechecked against the protected
geometry captures before refreshing the verified-style hash.

## Shared content and rendering

`src/pages/review/[...path].astro` invokes the existing source page components.
`BaseLayout.astro` selects `CosmosLayout.astro` or `ReviewLayout.astro` by the URL.
The original cosmic layout was moved intact into `CosmosLayout`, with an edition
switch and context restoration added around it.

The Review layout renders the original semantic body at build time through
`review-document.mjs`. It maps page links to the parallel routes and replaces the
original motion/layout styles with the approved journal presentation. It does not
read generated build output or maintain a second copy of the article/project
prose. Hidden tab panels and all hover-revealed card text are retained. The second
visual loop copy of the awards marquee stays in the HTML but is hidden in Review.

Readout formatting is shared explicitly by both editions. At the user's request,
the Review edition omits the original popup's closing copy; the original edition
retains it. Live dataset counters reuse the existing store and fallback behavior.
The original clock component is reused as a functional utility. Review has no
cosmic background, application hydration, animation runtime, or entrance gate.

## Protected Mermaid implementation

`public/vendor/mermaid.min.js`, both original tabs, all eight diagram sources,
and the original renderer configuration and initialization are preserved.
The user's subsequent explicit request adds a Review-only paint adapter to
`hsbc.astro`: dark ink replaces white paint and label backgrounds become
transparent. It changes no diagram content, font metrics, geometry or lifecycle.
The historical source hash is still checked after removing that marked adapter;
the complete updated source is also locked in the browser-verified style record.

Journal CSS excludes the protected diagram subtree. Its inherited font and
line-height context is restored to the original. Mermaid's sequence diagrams
also measure text in a temporary SVG directly under `body`; that measurement
surface receives the original font metrics and text-rendering setting too.
Without these boundaries the same source produces subtly different geometry.

`review-rendering-baseline/` contains original and Review screenshots plus exact
geometry/label captures for all eight diagrams in both tab states at 1280px and
390px widths. These captures match. Diagram comparisons normalize neither the
paths nor their coordinates: the measured geometry and labels are equal.

## Requested layout corrections

The hero résumé label and Contact links align icons, filenames and arrows.
About cards and project detail rows use compact spacing; System design and
Design labels have adequate room. The trajectory uses a standard list with its
decorative year axis hidden, retaining every role's date and description.
Impact uses balanced 3/2/2 desktop rows, with responsive columns. Recommendation
cards share equal dimensions on desktop and flow naturally on phones.

The original credit line appears once in a footer centered across the viewport;
the sidebar rule ends at Contact. All 15 Review pages have dark text and symbols,
including article emphasis, inline code, and both tabs. Twenty white SVG assets
have deterministic dark copies under `public/review-assets/`; original assets
remain intact. The content audit allows only those paint changes and includes
the relocated footer in its exact text/semantic comparison.

## Checks

Run `npm run build:verified` for the production build, existing SEO/content
checks, and the new `check:review` verification. It checks all current document
bodies, semantic emphasis, headings, table/code content, links, images, metadata,
section aliases, redirects, protected source hashes, reference hashes, and the
recorded rendered geometry comparisons.

Run `npm run check:review -- --baseline` for the migration-only audit against the
original pre-transformation text. Normal builds compare both current editions,
allowing a legitimate future content edit to appear in both from one source.
Protected Mermaid/reference changes still require an intentional baseline update.
Recorded browser geometry is evidence from the captured run, not a claim that
the Node verification starts a browser on every build. The verified-style record
also locks the stylesheet, renderer boundary, and original global-style hashes
that produced those captures. Re-capture browser QA before updating that record
when changing the renderer, its styling boundary, or inherited measurement context.

Browser verification covers all 15 Review documents at phone/desktop widths and
representative page types at 320px, 768px, and 1024px. Functional checks include
both HSBC and PINNs tab states, keyboard switching, contents navigation into
inactive tab panels, and round-trip edition switching with the selected tab.

Both editions share canonical content URLs and the existing sitemap/RSS identity.
The local implementation does not publish to the live domain by itself; deployment
continues through the repository's existing Vercel workflow.
