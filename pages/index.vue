<script setup lang="ts">
import { site } from '~/data/site'
import { researchInterests } from '~/data/cv'
import {
  activityCategories,
  activityId,
  formatActivityRange,
  parseActivityDate,
  sortActivities,
  type Activity,
} from '~/utils/activities'
import { sortPublications, type Publication } from '~/utils/publications'

usePageMeta({ title: 'About' })

const { data: activities } = await useAsyncData('home-activities', () =>
  queryContent<Activity>('/activities').find(),
)
const latest = computed(() =>
  sortActivities(activities.value ?? [])
    .slice(0, 4)
    .map((a) => ({
      ...a,
      id: activityId(a),
      when: formatActivityRange(parseActivityDate(a.date), a.endDate ? parseActivityDate(a.endDate) : undefined),
    })),
)

const { data: publications } = await useAsyncData('home-publications', () =>
  queryContent<Publication>('/publications').where({ selected: true }).find(),
)
const selected = computed(() => sortPublications(publications.value ?? []))
</script>

<template>
  <div class="space-y-20">
    <!-- Hero -->
    <section class="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-14 items-center">
      <div class="space-y-5 max-w-prose">
        <span class="eyebrow">{{ site.role }}</span>
        <h1 class="!text-[3.25rem] md:!text-[4.25rem] font-serif !leading-[1.05]">
          {{ site.firstName }} <span class="italic accent-text">{{ site.lastName }}</span>
        </h1>
        <p class="soft text-lg leading-relaxed">
          <a href="https://eurecat.org/home/en/" target="_blank" rel="noopener">Eurecat Technology Centre</a> · Barcelona, Spain.
          <a href="https://www.uma.es/" target="_blank" rel="noopener">University of Malaga</a> · Malaga, Spain.
        </p>

        <div class="pt-1 text-[0.98rem] leading-[1.75]">
          <p>
            My field is <strong>Cyber Threat Intelligence</strong> (CTI): the discipline of
            collecting, analyzing and correlating data about adversaries, their tools and
            campaigns to turn raw signals into actionable knowledge that anticipates and
            counters threats. Within CTI, I focus on <strong>adversary emulation</strong>
            and the imitation of <strong>APTs</strong> to reproduce real attacker behaviour
            and stress-test defenses, on <strong>attack attribution</strong>, and on
            <strong>CTI sharing systems</strong> that enable organizations to exchange
            intelligence at scale.
          </p>
        </div>

        <ul class="flex flex-wrap gap-1.5" aria-label="Research interests">
          <li v-for="interest in researchInterests" :key="interest" class="tag">{{ interest }}</li>
        </ul>

        <div class="flex flex-wrap items-center gap-3 pt-2">
          <a :href="site.cv" class="btn" download>
            <Icon name="lucide:file-down" class="w-4 h-4" /> Download CV
          </a>
          <NuxtLink to="/publications" class="btn-ghost">Publications</NuxtLink>
        </div>

        <SocialLinks class="pt-1" />
      </div>

      <figure class="md:w-64 mx-auto md:mx-0">
        <div class="relative">
          <div class="absolute -inset-2 rounded-2xl surface-tint border hairline -z-10" />
          <img
            src="/img/prof_pic.jpg"
            :alt="site.name"
            class="w-full aspect-square object-cover rounded-xl border hairline"
          />
        </div>
        <figcaption class="text-xs muted text-center mt-5 leading-relaxed">
          Ada Byron Research Institute<br />
          NicsLab Research Group<br />
          Malaga, Spain
        </figcaption>
      </figure>
    </section>

    <!-- Activities -->
    <section v-if="latest.length" class="space-y-5">
      <div class="flex items-baseline justify-between">
        <h2 class="!text-3xl">Activities</h2>
        <NuxtLink to="/activities" class="text-sm muted hover:text-ink">
          All activities →
        </NuxtLink>
      </div>
      <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <li v-for="a in latest" :key="a.id" class="flex">
          <NuxtLink
            :to="`/activities#${a.id}`"
            :data-cat="a.category"
            class="activity-card card-warm group flex-1 flex flex-col gap-2 p-5 hover:opacity-100"
          >
            <span class="flex flex-wrap items-center gap-2 text-xs muted">
              <span class="cat-label">{{ activityCategories[a.category] }}</span>
              <time :datetime="String(a.date).slice(0, 10)">{{ a.when }}</time>
            </span>
            <span class="font-serif text-xl leading-snug text-ink">{{ a.title }}</span>
            <span v-if="a.summary" class="text-sm soft leading-relaxed">{{ a.summary }}</span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <!-- Selected papers -->
    <section v-if="selected.length" class="space-y-5">
      <div class="flex items-baseline justify-between">
        <h2 class="!text-3xl">Selected Publications</h2>
        <NuxtLink to="/publications" class="text-sm muted hover:text-ink">
          View all →
        </NuxtLink>
      </div>
      <PublicationList :items="selected" />
    </section>
  </div>
</template>

<style scoped>
/* Thin category-coloured rule along the top edge, unaffected by the hover border. */
.activity-card {
  box-shadow: inset 0 2px 0 rgb(var(--cat));
}
</style>
