# Searchability implementation and operation

## Canonical content
The homepage is the canonical profile. Eight section aliases retain their URLs
and navigation, but canonicalize to /. Work, research, individual articles, and
the /articles collection are canonical documents. The sitemap has 14 URLs.
No new visual elements, layouts, or routes are needed for this architecture.

## Entity and publication metadata
src/lib/structured-data.ts owns the Person and WebSite entities. Canonical
content references the same Person ID, including repository and publication
references where available. Current employer: SkanAI. Professional identity:
AI Systems Engineer. Actual employment titles remain unchanged.

src/data/article-publication.json records date provenance. The owner authorized
using the first commits adding the essays as publication-date proxies:
The Space Between Stars: 2026-05-24, commit 73b421d68f122b62e312db86235933c5c7de39aa.
The Layer Nobody Talks About: 2026-05-28, commit 3b22d0b466051dc0c9781d1c0134d6058a143624.
These are repository introduction dates, not independently verified deployment
timestamps. Visible May 2026 labels are unchanged. Correct the metadata if better
evidence becomes available. Never reset dates or lastmod at build time.

## Route maintenance
src/data/project-routes.json is the authoritative legacy project map.
Astro and card links read it directly. Run npm run sync:seo after changing it to
regenerate the managed project redirects in vercel.json. Unrelated Vercel rules
are preserved. npm run check:seo:config detects drift before builds.

## Verification and release
npm run build:verified builds and checks generated HTML, entity references,
publication metadata, sitemap coverage, robots, redirect fallbacks, and links.
Vercel's buildCommand invokes it, so an invalid SEO build cannot be released
through this configuration. GitHub Actions runs the same checks on pushes and PRs.
node scripts/test-seo-verifier.mjs verifies the production checker against a local
HTTP fixture, including failures for wrong canonicals, missing dates, denied
crawlers, and broken redirects. It is a test of the checker, not a live-site pass.

npm run check:seo:live verifies the fixed public production origin over HTTP:
status codes, content types, headers, redirects, canonical pages, entities,
article dates, robots, sitemap, llms.txt, and representative crawler user agents.
It exits nonzero on any failed assertion. No authentication or secrets required.
The production workflow runs on successful production deployment events and can
also be run manually. Preview deployments are excluded. These workflows become
active only after the changes are pushed to GitHub; no deployment is performed
by these checks. Vercel events and branch protection require account-side setup.

## External corroboration
The sameAs links identify GitHub, LinkedIn, and Kaggle. They do not edit profiles
or create independent endorsements. Suggested factual profile text:
AI Systems Engineer | inference routing, concurrency architecture, RAG, and
physics-informed ML. AI Engineer at SkanAI. Portfolio: https://www.ashwingupta.dev/

Set profile website fields to the canonical homepage; keep employment entries
under the actual title. Relevant repository READMEs can link to their existing
/work or /research case studies. This requires access to the relevant accounts
and repositories; do not claim backlinks have been published until checked.
Submit https://www.ashwingupta.dev/sitemap-index.xml in the owner's Google Search
Console and Bing Webmaster Tools properties after deployment. No search-console
credentials, profile edits, or third-party endorsements are generated here.

robots.txt allows crawlers and llms.txt is a supplementary canonical reading
guide. Neither guarantees inclusion, ranking, or citations in an AI answer.

## Deeper content checks
The verified build also runs `npm run check:content`. It parses generated HTML
and checks main landmarks, English document language, unique titles and
descriptions, canonical URLs, indexing/snippet directives, server-rendered
experience, internal links and anchors, metadata image files, whitepaper
references, and reachability of every canonical page from the homepage.
`node scripts/test-content-verifier.mjs` tests representative failure cases.
All required scripts are explicitly allowed through the repository ignore rules.

The Person portrait uses the existing profile asset. Page and article images use
the existing social image. The PINNs whitepaper is linked as associated media.
IIIT Bangalore remains visible in the timeline as an ongoing diploma; it is not
claimed as completed alumni status in structured metadata.

Vercel normalizes trailing-slash variants to the existing non-slash canonicals.
The production checker verifies those permanent redirects and retrieves all 14
canonical pages using six search/user-directed crawler names. These are simulated
user-agent requests, not proof of traffic from each provider's actual IP ranges.
Crawler access and correct deployment metadata are separate checks.

## Remaining release and evidence work (2026-09-10)
The public origin still serves the pre-change version. Deploy this commit, then
run `npm run check:seo:live` and submit the canonical sitemap in the owner's Google
Search Console and Bing Webmaster Tools. Index inclusion, chosen canonicals,
impressions, citations and real bot access need account-side reports or logs.

The apex host currently uses a temporary 307 redirect to www. Change the Vercel
domain redirect to permanent (308) in domain settings. This is independent of the
trailing-slash configuration in this repository.

The owner confirmed ScholarOS is private. Its public case study remains indexed;
the private URL is no longer advertised as public codeRepository metadata. The
existing GitHub control keeps its design and is labeled access-restricted for
assistive technology. No repository permissions were changed.

The owner confirmed SkanAI began on 2026-06-15 and Coforge ended on 2026-06-05.
The homepage timeline, hero, Featured HSBC date, llms.txt and dated EmployeeRole
metadata now agree. The resume is explicitly excluded from this update and may
still appear in search with older employment information.

The existing NCISCT-2022 paper link now has a profile citation: Generating MCQs
using Graphs and Language Models, Ashwin Gupta and Gururaja H S, IJISET volume 9,
special issue, May 2022. Publisher-indexed metadata establishes month-level
publication precision; no exact day, DOI or citation count has been invented.

The owner supplied Search Console exports dated 2026-09-10, with chart data through
2026-09-04: 18 indexed, 46 not indexed. The 28 discovered-but-not-indexed examples
are all trailing-slash variants (8 section aliases, 8 legacy project URLs and 12
canonical document variants). Redirect/canonical exclusions are intentional for
those variants; inspect and request indexing of canonical destinations instead.
The exports do not include example URLs for the 9 404s or 5 crawled-not-indexed
pages. Do not invent redirects without those URLs. The live verifier covers slash
variants of canonical pages, section aliases, legacy project URLs and /research.

Preserve case-study metrics as reported claims unless their methodology and
independent evidence are available. Add genuine supporting links through public
repository READMEs, author profiles and publication records when authorized.
Avoid invented awards, ratings, publication dates, hidden keywords or duplicate
query-targeted pages. Additional structured data cannot substitute for evidence.
