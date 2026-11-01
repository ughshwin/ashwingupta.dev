import data from './profile.json';
import { currentEmployment, experienceRecords } from './experience';
import { resolveReferences } from './references.mjs';
import { profileIdentity } from './selectors.mjs';
import { resolveCopy } from './copy';

export const profile = profileIdentity(resolveCopy(data));
export const siteOrigin = new URL(profile.siteUrl).origin;
export const socialImage = new URL(profile.socialImagePath, profile.siteUrl).href;
export const siteTitle = resolveReferences(profile.titleTemplate, {profile,currentEmployment}) as string;
export const siteDescription = resolveReferences(profile.descriptionTemplate, {profile,currentEmployment}) as string;
export const schemaEmployment = profile.schemaEmploymentIds.map(id => {
  const entry = experienceRecords.find(e => e.id === id);
  if (!entry) throw new Error(`Unknown schema employment: ${id}`);
  return entry;
});
export const alumni = profile.alumniIds.map(id => {
  const entry = experienceRecords.find(e => e.id === id);
  if (!entry) throw new Error(`Unknown education: ${id}`);
  return entry;
});
