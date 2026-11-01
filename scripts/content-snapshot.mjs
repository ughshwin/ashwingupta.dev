import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { parse } from 'parse5';

export const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
const walk = node => [node, ...(node.childNodes || []).flatMap(walk)];
const text = node => node.nodeName === '#text' ? node.value : ['script','style'].includes(node.tagName) ? '' : (node.childNodes || []).map(text).join('');
const clean = node => text(node).replace(/\s+/g, ' ').trim();

export function captureSite() {
  const pages = {};
  for (const file of fs.readdirSync('dist', { recursive: true }).filter(f => f.endsWith('.html')).sort()) {
    const html = fs.readFileSync(path.join('dist', file), 'utf8');
    const nodes = walk(parse(html));
    const route = '/' + file.replaceAll('\\','/').replace(/(?:^|\/)index\.html$/, '');
    const body = nodes.find(n => n.tagName === 'body');
    const meaningful = nodes.filter(n => !['script','style','astro-island'].includes(n.tagName));
    pages[route] = {
      text: body ? clean(body) : clean(nodes[0]),
      title: clean(nodes.find(n => n.tagName === 'title') || {}),
      description: attr(nodes.find(n => n.tagName === 'meta' && attr(n,'name') === 'description') || {}, 'content') || '',
      canonical: attr(nodes.find(n => n.tagName === 'link' && attr(n,'rel') === 'canonical') || {}, 'href') || '',
      schemas: nodes.filter(n => n.tagName === 'script' && attr(n,'type') === 'application/ld+json').map(n => JSON.parse((n.childNodes || []).map(c => c.value || '').join(''))),
      headings: meaningful.filter(n => /^h[1-6]$/.test(n.tagName)).map(n => [n.tagName, clean(n), attr(n,'id') || '']),
      links: meaningful.filter(n => n.tagName === 'a').map(n => [attr(n,'href') || '', clean(n), attr(n,'aria-label') || '', attr(n,'download') ?? null]),
      images: meaningful.filter(n => n.tagName === 'img').map(n => [attr(n,'src'), attr(n,'alt') || '']),
      diagrams: meaningful.filter(n => (attr(n,'class') || '').split(' ').includes('mermaid')).map(n => text(n)),
      structure: hash(JSON.stringify(meaningful.filter(n => n.tagName && !n.tagName.startsWith('astro-')).map(n => [n.tagName, (n.attrs || []).filter(a => !a.name.startsWith('data-astro') && !['src','href'].includes(a.name)).sort((a,b) => a.name.localeCompare(b.name))]))),
    };
  }
  return pages;
}

export function captureProtectedSources() {
  const files = fs.readdirSync('src/pages', { recursive: true }).filter(f => f.endsWith('.astro'));
  return Object.fromEntries(files.map(file => {
    const source = fs.readFileSync(path.join('src/pages',file),'utf8').replace(/\r\n/g,'\n');
    return ['src/pages/' + file.replaceAll('\\','/'), hash([...source.matchAll(/<(script|style)\b[\s\S]*?<\/\1>/g)].map(m => m[0]).join('\n'))];
  }));
}
