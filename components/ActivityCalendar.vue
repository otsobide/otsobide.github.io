<script setup lang="ts">
import { MONTHS, type CalendarEvent } from '~/utils/activities'

/*
 * Month calendar plus a year-by-month activity overview for /activities.
 * The page owns the state: it passes the (filtered) events, which ids to mark,
 * and the visible month (v-model:view); clicks are reported back as events.
 */
const props = defineProps<{
  events: CalendarEvent[]
  /** Activity ids to mark (hovered or focused cards in the feed). */
  marked: string[]
}>()
const view = defineModel<{ year: number, month: number }>('view', { required: true })
const emit = defineEmits<{
  select: [ids: string[]]
  gotoMonth: [year: number, month: number]
}>()

const DAY = 86_400_000
const pad = (n: number) => String(n).padStart(2, '0')
const ymd = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`

/** Every day each event covers, every month it touches, and which ones are long stays. */
const index = computed(() => {
  const byDay = new Map<string, CalendarEvent[]>()
  const byMonth = new Map<string, CalendarEvent[]>()
  const long = new Set<string>()
  const addMonth = (key: string, e: CalendarEvent) => {
    const list = byMonth.get(key) ?? []
    if (!list.includes(e)) byMonth.set(key, [...list, e])
  }
  for (const e of props.events) {
    const { year, month, day } = e.start
    if (!day) {
      addMonth(`${year}-${pad(month)}`, e)
      continue
    }
    const from = Date.UTC(year, month - 1, day)
    const to = e.end?.day ? Date.UTC(e.end.year, e.end.month - 1, e.end.day) : from
    if (to - from > 7 * DAY) long.add(e.id)
    for (let t = from; t <= to; t += DAY) {
      const d = new Date(t)
      const key = ymd(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate())
      byDay.set(key, [...(byDay.get(key) ?? []), e])
      addMonth(key.slice(0, 7), e)
    }
  }
  return { byDay, byMonth, long }
})

// Set after mount so the server render and hydration agree.
const today = ref<string | null>(null)
onMounted(() => {
  const now = new Date()
  today.value = ymd(now.getFullYear(), now.getMonth() + 1, now.getDate())
})

interface DayCell {
  day: number
  key: string
  events: CalendarEvent[]
  /** Category that colours the cell: short events win over long stays. */
  category?: string
  classes: string[]
}

const cells = computed<(DayCell | null)[]>(() => {
  const { year, month } = view.value
  const { byDay, long } = index.value
  const offset = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7 // Monday first
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const out: (DayCell | null)[] = Array.from({ length: offset }, () => null)

  for (let d = 1; d <= days; d++) {
    const key = ymd(year, month, d)
    const events = byDay.get(key) ?? []
    const classes: string[] = []
    if (key === today.value) classes.push('today')
    if (!events.length) {
      out.push({ day: d, key, events, classes })
      continue
    }
    const shares = (k: string) => (byDay.get(k) ?? []).some((e) => events.includes(e))
    const prev = shares(ymd(year, month, d - 1))
    const next = shares(ymd(year, month, d + 1))
    const ordered = [...events].sort((a, b) => Number(long.has(a.id)) - Number(long.has(b.id)))
    classes.push('has-event')
    if (events.every((e) => long.has(e.id))) classes.push('long')
    if (prev || next) classes.push('range')
    if (!prev) classes.push('range-start')
    if (!next) classes.push('range-end')
    if (new Set(events.map((e) => e.category)).size > 1) classes.push('multi')
    if (events.some((e) => props.marked.includes(e.id))) classes.push('marked')
    out.push({ day: d, key, events: ordered, category: ordered[0].category, classes })
  }
  return out
})

const monthEvents = computed(() => index.value.byMonth.get(`${view.value.year}-${pad(view.value.month)}`) ?? [])

/** One row per year (newest first) with twelve cells shaded by how much happened. */
const overview = computed(() => {
  const years = props.events.map((e) => e.start.year)
  const max = Math.max(...years, view.value.year)
  const min = Math.min(...years, view.value.year)
  const rows = []
  for (let year = max; year >= min; year--) {
    rows.push({
      year,
      months: MONTHS.map((name, i) => {
        const count = index.value.byMonth.get(`${year}-${pad(i + 1)}`)?.length ?? 0
        return { month: i + 1, name, count, level: Math.min(count, 3) }
      }),
    })
  }
  return rows
})

const go = (delta: number) => {
  let { year, month } = view.value
  month += delta
  if (month < 1) {
    month = 12
    year--
  }
  if (month > 12) {
    month = 1
    year++
  }
  view.value = { year, month }
}

const pickMonth = (year: number, month: number) => {
  view.value = { year, month }
  emit('gotoMonth', year, month)
}
</script>

<template>
  <aside class="space-y-4" aria-label="Activity calendar" data-activity-calendar>
    <div class="rounded-xl border hairline surface-tint p-4">
      <div class="flex items-center justify-between mb-3">
        <button type="button" class="nav-btn" aria-label="Previous month" @click="go(-1)">‹</button>
        <span class="font-serif text-xl text-ink" aria-live="polite">{{ MONTHS[view.month - 1] }} {{ view.year }}</span>
        <button type="button" class="nav-btn" aria-label="Next month" @click="go(1)">›</button>
      </div>

      <div class="grid grid-cols-7 text-center text-[10px] font-mono uppercase tracking-wider muted mb-1" aria-hidden="true">
        <span v-for="d in ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']" :key="d">{{ d }}</span>
      </div>
      <div class="grid grid-cols-7 gap-y-1 text-center">
        <template v-for="(cell, i) in cells" :key="cell?.key ?? `pad-${i}`">
          <span v-if="!cell" />
          <button
            v-else-if="cell.events.length"
            type="button"
            class="day"
            :class="cell.classes"
            :data-cat="cell.category"
            :title="cell.events.map((e) => e.title).join('\n')"
            :aria-label="`${cell.day} ${MONTHS[view.month - 1]}: ${cell.events.map((e) => e.title).join(', ')}`"
            @click="emit('select', cell.events.map((e) => e.id))"
          >
            {{ cell.day }}
          </button>
          <span v-else class="day" :class="cell.classes">{{ cell.day }}</span>
        </template>
      </div>

      <ul class="mt-4 pt-3 border-t hairline space-y-0.5">
        <li v-if="!monthEvents.length" class="text-sm muted italic px-1.5 py-1">Nothing this month.</li>
        <li v-for="e in monthEvents" :key="e.id">
          <button
            type="button"
            class="month-event"
            :class="{ marked: marked.includes(e.id) }"
            :data-cat="e.category"
            @click="emit('select', [e.id])"
          >
            <span class="dot" />
            <span class="w-5 shrink-0 font-mono text-xs accent-text">
              {{ e.start.day && e.start.year === view.year && e.start.month === view.month ? e.start.day : '·' }}
            </span>
            <span class="text-left">{{ e.title }}</span>
          </button>
        </li>
      </ul>
    </div>

    <div class="rounded-xl border hairline surface-tint p-4">
      <p class="eyebrow mb-3">Activity</p>
      <div class="space-y-1.5">
        <div v-for="row in overview" :key="row.year" class="flex items-center gap-2.5">
          <span class="w-9 text-xs font-mono muted">{{ row.year }}</span>
          <div class="flex-1 grid grid-cols-12 gap-[3px]">
            <button
              v-for="m in row.months"
              :key="m.month"
              type="button"
              class="overview-month"
              :class="[`level-${m.level}`, { current: row.year === view.year && m.month === view.month }]"
              :title="`${m.name} ${row.year}${m.count ? ` · ${m.count} ${m.count === 1 ? 'entry' : 'entries'}` : ''}`"
              @click="pickMonth(row.year, m.month)"
            >
              {{ m.name[0] }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.nav-btn {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid rgb(var(--border));
  border-radius: 999px;
  font-size: 1.1rem;
  line-height: 1;
  color: rgb(var(--fg-soft));
  transition: color 0.2s ease, border-color 0.2s ease;
}
.nav-btn:hover {
  color: rgb(var(--accent));
  border-color: rgb(var(--accent));
}

/* ----- days ----- */
.day {
  display: grid;
  place-items: center;
  justify-self: center;
  width: 100%;
  max-width: 2.4rem;
  height: 2rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
  color: rgb(var(--fg-soft));
}
.day.today {
  box-shadow: inset 0 0 0 1px rgb(var(--border-strong));
}
.day.has-event {
  position: relative;
  font-weight: 600;
  color: #fff;
  background-color: rgb(var(--cat));
  cursor: pointer;
  transition: filter 0.2s ease;
}
.day.has-event:hover {
  filter: brightness(0.9);
}
/* Consecutive days of the same event join into a band. */
.day.range {
  max-width: none;
  border-radius: 0;
}
.day.range.range-start { border-radius: 999px 0 0 999px; }
.day.range.range-end { border-radius: 0 999px 999px 0; }
.day.range.range-start.range-end { border-radius: 999px; }
/* Long stays (more than a week) get a quiet tint instead of a solid fill. */
.day.long {
  font-weight: 500;
  color: var(--cat-fg);
  background-color: rgb(var(--cat) / 0.16);
}
/* Several kinds of activity on the same day. */
.day.multi::after {
  content: '';
  position: absolute;
  top: 2px;
  right: 2px;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background-color: rgb(var(--bg));
  box-shadow: 0 0 0 1.5px rgb(var(--cat));
}
.day.marked {
  color: #fff;
  background-color: rgb(var(--cat));
  box-shadow: 0 0 0 2px rgb(var(--bg-tint)), 0 0 0 3.5px rgb(var(--cat));
}
.day.marked.range {
  box-shadow: none;
  filter: brightness(0.85);
}

/* ----- this month's list ----- */
.month-event {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  width: 100%;
  padding: 0.3rem 0.4rem;
  border-radius: 4px;
  font-size: 0.85rem;
  line-height: 1.4;
  color: rgb(var(--fg-soft));
  transition: background-color 0.2s ease, color 0.2s ease;
}
.month-event:hover,
.month-event.marked {
  color: var(--cat-fg);
  background-color: rgb(var(--cat) / 0.1);
}
.month-event .dot {
  flex-shrink: 0;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background-color: rgb(var(--cat));
  transform: translateY(-1px);
}

/* ----- year overview ----- */
.overview-month {
  aspect-ratio: 1;
  width: 100%;
  max-width: 1.6rem;
  justify-self: center;
  border-radius: 3px;
  font-size: 0.55rem;
  font-family: 'JetBrains Mono', monospace;
  color: rgb(var(--fg-mute));
  background-color: rgb(var(--bg-soft));
  transition: box-shadow 0.2s ease;
}
.overview-month.level-1 { color: rgb(var(--accent)); background-color: rgb(var(--accent) / 0.25); }
.overview-month.level-2 { color: rgb(var(--on-accent)); background-color: rgb(var(--accent) / 0.6); }
.overview-month.level-3 { color: rgb(var(--on-accent)); background-color: rgb(var(--accent)); }
.overview-month:hover,
.overview-month.current {
  box-shadow: 0 0 0 1.5px rgb(var(--bg-tint)), 0 0 0 3px rgb(var(--accent));
}
</style>
