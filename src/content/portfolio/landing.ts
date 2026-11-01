import source from './landing.json';
import { resolveCopy } from './copy';

export const landing = resolveCopy(source);
export type LandingSample = typeof landing.samples[number];
export type LandingMode = typeof landing.modes[number];
