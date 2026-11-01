import profile from './profile.json';
import projects from './projects.json';
import articles from './articles.json';
import experience from './experience.json';
import kaggle from './kaggle.json';
import publications from './publications.json';
import chrome from './chrome.json';
import editorial from './editorial.json';
import { buildContentFacts } from './selectors.mjs';
import { resolveReferences } from './references.mjs';

const facts = buildContentFacts({profile, experience, projects: projects.entries, articles, kaggle, publications, chrome, editorial});
/** Preserve each document's inferred shape while resolving shared identity facts. */
export function resolveCopy<T>(content: T): T {
  return resolveReferences(content, facts) as T;
}
