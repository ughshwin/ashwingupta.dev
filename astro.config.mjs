import { siteRedirects, profile } from "./scripts/portfolio-data.mjs";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: profile.siteUrl.replace(/\/$/, ""),
  output: "static",
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  redirects: siteRedirects,
  integrations: [
    react(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      // Include only authoritative documents, never section aliases or redirects.
      filter: (page) => {
        const pathname = new URL(page).pathname.replace(/\/$/, "") || "/";
        return pathname === "/" || pathname === "/articles" || /^\/(work|research|articles)\/[^/]+$/.test(pathname);
      },
      serialize(item) {
        if (item.url === "https://www.ashwingupta.dev/") {
          return { ...item, priority: 1.0, changefreq: "weekly" };
        }
        return { ...item, url: item.url.replace(/\/$/, "") };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
