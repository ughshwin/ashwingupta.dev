import data from './projects.json';
import { resolveCopy } from './copy';

export type ProjectIdentity = {
  title: string; displayName: string; shortName?: string; currentLabel?: string;
  href: string; github?: string | null; redirect?: boolean;
  whitepaperUrl?: string; publicationUrl?: string; metrics?: Record<string, string>;
};
export type ProjectId = keyof typeof data.entries;
export const projectCatalog = resolveCopy(data.entries) satisfies Record<string, ProjectIdentity>;
const identities: Readonly<Record<string, ProjectIdentity | undefined>> = projectCatalog;
export const projectRoutes = Object.fromEntries(
  Object.entries<ProjectIdentity>(projectCatalog)
    .filter(([, project]) => project.redirect)
    .map(([id, project]) => [id, project.href]),
);
export function projectById(id: string): ProjectIdentity {
  const project = identities[id];
  if (!project) throw new Error(`Unknown portfolio project: ${id}`);
  return project;
}
