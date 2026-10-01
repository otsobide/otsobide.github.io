<script setup lang="ts">
import {
  activityCategories,
  activityId,
  formatActivityRange,
  monthKey,
  monthLabel,
  MONTHS,
  parseActivityDate,
  sortActivities,
  type Activity,
  type ActivityCategory,
  type CalendarEvent,
} from '~/utils/activities'
import { publicationId, publicationLabel, type Publication } from '~/utils/publications'

usePageMeta({
  title: 'Activities',
  description: 'Talks, conferences, publications, awards and research stays of Javier Parada, month by month.',
})

const { data } = await useAsyncData('activities', () => queryContent<Activity>('/activities').find())
const { data: pubs } = await useAsyncData('activity-publications', () =>
  queryContent<Publication>('/publications').only(['_path', 'abbr', 'title', 'year']).find(),
)

const activities = computed(() =>
  sortActivities(data.value ?? []).map((a) => ({
    ...a,
    id: activityId(a),
    start: parseActivityDate(a.date),
    end: a.endDate ? parseActivityDate(a.endDate) : undefined,
  })),
)
type Item = (typeof activities.value)[number]

const pubLabels = computed(() => new Map((pubs.value ?? []).map((p) => [publicationId(p), publicationLabel(p)])))

// ----- category filter -----
const selectedCats = ref<ActivityCategory[]>([])
const categories = computed(() =>
  (Object.keys(activityCategories) as ActivityCategory[])
    .map((key) => ({ key, label: activityCategories[key], count: activities.value.filter((a) => a.category === key).length }))
    .filter((c) => c.count > 0),
)
const matches = (a: Item) => selectedCats.value.length === 0 || selectedCats.value.includes(a.category)

const toggleCategory = (key: ActivityCategory | null) => {
  if (key === null) selectedCats.value = []
  else if (selectedCats.value.includes(key)) selectedCats.value = selectedCats.value.filter((k) => k !== key)
  else selectedCats.value = [...selectedCats.value, key]
  clearFocus()
}

// ----- year → month → entries (newest first; activities are already sorted) -----
const years = computed(() => {
  const out: { year: number, months: { key: string, label: string, entries: Item[] }[] }[] = []
  for (const a of activities.value) {
    let y = out.find((g) => g.year === a.start.year)
    if (!y) out.push((y = { year: a.start.year, months: [] }))
    const key = monthKey(a.start)
    let m = y.months.find((g) => g.key === key)
    if (!m) y.months.push((m = { key, label: monthLabel(a.start), entries: [] }))
    m.entries.push(a)
  }
  return out
})
const visibleIn = (y: (typeof years.value)[number]) => y.months.reduce((n, m) => n + m.entries.filter(matches).length, 0)

const latest = activities.value[0]?.start
const activeYear = ref(latest?.year ?? new Date().getFullYear())
const view = ref({ year: latest?.year ?? new Date().getFullYear(), month: latest?.month ?? 1 })

// ----- calendar ↔ feed -----
const focused = ref<string[]>([])
const hovered = ref<string | null>(null)
const feed = ref<HTMLElement | null>(null)

const calendarEvents = computed<CalendarEvent[]>(() =>
  activities.value.filter(matches).map((a) => ({ id: a.id, title: a.title, category: a.category, start: a.start, end: a.end })),
)
const marked = computed(() => (hovered.value ? [hovered.value, ...focused.value] : focused.value))

function clearFocus() {
  focused.value = []
}

function selectYear(year: number) {
  activeYear.value = year
  const newest = years.value.find((y) => y.year === year)?.months[0]?.entries[0]?.start
  if (newest) view.value = { year, month: newest.month }
  clearFocus()
}

/** Show the picked cards: switch to their year, scroll to the first one and dim the rest. */
async function focusCards(ids: string[]) {
  const targets = ids
    .map((id) => activities.value.find((a) => a.id === id))
    .filter((a): a is Item => !!a && matches(a))
  const first = targets[0]
  if (!first) return
  activeYear.value = first.start.year
  view.value = { year: first.start.year, month: first.start.month }
  focused.value = targets.map((t) => t.id)
  await nextTick()
  const el = document.getElementById(first.id)
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  el?.focus({ preventScroll: true })
  history.replaceState(history.state, '', `#${first.id}`)
}

