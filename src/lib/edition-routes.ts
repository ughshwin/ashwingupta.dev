import { chromeCopy } from '../content/portfolio/chrome';
import { siteOrigin } from '../content/portfolio/profile';
import sectionTitles from '../content/portfolio/section-titles.json';
import { projectRoutes, projectCatalog } from '../content/portfolio/catalog';
import { articleIndex } from '../content/portfolio/articles';

export const REVIEW_ROOT = chromeCopy.routes.review;
export const sectionIds = Object.keys(sectionTitles);
export const documentPaths = [
  chromeCopy.routes.home, chromeCopy.routes.articles, ...new Set(Object.values(projectCatalog).filter(project => project.href.startsWith('/')).map(project => project.href)),
  ...articleIndex.map(article => article.href),
];
export const logicalPaths = new Set([
  ...documentPaths, ...sectionIds.map(s => '/' + s), chromeCopy.routes.research,
  ...Object.keys(projectRoutes).map(s => chromeCopy.routes.projectAlias + s),
]);

export function originalPath(path: string) {
  return path === REVIEW_ROOT || path === REVIEW_ROOT + '/' ? '/' : path.replace(/^\/review(?=\/)/, '');
}

export function editionHref(href: string, review = false, current = '/') {
  if (!href || /^(mailto:|tel:|data:|javascript:)/i.test(href)) return href;
  const base = siteOrigin;
  const url = new URL(href, base + current);
  if (![base, base.replace('://www.', '://')].includes(url.origin)) return href;
  const path = originalPath(url.pathname.replace(/\/$/, '') || '/');
  if (!logicalPaths.has(path)) return href;
  return (review ? REVIEW_ROOT + (path === '/' ? '' : path) : path) + url.search + url.hash;
}
