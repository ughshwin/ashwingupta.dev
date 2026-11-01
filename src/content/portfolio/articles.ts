import records from './articles.json';
import profile from './profile.json';
import { selectArticles } from './selectors.mjs';
import { resolveCopy } from './copy';

export const articleCatalog = resolveCopy(selectArticles(records, profile));
export const articleIndex = Object.values(articleCatalog);
export const articlePublication = Object.fromEntries(Object.entries(articleCatalog).map(([slug, article]) => [slug, {
  datePublished: article.datePublished,
  source: article.source,
  ...('commit' in article ? { commit: article.commit } : {}),
}])) as Record<string, { datePublished: string; source: string; commit?: string }>;
