import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'parse5';

const origin = 'https://www.ashwingupta.dev';
const publication = JSON.parse(fs.readFileSync('src/data/article-publication.json', 'utf8'));
const sitemap = fs.readFileSync('dist/sitemap-0.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const guide = fs.readFileSync('dist/llms.txt', 'utf8');
for (const url of urls) assert.ok(guide.includes(`](${url})`), `Missing canonical reading link: ${url}`);

const walk = node => [node, ...(node.childNodes ?? []).flatMap(walk)];
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const xml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]));
const articles = urls.filter(url => new URL(url).pathname.startsWith('/articles/')).map(url => {
  const pathname = new URL(url).pathname;
  const nodes = walk(parse(fs.readFileSync(path.join('dist', pathname.slice(1), 'index.html'), 'utf8')));
  const metadata = nodes.filter(node => node.tagName === 'script' && attr(node, 'type') === 'application/ld+json')
    .map(node => JSON.parse(node.childNodes.map(child => child.value ?? '').join('')));
  const article = metadata.find(schema => schema['@type'] === 'Article' && schema.url === url);
  assert.ok(article, `Missing article metadata: ${url}`);
  assert.equal(article.datePublished, publication[pathname.split('/').pop()]?.datePublished, `Publication date drift: ${url}`);
  assert.ok(article.headline && article.description, `Missing article title or description: ${url}`);
  return article;
}).sort((a, b) => b.datePublished.localeCompare(a.datePublished));
assert.deepEqual(articles.map(article => new URL(article.url).pathname.split('/').pop()).sort(), Object.keys(publication).sort());

// Use actual publication metadata. Building the site never makes an article newer.
const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Articles by Ashwin Gupta</title>
    <link>${origin}/articles</link>
    <description>Writing on AI systems, engineering, design, and business by Ashwin Gupta.</description>
    <language>en</language>
    <atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml" />
${articles.map(article => `    <item>
      <title>${xml(article.headline)}</title>
      <link>${xml(article.url)}</link>
      <guid isPermaLink="true">${xml(article.url)}</guid>
      <description>${xml(article.description)}</description>
      <pubDate>${new Date(article.datePublished + 'T00:00:00Z').toUTCString()}</pubDate>
    </item>`).join('\n')}
  </channel>
</rss>
`;
fs.writeFileSync('dist/rss.xml', feed);
console.log(`Discovery assets verified: ${urls.length} canonical reading links; RSS feed generated for ${articles.length} articles.`);
