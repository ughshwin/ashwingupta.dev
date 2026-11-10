import source from './featured.json';
import copySource from './copy/Featured.json';
import { projectById } from './catalog';
import { resolveCopy } from './copy';

export type FeaturedType = 'production' | 'patent' | 'development' | 'thesis' | 'open-source';

export type FeaturedItem = {
  projectId: string;
  type: FeaturedType;
  name: string;
  title: string;
  subtitle: string;
  link: string;
  secondaryBadge?: string;
  bullets: string[];
};

function featuredType(value: string): FeaturedType {
  switch (value) {
    case 'production':
    case 'patent':
    case 'development':
    case 'thesis':
    case 'open-source':
      return value;
    default:
      throw new Error(`Unknown featured presentation type: ${value}`);
  }
}

export const featuredCopy = resolveCopy(copySource);

/** Join section narratives to canonical project identity without duplicating it. */
export const featuredItems: FeaturedItem[] = resolveCopy(source).map(item => {
  const project = projectById(item.projectId);
  if (item.bullets.length !== featuredCopy.stageLabels.length) {
    throw new Error(`Featured project ${item.projectId} must supply one bullet per narrative stage.`);
  }
  return {
    ...item,
    type: featuredType(item.type),
    name: project.displayName,
    link: project.href,
  };
});
