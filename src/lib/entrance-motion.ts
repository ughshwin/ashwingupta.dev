export const ASSEMBLY_MS = 3600;
export const RELEASE_MS = 1800;

export function smoothstep(value: number): number {
  const t = Math.max(0, Math.min(1, value));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// Integral of a soft outward impulse. Its velocity starts at zero, builds,
// and decays; displacement never reverses direction like a sine pulse does.
export function impulseDistance(seconds: number, decay: number): number {
  const t = Math.max(0, seconds) / decay;
  return decay * (1 - (1 + t) * Math.exp(-t));
}

export function momentumDistance(seconds: number, decay: number): number {
  return decay * (1 - Math.exp(-Math.max(0, seconds) / decay));
}
