import { parseFragment, serializeOuter } from 'parse5';
import svgAssets from './review-svg-assets.json';
import hsbcLogoUrl from '../assets/HSBCLogo.webp?url';
import kaggleLogoUrl from '../assets/KaggleLogo.webp?url';
import resumeUrl from '../assets/Ashwin_Gupta_Senior_AI_Engineer.pdf?url';

const reviewAssets = {
  ...svgAssets,
  [hsbcLogoUrl]: '/review-assets/logos/hsbc-black.svg',
  [kaggleLogoUrl]: '/review-assets/logos/kaggle-black.png',
  '/logos/hsbc.svg': '/review-assets/logos/hsbc-black.svg',
  '/logos/sipp.png': '/review-assets/logos/sipp-black.png',
};

const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value ?? '';
const set = (node, name, value) => { const a = node.attrs.find(a => a.name === name); if (a) a.value = value; else node.attrs.push({ name, value }); };
const add = (node, name) => set(node, 'class', (attr(node, 'class') + ' ' + name).trim());
const walk = node => [node, ...(node.childNodes ?? []).flatMap(walk)];
const text = node => node.nodeName === '#text' ? node.value : ['style', 'script', 'svg'].includes(node.tagName) ? '' : (node.childNodes ?? []).map(text).join(' ');
const clean = node => text(node).replace(/\s+/g, ' ').trim();

/** Normalize the data-driven longform documents for the static site at build time.
 * Never reads dist or maintains another copy of prose. Mermaid containers are
 * opaque: their HTML, styles, source, labels and renderer stay untouched. */
