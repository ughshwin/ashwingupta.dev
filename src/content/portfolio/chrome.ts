import source from './chrome.json';
import { resolveCopy } from './copy';

export const chromeCopy = resolveCopy(source);

/** Insert runtime measurements into authored interface wording. */
export function formatChrome(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key) => String(values[key] ?? match));
}
