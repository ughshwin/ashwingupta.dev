import { defineCollection } from 'astro:content';
import fs from 'node:fs/promises';

// Register the JSON source explicitly. Renderers use narrow imports so reading
// one section does not require loading every long-form document in the browser.
export const collections = {
  portfolio: defineCollection({
    loader: async () => {
      const root = new URL('./content/portfolio/', import.meta.url);
      const names = await fs.readdir(root, { recursive: true });
      return Promise.all(names.filter(name => name.endsWith('.json')).map(async name => ({
        id: name.replaceAll('\\', '/').replace(/\.json$/, ''),
        value: JSON.parse(await fs.readFile(new URL(name.replaceAll('\\', '/'), root), 'utf8')),
      })));
    },
  }),
};
