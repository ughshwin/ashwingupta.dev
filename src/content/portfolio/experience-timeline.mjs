import { localDate } from './selectors.mjs';

/** Date-derived chart bounds; keep four months of space after the latest entry. */
export function experienceTimelineBounds(entries, today = new Date()) {
  const starts = entries.map(entry => localDate(entry.start));
  const ends = entries.map(entry => entry.end === null ? today : localDate(entry.end));
  const earliest = new Date(Math.min(...starts.map(date => date.getTime()), today.getTime()));
  const latest = new Date(Math.max(...ends.map(date => date.getTime()), today.getTime()));
  const origin = new Date(earliest.getFullYear(), 0, 1);
  const axisEnd = new Date(latest.getFullYear(), latest.getMonth() + 4, 1);
  const yearMarks = Array.from(
    { length: axisEnd.getFullYear() - origin.getFullYear() + 1 },
    (_, index) => origin.getFullYear() + index,
  );
  return { origin, axisEnd, yearMarks };
}
