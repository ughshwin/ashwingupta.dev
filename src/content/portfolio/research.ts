import source from './research.json';
import copySource from './copy/Research.json';
import { projectById } from './catalog';
import { resolveCopy } from './copy';

export type ResearchType = 'paper' | 'whitepaper' | 'github' | 'commercial';

export type ResearchItem = {
  projectId: string;
  type: ResearchType;
  name: string;
  title: string;
  subtitle?: string;
  link: string;
  bullets: string[];
};

function researchType(value: string): ResearchType {
  switch (value) {
    case 'paper':
    case 'whitepaper':
    case 'github':
    case 'commercial':
      return value;
    default:
      throw new Error(`Unknown research presentation type: ${value}`);
  }
}

export const researchCopy = resolveCopy(copySource);

/** Join section narratives to canonical identities while preserving card copy. */
export const researchItems: ResearchItem[] = resolveCopy(source).map(item => {
  const project = projectById(item.projectId);
  if (item.bullets.length !== researchCopy.stageLabels.length) {
    throw new Error(`Research project ${item.projectId} must supply one bullet per narrative stage.`);
  }
  return {
    ...item,
    type: researchType(item.type),
    name: project.displayName,
    link: project.href,
  };
});
