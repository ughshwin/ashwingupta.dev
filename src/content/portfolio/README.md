# Portfolio content

This folder is the source for the static Technical Review at `/`, its case studies and articles, structured data, redirects, RSS, and the crawler reading guide. Edit content here, then run `npm run build:verified`. The animated design and chooser are retired; their old URLs redirect to the static site.

## Where to edit

| Content | Source |
| --- | --- |
| Name, contact details, social profiles, location, default SEO | `profile.json` |
| Employment and education, dates, titles, contributions | `experience.json` |
| Project identities, visible names, destinations, repository URLs | `projects.json` |
| Project cards, tags, summaries, detailed bullet points | `project-details.json` |
| Featured and research narratives | `featured.json`, `research.json` |
| Impact values and categories | `impact.json` |
| Awards and achievements | `achievements.json` |
| Recommendations and attribution | `recommendations.json` |
| Skill categories and technologies | `skills.json` |
| Active work | `currently.json` |
| About pillars and principles | `about.json` |
| Article titles, summaries, tags, dates and date provenance | `articles.json` |
| Academic publication details | `publications.json` |
| Kaggle dataset identity and recorded fallback counts | `kaggle.json` |
| Full case studies, essays, page metadata and diagram definitions | `documents/*.json` |
| Section introductions, biography and interface wording | `copy/*.json` |
| Closing message | `closing.ts` |
| Layout-study summaries | `editorial.json` |
| Navigation and section titles | `navigation-*.json`, `section-titles.json` |
| Shared routes, resources, accessibility labels and runtime wording | `chrome.json` |
| Awwwards ribbon destination and accessible label | `recognition.json` |
| Clock locations | `airports.json` |
| Crawler reading guide | `discovery/llms.template.md` |

The `.ts` and `.mjs` files derive views and resolve references. They contain no separate career/project catalogue. Components retain markup, CSS, icons, layout choices, animation, event handlers and runtime fetch logic. Binary assets remain in `src/assets` and `public`; `src/lib/portfolio/assets.ts` maps stable content keys to bundled asset URLs.

## Shared facts and references

Featured, research, and published impact entries use `projectId`, matching a key in `projects.json`. Set `displayName` there to change the common project label in those sections. `title` is the fuller card title. Separate descriptive headlines in case studies are deliberately independent editorial copy.

Document and interface text can reference shared facts:

```json
{
  "canonical": "{{origin}}{{projects.hsbc-voice.href}}",
  "byline": "By {{profile.name}}"
}
```

Available reference roots are `profile`, `projects`, `articles`, `experience`, `currentEmployment`, `previousEmployment`, `kaggle`, `publications`, `chrome`, `editorial`, and `origin`. Unknown or circular references fail validation. Nested references resolve consistently in renderers and Node build tools. The discovery template additionally has `currentStart` and `previousPeriod`.

`experience` is keyed by record ID. For historical copy, prefer `{{experience.skan.role}}` to `{{currentEmployment.role}}`; changing employer must not rewrite an earlier role. Each experience reference also exposes derived `period`, `startYear` and `endYear`. Profile name parts and initials derive from `profile.name`.

The current role is derived from the one professional experience record with `end: null`. The hero, timeline, profile metadata, layout studies and reading guide share it. Dates retain their authored precision: `2024-06` means a month; `2026-06-15` means an exact day. Education also records `status`; an ongoing course can have an expected end date and must not be included in `alumniIds`.

`schemaEmploymentIds`, `previousEmploymentId` and `alumniIds` in the profile explicitly select which experience records appear in those metadata contexts. If the current employer changes, update those references along with the employment records.

Project `metrics` contain canonical values shared by compatible Impact entries and case-study summaries. Distinct precision or formatting in an editorial sentence stays explicit: `~97%` and `97%` have different meanings. Project status wording lives in `copy/Projects.json.statusLabels`; `statusTone` selects rendering treatment independently of the wording. `secondaryCardOrder` controls secondary-card placement. A new project uses a catalogue identity plus its detail record; Featured and Research join through `projectId`.

Skills use readable records: a category has `id`, `label`, and `technologies`; a technology has `name`, an `icons` filename array under `public/logos`, and optional `detail`. New categories receive a default renderer color. Recommendations have stable `id` keys, so editing a person's name does not change their component identity.

Article `datePublished` is the publication fact. Display month/year, URL and page title derive from it, the slug/title, and the profile. `descriptionTemplate` is deliberately separate SEO wording from the index `excerpt`. Editing a title/date updates the index, document metadata and RSS; publication-date provenance stays in `source`. A case-study heading may be a longer editorial title than a project's shared label.

## Long-form content

Each `documents` file corresponds to a page or shared layout. `metadata` holds SEO fields and resource URLs; `blocks` holds visible text; `data` holds structured page metrics; `diagrams` holds Mermaid definitions. Filenames use `--` for route separators: `work--hsbc.json` supplies `/work/hsbc`.

Text around inline emphasis or code is split into fragments so that existing semantic markup and scoped styles remain intact. Change the fragment value to edit wording; preserve meaningful spaces between fragments. Adding a new paragraph, link, section or document still requires its rendering markup. The migration separates content from design; it does not introduce a visual page builder or CMS.

Live Kaggle values are fetched by the existing runtime. Only identity and recorded fallback counts are authored here. Network failure continues to show recorded/stale data rather than inventing new counts.

## Validation and generated files

- `npm run check:data` validates identities, dates, references, narrative stages, publication provenance and malformed-record rejection.
- `npm run build:verified` validates content, generates redirect/reading-guide outputs, builds the static site, and checks TypeScript, SEO, links, semantics, retired routes, the ribbon and protected diagrams.
- `npm run check:migration` compares the current build against the pre-migration snapshot. This is a historical audit: intentional future content edits will change that snapshot comparison. Normal builds do not freeze all prose.
- `npm run test:content:render` temporarily edits every rendered homepage section, shared metrics/identity and article title/date records, verifies the static pages and metadata/RSS, then restores the exact source bytes and rebuilds. Run it with no concurrent editing/build process.
- `npm run check:types` checks TypeScript.

`public/llms.txt`, managed redirects in `vercel.json`, and `dist/rss.xml` are generated outputs. Update their source here rather than editing those outputs. Redirect destinations must have real page templates. `npm run sync:seo` updates the checked-in discovery/redirect outputs without a full build.

`src/components/static/PortfolioHome.astro` renders the shared homepage directly without hydration. Longform page script/style blocks and Mermaid definitions remain protected. Rendered HSBC geometry is separately recorded at desktop and phone widths. Historical copy for retired layout studies remains in this folder for reference and is not served.
