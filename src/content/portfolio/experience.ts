import records from './experience.json';
import { resolveCopy } from './copy';
import { selectCurrentEmployment } from './selectors.mjs';

export type ExperienceRecord = {
  id: string;
  track: 'professional' | 'education';
  role: string;
  company: string;
  start: string;
  end: string | null;
  bullets: string[];
  status?: 'completed' | 'ongoing';
};
export const experienceRecords = resolveCopy(records) as ExperienceRecord[];
export const currentEmployment = selectCurrentEmployment(experienceRecords) as ExperienceRecord;
