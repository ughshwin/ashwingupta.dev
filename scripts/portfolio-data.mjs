import fs from 'node:fs';
import { redirectRoutes, buildContentFacts } from '../src/content/portfolio/selectors.mjs';
import { resolveReferences } from '../src/content/portfolio/references.mjs';

const read = name => JSON.parse(fs.readFileSync(new URL(`../src/content/portfolio/${name}.json`, import.meta.url), 'utf8'));
const source = {profile:read('profile'),experience:read('experience'),projects:read('projects'),articles:read('articles'),kaggle:read('kaggle'),publications:read('publications'),chrome:read('chrome'),editorial:read('editorial')};
export const contentFacts = buildContentFacts({...source, projects:source.projects.entries});
export const profile = resolveReferences(contentFacts.profile, contentFacts);
export const experience = resolveReferences(source.experience, contentFacts);
export const currentEmployment = resolveReferences(contentFacts.currentEmployment, contentFacts);
export const projects = resolveReferences(source.projects, contentFacts);
export const projectRoutes = redirectRoutes(projects.entries);
export const articles = resolveReferences(contentFacts.articles, contentFacts);
export const publication = Object.fromEntries(Object.entries(articles).map(([id, a]) => [id, {datePublished:a.datePublished, source:a.source, ...(a.commit ? {commit:a.commit} : {})}]));

// One canonical static site. Preserve old bookmarks without serving duplicate designs.
const sectionIds = Object.keys(read('section-titles'));
const documents = ['/','/articles',...new Set(Object.values(projects.entries).filter(p=>p.href.startsWith('/')).map(p=>p.href)),...Object.values(articles).map(a=>'/articles/'+a.slug)];
const projectRedirects = Object.fromEntries(Object.entries(projectRoutes).map(([slug,to])=>['/projects/'+slug,to]));
export const siteRedirects = {
  '/research':'/projects', ...projectRedirects,
  ...Object.fromEntries([...documents,...sectionIds.map(id=>'/'+id)].map(to=>['/review'+(to==='/'?'':to),to])),
  ...Object.fromEntries(Object.entries(projectRedirects).map(([from,to])=>['/review'+from,to])),
  '/review/research':'/projects',
  ...Object.fromEntries(['/landing','/landing/split','/landing/editorial','/landing/signal','/editions','/editions/gazette','/editions/fieldnotes','/editions/review','/preview'].map(from=>[from,'/'])),
};
