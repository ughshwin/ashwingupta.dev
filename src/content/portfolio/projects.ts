import data from './projects.json';
import details from './project-details.json';
import copySource from './copy/Projects.json';
import { portfolioAsset } from '../../lib/portfolio/assets';
import { projectById } from './catalog';
import { resolveCopy } from './copy';
export { projectCatalog, projectRoutes, projectById } from './catalog';

const copy = resolveCopy(copySource);
export type ProjectStatusTone = keyof typeof copy.statusLabels;
type ProjectDetails = {
  index: string;
  company: string;
  logo: string;
  logoHeight: number;
  statusTone: string;
  tags: string[];
  impact: string;
  summary: string[];
  bullets: string[];
};
const detailsById: Readonly<Record<string, ProjectDetails | undefined>> = resolveCopy(details);

function projectCard(id: string) {
  const record = detailsById[id];
  if (!record) throw new Error(`Missing portfolio project details: ${id}`);
  const statusTone = record.statusTone;
  if (statusTone !== 'award' && statusTone !== 'client' && statusTone !== 'completed' && statusTone !== 'development') {
    throw new Error(`Unknown portfolio project status tone: ${statusTone}`);
  }
  const identity = projectById(id);
  return {
    ...record,
    ...identity,
    slug: id,
    logo: portfolioAsset(record.logo),
    github: identity.github ?? null,
    statusTone,
    status: copy.statusLabels[statusTone],
    isAward: statusTone === 'award',
  };
}

export type Project = ReturnType<typeof projectCard>;
export const projectCards = data.cardOrder.map(projectCard);
export const secondaryProjectCards = data.secondaryCardOrder.map(projectCard);
