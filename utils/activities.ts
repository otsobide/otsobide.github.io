import type { ParsedContent } from '@nuxt/content'

/** Labels for each activity category; colours live in assets/css/main.css ([data-cat]). */
export const activityCategories = {
  'publication': 'Publication',
  'conference': 'Conference',
  'talk': 'Talk',
  'award': 'Award',
  'research-stay': 'Research stay',
  'competition': 'Competition',
  'training': 'Training',
  'event': 'Event',
  'teaching': 'Teaching',
  'other': 'Update',
} as const

export type ActivityCategory = keyof typeof activityCategories

/** Frontmatter of content/activities/*.md; the markdown body is the detailed text. */
export interface Activity extends ParsedContent {
  title: string
  /** One line for the home page cards. */
  summary?: string
  /** "YYYY-MM-DD", or "YYYY-MM" when the exact day does not matter. */
  date: string
  /** Last day of multi-day events ("YYYY-MM-DD"). */
  endDate?: string
  category: ActivityCategory
  location?: string
  links?: { label: string, href: string }[]
  /** File names of related publications, e.g. "2025-esorics-digital-twin". */
  publications?: string[]
}

export interface DateParts {
  year: number
  month: number // 1-12
  day?: number
}

export interface CalendarEvent {
  id: string
  title: string
  category: ActivityCategory
  start: DateParts
  end?: DateParts
}

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/** Accepts "YYYY-MM", "YYYY-MM-DD" or an ISO timestamp (YAML turns plain dates into Dates). */
export function parseActivityDate(value: string | Date): DateParts {
  const text = value instanceof Date ? value.toISOString() : String(value)
  const [, y, m, d] = text.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/) ?? []
  return { year: Number(y), month: Number(m), day: d ? Number(d) : undefined }
}

/** Anchor id on /activities (the markdown file name). */
export const activityId = (activity: Pick<Activity, '_path'>) => activity._path?.split('/').pop() ?? ''

export const monthKey = (d: DateParts) => `${d.year}-${String(d.month).padStart(2, '0')}`
export const monthLabel = (d: DateParts) => `${MONTHS[d.month - 1]} ${d.year}`
const shortMonth = (d: DateParts) => `${MONTHS[d.month - 1].slice(0, 3)} ${d.year}`

/** Human-readable date or range, e.g. "6–8 May 2026", "28 Apr – 2 May 2026" or "Sep 2026". */
export function formatActivityRange(start: DateParts, end?: DateParts): string {
  if (!start.day) return shortMonth(start)
  if (!end?.day) return `${start.day} ${shortMonth(start)}`
  if (start.year === end.year && start.month === end.month) return `${start.day}–${end.day} ${shortMonth(start)}`
  return `${start.day} ${MONTHS[start.month - 1].slice(0, 3)} – ${end.day} ${shortMonth(end)}`
}

/** Month-only dates sort as the end of their month. */
const sortKey = (d: DateParts) => d.year * 10000 + d.month * 100 + (d.day ?? 32)

/** Newest first. */
export const sortActivities = <T extends Activity>(items: T[]) =>
  [...items].sort((a, b) => sortKey(parseActivityDate(b.date)) - sortKey(parseActivityDate(a.date)))
