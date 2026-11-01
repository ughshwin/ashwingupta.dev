# Landing-page studies

Open `/landing` to compare three live entrance samples:

- `/landing/split` — The duality: contrasting experience previews side by side.
- `/landing/editorial` — The invitation: a warm editorial introduction with two ordered choices.
- `/landing/signal` — The signal: a dark atmospheric entrance with restrained green accents.

All copy comes from `src/content/portfolio/landing.json`, including references to the existing profile, current employment and project metrics. The chooser uses CSS/SVG previews and a small preference script. It does not load the animated portfolio application while choosing.

Entry links currently open the existing animated (`/`) and static (`/review`) experiences. A choice is remembered in browser storage and shown when returning to the samples. These reviewable studies precede replacing the root entrance or unifying the two renderer routes.

The samples are marked `noindex, follow` and excluded from the canonical sitemap. The sitemap continues to contain 15 canonical content URLs. Reduced-motion settings disable the decorative preview animation; links remain usable without JavaScript.

Verified with the production build and existing TypeScript, SEO, content and Review checks, plus browser checks at desktop and 390px phone width. Both entry destinations and visible remembered-choice feedback were exercised.
