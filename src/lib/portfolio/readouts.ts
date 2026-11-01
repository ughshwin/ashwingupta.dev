// Both editions display the same live values with the original formatting.
export function fmtElapsed(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${String(h).padStart(2, '0')}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function fmtCoord(n: number) {
  const fixed = n.toFixed(4);
  return (parseFloat(fixed) > 0 ? '+' : '') + fixed;
}
