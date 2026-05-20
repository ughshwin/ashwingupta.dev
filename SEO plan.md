# SEO Plan — ashwingupta.dev

## Context

The portfolio has a solid technical foundation (canonical tags, OG tags, sitemap, robots.txt) but is missing the high-signal elements that determine both Google ranking and AI search visibility (Perplexity, ChatGPT browsing, Claude search). The three biggest gaps are: no JSON-LD structured data, generic per-page descriptions, and a missing OG image. Each fix below addresses a specific ranking or discoverability signal.

---

## Critical Files to Modify

| File                              | What changes                                                                           |
| --------------------------------- | -------------------------------------------------------------------------------------- |
| `src/layouts/BaseLayout.astro`    | Add JSON-LD Person schema, fix OG image meta, add twitter:creator, og:image dimensions |
| `src/pages/index.astro`           | Improve homepage title + description to match actual positioning                       |
| `src/pages/projects/[slug].astro` | Replace generic description with project-specific impact line                          |
| `public/`                         | Add `og-image.png` (1200×630), `apple-touch-icon.png`                                  |
| `astro.config.mjs`                | Add sitemap `lastmod`/`changefreq`/`priority` config                                   |

---

## Changes — Ordered by Impact

### 1. JSON-LD Structured Data (highest impact — AI + Google)

Add to `BaseLayout.astro` inside `<head>`:

**Homepage (`/`)** — Person schema:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ashwin Gupta",
  "url": "https://www.ashwingupta.dev",
  "jobTitle": "AI Systems Researcher",
  "worksFor": { "@type": "Organization", "name": "Coforge" },
  "alumniOf": [
    { "@type": "EducationalOrganization", "name": "IIIT Bangalore" },
    { "@type": "EducationalOrganization", "name": "BMS College of Engineering" }
  ],
  "knowsAbout": [
    "Inference Orchestration",
    "Physics-Informed ML",
    "RAG Systems",
    "LLM Inference",
    "Distributed Systems"
  ],
  "sameAs": [
    "https://github.com/ughshwin",
    "https://www.linkedin.com/in/ashwingupta3012/",
    "https://www.kaggle.com/ashwingupta3012"
  ],
  "email": "ashwingupta3012@gmail.com",
  "description": "I design how AI systems behave under real-world constraints — from decision layers and inference routing to physics-informed models.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bangalore",
    "addressCountry": "IN"
  }
}
```

**All project pages (`/projects/[slug]`)** — SoftwareSourceCode / CreativeWork schema (conditionally added per page via Astro props):

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  "name": "<project title>",
  "author": { "@type": "Person", "name": "Ashwin Gupta" },
  "description": "<project impact line>",
  "programmingLanguage": "<derived from tags>",
  "codeRepository": "<github url if present>"
}
```

**All pages** — BreadcrumbList for project pages:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.ashwingupta.dev/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "<project title>",
      "item": "<canonical url>"
    }
  ]
}
```

**Implementation:** Pass a `jsonLd` prop (array of objects) to `BaseLayout`. Each page passes the appropriate schema. Serialize with `JSON.stringify` and inject as `<script type="application/ld+json">`.

---

### 2. Fix Homepage Title + Description

**`src/pages/index.astro`**

Current title: `"Ashwin Gupta | AI Systems & Infrastructure Engineer"`
→ New title: `"Ashwin Gupta — AI Systems Researcher | Inference, Orchestration, Scientific ML"`

Current description: `"Portfolio of Ashwin Gupta: AI infrastructure, production systems, research projects, and contact links."`
→ New description: `"Ashwin Gupta designs how AI systems behave under real-world constraints — inference routing, orchestration layers, and physics-informed models. AI Engineer at Coforge. Based in Bangalore."`

---

### 3. Fix Project Page Descriptions

**`src/pages/projects/[slug].astro`**

Current: `description: "Project detail: ${title}"` — useless for Google and AI.

New: Pass the project's `impact` line as the description, prepended with context.

Implementation: In `getStaticPaths`, include the `impact` field in props alongside `title`. Then:

```
description: `${title} — ${impact}`
```

Example for project 04:

> "Real-Time AI Voice Infrastructure for Banking — 1,600+ concurrent sessions · 7× VM capacity · ~$1.3M annualized savings · MTTR ~1–2 hrs → ~5 min"

---

### 4. Fix OG Image (broken 404)

**`public/og-image.png`** — Create a 1200×630 PNG. Simplest valid option: a dark background with the name and role as text. This unblocks social sharing previews on LinkedIn, Twitter/X, and iMessage.

Add missing OG image meta to `BaseLayout.astro`:

```html
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Ashwin Gupta — AI Systems Researcher" />
<meta property="og:image:type" content="image/png" />
```

---

### 5. Add Missing Social/Discovery Tags

In `BaseLayout.astro`:

```html
<meta name="twitter:creator" content="@ashwingupta3012" />
<meta name="twitter:site" content="@ashwingupta3012" />
<meta name="author" content="Ashwin Gupta" />
<meta
  name="robots"
  content="index, follow, max-snippet:-1, max-image-preview:large"
/>
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

The `max-snippet:-1` directive explicitly allows Google to use full-length rich snippets in search results — critical for AI overview appearances.

---

### 6. Enrich Sitemap

**`astro.config.mjs`** — Configure `@astrojs/sitemap` with priority weights:

```js
sitemap({
  customPages: [],
  changefreq: "monthly",
  priority: 0.7,
  lastmod: new Date(),
});
```

Override homepage to `priority: 1.0`. This signals to crawlers the relative importance of pages.

---

## AI Search Visibility (Perplexity / ChatGPT / Claude) — Why These Changes Help

AI search engines parse pages differently from Google. They prioritize:

1. **JSON-LD Person schema** — tells an AI "this entity is a person named X with these properties" without parsing prose
2. **Consistent entity signals** — name + role + location + social profiles appearing together, repeatedly
3. **`max-snippet:-1`** — allows AI overviews and answer boxes to pull full descriptions
4. **Descriptive meta descriptions** — AI models index meta descriptions as authoritative summaries of what a page is about
5. **BreadcrumbList schema** — helps AI understand site structure and how pages relate to each other

The current site has strong content but no structured entity signals. After these changes, when someone asks "who is Ashwin Gupta AI engineer" or "Ashwin Gupta inference orchestration", the answer should be pullable directly from the schema.

---

## Verification

1. Run `npm run build` — confirm no build errors
2. Use Google's Rich Results Test on the homepage URL to validate JSON-LD
3. Use OpenGraph debugger (Facebook Sharing Debugger or Twitter Card Validator) to confirm OG image renders
4. Check Google Search Console → Sitemaps → confirm `sitemap-index.xml` still validates after config changes
5. Inspect built `dist/index.html` for presence of `<script type="application/ld+json">` and all new meta tags
