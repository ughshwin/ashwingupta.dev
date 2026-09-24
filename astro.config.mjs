import { readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const projectRoutes = JSON.parse(readFileSync(new URL("./src/data/project-routes.json", import.meta.url), "utf8"));
const projectRedirects = Object.fromEntries(Object.entries(projectRoutes).map(([slug, destination]) => ["/projects/" + slug, destination]));

export default defineConfig({
  site: "https://www.ashwingupta.dev",
  output: "static",
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  redirects: {
    "/research": "/projects",
    ...projectRedirects,
  },
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