function gotoMonth(year: number, month: number) {
  if (years.value.some((y) => y.year === year)) activeYear.value = year
  clearFocus()
  nextTick(() => {
    document.getElementById(`m-${year}-${String(month).padStart(2, '0')}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

// Paging the calendar into another year that has entries switches the tab too.
watch(() => view.value.year, (year) => {
  if (year !== activeYear.value && years.value.some((y) => y.year === year)) {
    activeYear.value = year
    clearFocus()
  }
})

// Hovering a card shows its month in the calendar.
watch(hovered, (id) => {
  const a = id ? activities.value.find((x) => x.id === id) : undefined
  if (a && (a.start.year !== view.value.year || a.start.month !== view.value.month)) {
    view.value = { year: a.start.year, month: a.start.month }
  }
})

onMounted(() => {
  // Clicking outside the focused cards and the calendar, or pressing Esc, clears the focus.
  useEventListener(document, 'click', (ev) => {
    if (!focused.value.length) return
    const target = ev.target as HTMLElement
    if (target.closest('.activity-entry.is-focused, [data-activity-calendar]')) return
    clearFocus()
  })
  onKeyStroke('Escape', clearFocus)

  // Follow the reader: show the month whose entries are on screen.
  const io = new IntersectionObserver(
    (entries) => {
      if (hovered.value || focused.value.length) return
      const mk = (entries.find((e) => e.isIntersecting)?.target as HTMLElement | undefined)?.dataset.month
      if (!mk) return
      const [year, month] = mk.split('-').map(Number)
      if (year !== view.value.year || month !== view.value.month) view.value = { year, month }
    },
    { rootMargin: '-20% 0px -65% 0px' },
  )
  feed.value?.querySelectorAll('[data-month]').forEach((el) => io.observe(el))
  onUnmounted(() => io.disconnect())
})

// Deep links (e.g. from the home page cards): open the right year and point at the card.
// Waits for hydration, which briefly rewrites the URL without its hash when the host
// redirected /activities to /activities/ (as GitHub Pages does).
onNuxtReady(() => {
  const id = decodeURIComponent(window.location.hash.slice(1))
  if (id && activities.value.some((a) => a.id === id)) focusCards([id])
})
</script>

<template>
  <div class="space-y-12">
    <header class="space-y-3 border-b hairline pb-6">
      <span class="eyebrow">Month by month</span>
      <h1>Activities</h1>
      <p class="soft max-w-prose">
        Talks, conferences, publications, awards and research stays. Pick a year, filter by type,
        or use the calendar to jump to any entry.
      </p>
    </header>

    <div class="grid grid-cols-1 gap-10 lg:grid-cols-[16.5rem_1fr] lg:items-start">
      <div class="w-full max-w-sm mx-auto lg:max-w-none lg:sticky lg:top-24">
        <ActivityCalendar
          v-model:view="view"
          :events="calendarEvents"
          :marked="marked"
          @select="focusCards"
          @goto-month="gotoMonth"
        />
      </div>

      <div ref="feed" class="min-w-0 space-y-8" :class="{ 'has-focus': focused.length }">
        <div v-if="categories.length > 1" class="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
          <button type="button" class="chip" :aria-pressed="selectedCats.length === 0" @click="toggleCategory(null)">
            All · {{ activities.length }}
          </button>
          <button
            v-for="c in categories"
            :key="c.key"
            type="button"
            class="chip"
            :data-cat="c.key"
            :aria-pressed="selectedCats.includes(c.key)"
            @click="toggleCategory(c.key)"
          >
            <span class="w-2 h-2 rounded-full bg-[rgb(var(--cat))]" aria-hidden="true" />
            {{ c.label }} · {{ c.count }}
          </button>
        </div>

        <div v-if="years.length" class="flex flex-wrap gap-1 border-b hairline" role="tablist" aria-label="Year">
          <button
            v-for="y in years"
            :id="`tab-${y.year}`"
            :key="y.year"
            type="button"
            role="tab"
            class="year-tab"
            :class="{ empty: visibleIn(y) === 0 }"
            :aria-selected="y.year === activeYear"
            :aria-controls="`year-${y.year}`"
            @click="selectYear(y.year)"
          >
            <span class="font-serif text-3xl leading-none">{{ y.year }}</span>
            <span class="font-mono text-[10px] muted">{{ visibleIn(y) }}</span>
          </button>
        </div>

        <section
          v-for="y in years"
          v-show="y.year === activeYear"
          :id="`year-${y.year}`"
          :key="y.year"
          role="tabpanel"
          :aria-labelledby="`tab-${y.year}`"
          class="space-y-10"
        >
          <p v-if="visibleIn(y) === 0" class="muted italic">No activities of the selected types in {{ y.year }}.</p>

          <div
            v-for="m in y.months"
            v-show="m.entries.some(matches)"
            :id="`m-${m.key}`"
            :key="m.key"
            :data-month="m.key"
            class="space-y-4 scroll-mt-24"
          >
            <h3 class="eyebrow !text-[11px] !leading-normal !font-normal">{{ m.label }}</h3>
            <ol class="space-y-4">
              <li
                v-for="a in m.entries"
                v-show="matches(a)"
                :id="a.id"
                :key="a.id"
                tabindex="-1"
                :data-cat="a.category"
                class="activity-entry card-warm grid grid-cols-[3.25rem_1fr] gap-4 p-5 scroll-mt-28 outline-none"
                :class="{ 'is-focused': focused.includes(a.id) }"
                @mouseenter="hovered = a.id"
                @mouseleave="hovered = null"
              >
                <div class="date-badge" aria-hidden="true">
                  <template v-if="a.start.day">
                    <span class="font-serif text-2xl leading-none">{{ a.start.day }}</span>
                    <span class="font-mono text-[9px] uppercase tracking-wider">{{ MONTHS[a.start.month - 1].slice(0, 3) }}</span>
                  </template>
                  <template v-else>
                    <span class="font-mono text-xs uppercase">{{ MONTHS[a.start.month - 1].slice(0, 3) }}</span>
                    <span class="font-mono text-[9px]">{{ a.start.year }}</span>
                  </template>
                </div>
                <article class="min-w-0 space-y-2">
                  <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs muted">
                    <span class="cat-label">{{ activityCategories[a.category] }}</span>
                    <time :datetime="String(a.date).slice(0, 10)">{{ formatActivityRange(a.start, a.end) }}</time>
                    <span v-if="a.location">· {{ a.location }}</span>
                  </div>
                  <h4 class="font-serif text-xl leading-snug text-ink">{{ a.title }}</h4>
                  <div v-if="a.body?.children?.length" class="activity-body text-sm soft leading-relaxed">
                    <ContentRenderer :value="a" />
                  </div>
                  <div v-if="a.links?.length || a.publications?.length" class="flex flex-wrap gap-2 pt-1">
                    <a v-for="l in a.links" :key="l.href" :href="l.href" target="_blank" rel="noopener" class="pill">
                      <Icon name="lucide:external-link" class="w-3 h-3" /> {{ l.label }}
                    </a>
                    <NuxtLink v-for="p in a.publications" :key="p" :to="`/publications#${p}`" class="pill">
                      <Icon name="lucide:file-text" class="w-3 h-3" /> Paper · {{ pubLabels.get(p) ?? p }}
                    </NuxtLink>
                  </div>
                </article>
              </li>
            </ol>
          </div>
        </section>

        <p v-if="!activities.length" class="muted italic">No activities yet.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.year-tab {
  position: relative;
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;
  padding: 0.25rem 0.75rem 0.6rem;
  color: rgb(var(--fg-mute));
  transition: color 0.2s ease;
}
.year-tab::after {
  content: '';
  position: absolute;
  left: 0.5rem;
  right: 0.5rem;
  bottom: -1px;
  height: 2px;
  background-color: rgb(var(--accent));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}
.year-tab:hover { color: rgb(var(--fg-soft)); }
.year-tab[aria-selected='true'] { color: rgb(var(--fg)); }
.year-tab[aria-selected='true']::after { transform: scaleX(1); }
.year-tab.empty { opacity: 0.45; }

.activity-entry {
  box-shadow: inset 3px 0 0 rgb(var(--cat));
}
.date-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  height: 3.25rem;
  border-radius: 0.5rem;
  color: var(--cat-fg);
  background-color: rgb(var(--cat) / 0.1);
  transition: color 0.3s ease, background-color 0.3s ease;
}

/* A card picked in the calendar stays highlighted; the others step back. */
.has-focus .activity-entry:not(.is-focused) { opacity: 0.45; }
.has-focus .activity-entry:not(.is-focused):hover { opacity: 0.85; }
.activity-entry.is-focused {
  border-color: rgb(var(--cat));
  box-shadow: inset 3px 0 0 rgb(var(--cat)), 0 0 0 3px rgb(var(--cat) / 0.15);
}
.activity-entry.is-focused .date-badge {
  color: #fff;
  background-color: rgb(var(--cat));
}

.activity-body :deep(p + p) { margin-top: 0.6rem; }
.activity-body :deep(strong) { color: rgb(var(--fg)); font-weight: 600; }
</style>