export function presentReview(html, { home, mapHref }) {
  const fragment = parseFragment(html);
  const source = walk(fragment).find(n => n.tagName === 'main' || attr(n, 'role') === 'main');
  if (!source) throw new Error('Review edition requires the original page main landmark.');
  source.tagName = source.nodeName = 'div';
  const originalClasses = attr(source, 'class');
  source.attrs = source.attrs.filter(a => !['role','class','style'].includes(a.name));
  source.attrs.push({ name: 'class', value: `${originalClasses} rv-source ${home ? 'rv-home' : 'rv-document'}`.trim() }, { name: 'data-review-source', value: '' });
  const contents = [];
  let headingIndex = 0;

  function visit(node, section = '') {
    if (!node.tagName) return;
    const id = attr(node, 'id');
    if (id && ['hero','about','experience','impact','featured','projects','recommendations','stack','contact'].includes(id)) section = id;
    const classes = attr(node, 'class');
    // This is the protected boundary. No typography or HTML transformations inside.
    if (classes.split(' ').includes('cs-diagram-container')) {
      add(node, 'rv-protected-diagram');
      return;
    }
    const style = attr(node, 'style');
    if (home) {
      if (node.tagName === 'nav') add(node, 'rv-legacy-nav');
      if (node.tagName === 'h1') {
        // The original name is on two block lines. Insert layout whitespace
        // when those spans become an inline journal headline.
        node.childNodes.splice(1, 0, { nodeName: '#text', value: ' ', parentNode: node });
      }
      if (section === 'hero' && /display:flex;flex-direction:row;gap:3rem/.test(style)) add(node, 'rv-role-meta');
      if (section === 'experience' && node.tagName === 'div' && /^20\d\d$/.test(clean(node))) add(node, 'rv-year');
      if (/display:flex/.test(style) && /justify-content:space-between/.test(style)) add(node, 'rv-card-meta');
      if (section === 'experience' && /display:flex;gap:5px/.test(style)) add(node, 'rv-bullet');
      if (section === 'stack' && /flex-wrap:wrap/.test(style)) add(node, 'rv-tech-list');
      const elements = (node.childNodes ?? []).filter(n => n.tagName);
      if (elements.length === 2 && ['Context','Approach','System','Outcome','Problem','Method','System design','Design','Insight'].includes(clean(elements[0]))) add(node, 'rv-pair');
      if (/border[^;]*solid/.test(style) && /border-radius/.test(style) && clean(node).length > 60) add(node, 'rv-card');
      if (/display:grid/.test(style)) add(node, 'rv-grid');
      if (/font-family:[^;]*(?:DM Mono|SF Mono)/.test(style)) add(node, 'rv-label');
      if (/font-family:[^;]*(?:Playfair|Editorial)/.test(style) && !/^h[1-6]$/.test(node.tagName)) add(node, 'rv-serif');
      if (/white-space:pre-line/.test(style)) add(node, 'rv-preline');
      if (/animation:highlights-marquee/.test(style)) add(node, 'rv-highlights');
      if (node.tagName === 'img') add(node, section === 'hero' && attr(node, 'alt').includes('Ashwin') ? 'rv-portrait' : 'rv-logo');
      if (node.tagName === 'button' && attr(node, 'title').toLowerCase().includes('email')) set(node, 'data-review-copy', '');
      // Presentation-only styles are not content. Remove masks, fixed heights,
      // offsets and motion initial states so every original word is readable.
      node.attrs = node.attrs.filter(a => !['style', 'role'].includes(a.name) && !a.name.startsWith('data-astro-cid'));
    } else {
      // Scoped page classes remain for the original tab behavior. Inline text
      // colours outside protected diagrams are supplied by the Review stylesheet.
      node.attrs = node.attrs.filter(a => a.name !== 'style' && a.name !== 'role');
    }
    if (node.tagName === 'img' && reviewAssets[attr(node, 'src')]) {
      set(node, 'data-original-src', attr(node, 'src'));
      set(node, 'src', reviewAssets[attr(node, 'src')]);
    }
    for (const paint of ['fill','stroke','color']) {
      if (/^(?:#fff(?:fff)?|white)$/i.test(attr(node, paint))) set(node, paint, '#1d293b');
    }
    if (node.tagName === 'a') {
      const href = attr(node, 'href');
      if (href) set(node, 'href', mapHref(href));
      if (!clean(node) && !attr(node, 'aria-label')) {
        const label = attr(node, 'title') || (href.startsWith('mailto:') ? 'Email' : href.includes('github.com') ? 'GitHub' : href.includes('linkedin.com') ? 'LinkedIn' : '');
        if (label) set(node, 'aria-label', label);
      }
      if (attr(node, 'download') || /\.pdf(?:\?|$)/i.test(href)) set(node, 'data-review-download', '');
    }
    if (home && node.tagName === 'button' && !attr(node, 'type')) set(node, 'type', 'button');
    if (node.tagName === 'h2') {
      const anchor = home ? section : (attr(node, 'id') || 'reading-' + (++headingIndex));
      if (!home) set(node, 'id', anchor);
      contents.push({ id: anchor, title: clean(node) });
    }
    // Remove only executable/presentation wrappers from the hydrated original.
    // The shared source's text, semantic markup and full tab panels stay intact.
    node.childNodes = (node.childNodes ?? []).flatMap(child => {
      // These contact shortcuts now live beside the CV in the Review rail.
      if (home && section === 'hero' && attr(child, 'class').split(' ').includes('hero-socials')) return [];
      // The Review rail owns the single CV link; keep other paper downloads.
      if (child.tagName === 'a' && attr(child, 'href') === resumeUrl) return [];
      if (['style', 'script', 'canvas', 'astro-island', 'astro-slot'].includes(child.tagName)) {
        if (child.tagName?.startsWith('astro-')) return child.childNodes ?? [];
        return [];
      }
      return [child];
    });
    for (const child of node.childNodes) { child.parentNode = node; visit(child, section); }
  }
  visit(source);
  let footerHtml = '';
  if (home) {
    const section = id => walk(source).find(n => attr(n, 'id') === id);
    const has = (n, c) => attr(n, 'class').split(' ').includes(c);
    // Replace the timeline's empty animation scaffolding with a normal list.
    // Axis years stay hidden in the shared content; role dates remain visible.
    const experience = section('experience');
    const cards = walk(experience).filter(n => has(n, 'rv-card'));
    const timeline = cards[0]?.parentNode;
    if (timeline) {
      add(timeline, 'rv-experience-list');
      for (const child of timeline.childNodes) {
        if (child.tagName && !has(child, 'rv-card')) set(child, 'hidden', '');
      }
    }
    const contact = section('contact');
    for (const link of walk(contact).filter(n => n.tagName === 'a')) add(link, 'rv-contact-link');
    const credits = walk(contact).find(n => n.tagName === 'div' && clean(n).startsWith('🎨 Vision & design by') && clean(n).length < 150);
    if (credits) {
      set(credits, 'data-review-source-footer', '');
      credits.parentNode.childNodes = credits.parentNode.childNodes.filter(n => n !== credits);
      footerHtml = serializeOuter(credits);
    }
  }
  return { html: serializeOuter(source), contents, footerHtml };
}
