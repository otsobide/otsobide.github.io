import { getCollection, type CollectionEntry } from 'astro:content';

export type ActivityEntry = CollectionEntry<'activities'>;

export const categoryLabels: Record<ActivityEntry['data']['category'], string> = {
  award: 'Award',
  talk: 'Talk',
  conference: 'Conference',
  publication: 'Publication',
  'research-stay': 'Research stay',
  competition: 'Competition',
  training: 'Training',
  event: 'Event',
  teaching: 'Teaching',
  other: 'Activity',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export interface ParsedDate {
  year: number;
  month: number; // 1-12
  day?: number;
}

export function parseDate(value: string): ParsedDate {
  const [y, m, d] = value.split('-').map(Number);
  return { year: y, month: m, day: d };
}

/** Sortable key; month-only dates sort as the end of the month. */
const sortKey = (d: ParsedDate) => d.year * 10000 + d.month * 100 + (d.day ?? 32);

export const monthKey = (d: ParsedDate) => `${d.year}-${String(d.month).padStart(2, '0')}`;
export const monthLabel = (d: ParsedDate) => `${MONTHS_LONG[d.month - 1]} ${d.year}`;
export const shortMonth = (d: ParsedDate) => `${MONTHS[d.month - 1]} ${d.year}`;

/** Human-readable date or range, e.g. "17–21 Mar 2026" or "Sep 2026". */
export function formatRange(start: ParsedDate, end?: ParsedDate): string {
  if (!start.day) return shortMonth(start);
  if (!end || !end.day) return `${start.day} ${shortMonth(start)}`;
  if (start.year === end.year && start.month === end.month) return `${start.day}–${end.day} ${shortMonth(start)}`;
  return `${start.day} ${MONTHS[start.month - 1]} – ${end.day} ${shortMonth(end)}`;
}

export async function getActivities(): Promise<ActivityEntry[]> {
  const items = await getCollection('activities');
  return items.sort((a, b) => sortKey(parseDate(b.data.date)) - sortKey(parseDate(a.data.date)));
}
