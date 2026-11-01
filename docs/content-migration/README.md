# Content externalisation audit

The migration moves authored portfolio data into `src/content/portfolio`, including structured records, article/case-study prose, metadata, diagram definitions, interface copy and discovery content. Both editions continue using their existing markup and rendering behavior.

`before.json` was captured from the successful verified build before extraction. It records 68 generated HTML routes (50 content/alias pages and 18 redirect fallbacks), normalized body text, metadata, headings, links, images, raw Mermaid definitions, and protected page script/style block hashes.

`npm run check:migration` compares the built site with that capture. It ignores clock seconds and permits only the layout studies' stale SkanAI title correction (`AI Engineer` → `Software Engineer 1`) and the canonical IISc company spelling. All other audited text, headings, links, images, metadata and diagrams must match. The stored structure hash is diagnostic only because React hydration identifiers change during the refactor; semantic structure is checked by the existing content and Review verifiers.

`mermaid-geometry.json` is a fresh browser capture after extraction: both HSBC tabs, all eight diagrams, 1280px and 390px viewports. Geometry, labels and viewBoxes match the original saved browser baseline exactly. `desktop.png` and `phone.png` show the migrated preview.

The opt-in render integration test edits the current role, project name, email, recommendation, fallback count and a case-study paragraph in their source records. It verifies real production output in both editions, shared structured data, layout studies and the reading guide, then restores the source bytes and builds the original content again.

The current HTML snapshots are a migration audit, not another editable content source. Future legitimate content edits should continue to pass the normal verified build; the historical migration comparison will naturally differ.
