# Searchability implementation and operation

## Canonical content
The homepage is the canonical profile. Eight section aliases retain their URLs
and navigation, but canonicalize to /. Work, research, individual articles, and
the /articles collection are canonical documents. The sitemap currently has 15 URLs.
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
The production checker verifies those permanent redirects and retrieves all 15
canonical pages using seven search/user-directed crawler names. These are simulated
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

## Visibility audit and improvements (2026-10-06)

The production audit passed 72 of 73 checks before this change. All 15 canonical
pages, canonical metadata, redirect rules, sitemap coverage, and requests with the
six existing crawler names passed. The single failure was the missing latest
article in llms.txt. This is evidence of HTTP accessibility from the audit host,
not evidence that the providers have indexed the pages or cited them in answers.
The previous statement above that production served the pre-change version is
historical; the October audit confirmed the existing SEO metadata is now live.

Changes prepared locally:

- The homepage title and description identify Ashwin Gupta, his role, SkanAI,
  Bangalore, and the portfolio's actual engineering subjects in plain language.
- The displayed two-line name is a single h1 containing the full name. Canonical
  pages are checked for exactly one main heading.
- A no-JavaScript stylesheet removes Motion's hidden initial states from text.
  HSBC and PINNs tabs enhance a readable document: every panel is visible before
  the controls initialize. Failed entrance initialization releases the profile
  within 12 seconds. The normal interactive entrance remains available.
- llms.txt includes the latest article. Build checks require every canonical
  document to appear in this supplementary reading guide, preventing omissions.
  Google does not require llms.txt for AI Overviews or AI Mode.
- npm's postbuild creates /rss.xml from generated Article entities, using the
  recorded publication dates and canonical permalinks. Every page advertises the
  feed in its head. There are three articles; no dates are reset at build time.
- PerplexityBot joins the tested search crawler names. The existing wildcard
  robots policy already allows it. No extra training permissions are necessary
  for search visibility.
- The existing Vercel analytics and Speed Insights component moves into the
  shared layout so direct visits to articles and case studies are instrumented
  as well as the homepage. The build checks exactly one analytics island on
  every canonical page. Production reporting still requires the corresponding
  Vercel features to be enabled.
- IndexNow ownership and notification code is prepared. /indexnow-key.txt is a
  public ownership artifact, not a private API credential. Only canonical
  production documents are submitted, after the deployed key is checked.

Run `npm run notify:indexnow:preview` to review the 15 canonical URLs without
network requests. After deployment, `npm run check:seo:live` must pass before
`npm run notify:indexnow`. The production workflow follows that sequence after
a successful production deployment, or on manual dispatch. It submits the small
canonical inventory on each successful run. An HTTP 200 means the notification
was accepted; 202 means ownership validation is pending. Neither confirms indexing.
IndexNow serves participating search engines; Google discovery still relies on
its own crawling, sitemaps, and Search Console.

The October domain audit confirmed HTTPS apex → www still returns 307, while
both HTTP variants return 308 to HTTPS. Set the HTTPS apex redirect to permanent
(308) in Vercel's domain settings. This hosting setting cannot be confirmed or
changed through the source configuration alone.

### Completing discovery and measuring results

1. Deploy the verified build, then run the production checks and IndexNow command.
2. Confirm ownership of the canonical domain in Google Search Console and Bing
   Webmaster Tools. Submit /sitemap-index.xml and optionally /rss.xml. Inspect the
   canonical homepage, flagship case studies, and articles; use actual reports
   to address excluded pages, 404s, and the engines' chosen canonical URLs.
3. Review real access logs and WAF settings for verified Google, Bing, OpenAI,
   Anthropic, and Perplexity requests. A spoofed user-agent check does not prove
   that the providers' published IP ranges can access the site.
4. Use existing public GitHub, LinkedIn, and Kaggle profiles to corroborate the
   identity and link to the canonical portfolio. Link public repository READMEs
   to the corresponding case studies. These external edits need account access.
5. Publish original technical material for the searches you want to win: concrete
   problems, design tradeoffs, reproducible methods, benchmarks with methodology,
   and public evidence where allowed. Keep unfinished/private work labeled
   accurately. Existing case studies are a useful starting point.
6. Track indexed canonical pages, impressions, clicks, qualified contacts, AI
   referral traffic, and citations against a stable set of relevant queries.
   Record the query, date, product, and response; answers vary across runs.

Search Console exports described above are from September and are not current
indexing evidence. No account reports, verified backlinks, provider-origin traffic,
production deployment, or real IndexNow submission were performed in this audit.

Local verification: the production build and SEO/content checks passed for all
15 canonical pages. Chromium checks read every canonical page with JavaScript
disabled and confirmed visible primary and section headings. Normal entrance
navigation, the HSBC/PINNs tabs, and a deliberately stalled font promise passed;
the stalled entrance released the profile without user input. Desktop screenshots
were visually checked. The RSS XML parsed successfully with all three articles.
HTTP verifier, content verifier, and IndexNow notification regression tests passed.

Official references:
- [Google AI features and websites](https://developers.google.com/search/docs/appearance/ai-features)
- [Google sitemap and RSS guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [OpenAI search crawlers](https://developers.openai.com/api/docs/bots)
- [Perplexity crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
- [IndexNow protocol](https://www.indexnow.org/documentation)
