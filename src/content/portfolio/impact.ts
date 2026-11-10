import copySource from './copy/Impact.json';
import type { KaggleStatsSnapshot } from '../../lib/kaggle-stats';
import data from './impact.json';
import kaggle from './kaggle.json';
import { projectById } from './catalog';
import { resolveCopy } from './copy';
import { formatKaggleCount, KAGGLE_DATASET_URL } from '../../lib/kaggle-stats';

export type ImpactCategory = keyof typeof data.categories;
export type Impact = {
  value: string; result?: string; label: string; item: string; category: ImpactCategory;
  magnitude: 1 | 2 | 3 | 4 | 5; href?: string; projectId?: string;
  liveStat?: 'downloads' | 'views';
};
export const impactCategories = resolveCopy(data.categories);
export const CATEGORY_ORDER = data.order as ImpactCategory[];
export const impacts: Impact[] = resolveCopy(data.entries).map(raw => {
  const entry = raw as unknown as Impact;
  const project = entry.projectId ? projectById(entry.projectId) : null;
  return {
    ...entry,
    item: project?.displayName || (entry.liveStat ? kaggle.datasetName : entry.item),
    href: project?.href || (entry.liveStat ? KAGGLE_DATASET_URL : entry.href),
    value: entry.liveStat ? formatKaggleCount(kaggle.recordedCounts[entry.liveStat]) : entry.value,
  };
});

const impactCopy = resolveCopy(copySource);

export function getKaggleFreshness({ stats, status }: KaggleStatsSnapshot) {
  return {
    label: status === 'live' ? impactCopy.freshness.live : impactCopy.freshness.recorded,
    live: status === 'live',
    detail: stats
      ? `${impactCopy.freshness.checked_at.replace('{checkedAt}', new Date(stats.checkedAt).toLocaleTimeString('en-US'))} ${status === 'live' ? impactCopy.freshness.live_detail : impactCopy.freshness.stale_detail}`
      : impactCopy.freshness.recorded_detail,
  };
}
