import data from './achievements.json';
import kaggle from './kaggle.json';
import copySource from './copy/About.json';
import { resolveCopy } from './copy';
import { portfolioAsset } from '../../lib/portfolio/assets';
import { formatKaggleCount } from '../../lib/kaggle-stats';

const copy = resolveCopy(copySource);
const records = resolveCopy(data);

export type Achievement = {
  id: string;
  title: string;
  sub: string;
  icon: string;
  time: string;
};

export function formatAchievementMetrics(counts: { downloads: number; views: number }) {
  return copy.kaggleMetricsTemplate
    .replaceAll('{downloads}', formatKaggleCount(counts.downloads))
    .replaceAll('{views}', formatKaggleCount(counts.views));
}

/** Keep recorded and live award views on the same content and formatting path. */
export function getAchievements(counts = kaggle.recordedCounts): Achievement[] {
  return records.map(item => ({
    id: item.id,
    title: item.live === 'kaggle'
      ? formatAchievementMetrics(counts)
      : item.title!,
    sub: item.live === 'kaggle' ? kaggle.datasetName : item.sub!,
    icon: portfolioAsset(item.icon),
    time: item.time,
  }));
}

export const achievements = getAchievements();
