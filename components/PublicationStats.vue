<script setup lang="ts">
import { publicationTypes, type Publication, type PublicationType } from '~/utils/publications'

const props = defineProps<{ items: Publication[] }>()

/** Fill per publication type, used by both the type and the year bars. */
const typeColor: Record<PublicationType, string> = {
  'journal': 'bg-accent',
  'conference': 'bg-accent-soft',
  'national-conference': 'bg-line-strong',
}

const types = computed(() =>
  (Object.keys(publicationTypes) as PublicationType[])
    .map((key) => ({ key, label: publicationTypes[key], n: props.items.filter((p) => p.type === key).length }))
    .filter((t) => t.n > 0),
)

const years = computed(() =>
  [...new Set(props.items.map((p) => Number(p.year)))]
    .sort((a, b) => a - b)
    .map((year) => {
      const inYear = props.items.filter((p) => Number(p.year) === year)
      return {
        year,
        total: inYear.length,
        parts: types.value.map((t) => ({ key: t.key, n: inYear.filter((p) => p.type === t.key).length })),
      }
    }),
)

const maxType = computed(() => Math.max(1, ...types.value.map((t) => t.n)))
const maxYear = computed(() => Math.max(1, ...years.value.map((y) => y.total)))
</script>

<template>
  <section
    aria-label="Publications at a glance"
    class="grid grid-cols-1 md:grid-cols-[0.8fr_1fr_1fr] gap-px overflow-hidden rounded-xl border hairline bg-line"
  >
    <div class="surface-tint p-6 flex flex-col justify-center gap-1">
      <span class="font-serif text-6xl leading-none accent-text">{{ items.length }}</span>
      <span class="soft text-sm">peer-reviewed publications</span>
    </div>

    <div class="surface-tint p-6 space-y-3">
      <p class="eyebrow">By type</p>
      <ul class="space-y-2.5">
        <li v-for="t in types" :key="t.key" class="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 text-xs">
          <span class="soft">{{ t.label }}</span>
          <span class="text-ink tabular-nums">{{ t.n }}</span>
          <span class="col-span-2 h-1.5 rounded-full bg-paper-soft overflow-hidden">
            <span class="block h-full rounded-full" :class="typeColor[t.key]" :style="{ width: `${(t.n / maxType) * 100}%` }" />
          </span>
        </li>
      </ul>
    </div>

    <div class="surface-tint p-6 space-y-3">
      <p class="eyebrow">By year</p>
      <ul class="space-y-2.5">
        <li v-for="y in years" :key="y.year" class="grid grid-cols-[2.75rem_1fr_1.5rem] items-center gap-3 text-xs">
          <span class="soft font-mono">{{ y.year }}</span>
          <span class="flex h-1.5 rounded-full bg-paper-soft overflow-hidden">
            <span
              v-for="part in y.parts"
              :key="part.key"
              class="block h-full"
              :class="typeColor[part.key]"
              :style="{ width: `${(part.n / maxYear) * 100}%` }"
            />
          </span>
          <span class="text-ink text-right tabular-nums">{{ y.total }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
