<script setup lang="ts">
import { site } from '~/data/site'
import { awards, certifications, education, experience, languages, researchProfile } from '~/data/cv'
import { sortPublications, type Publication } from '~/utils/publications'

usePageMeta({
  title: 'CV',
  description: 'Curriculum Vitae, Javier Parada',
})

const { data } = await useAsyncData('cv-publications', () =>
  queryContent<Publication>('/publications').find(),
)
const publications = computed(() => sortPublications(data.value ?? []))
</script>

<template>
  <div class="space-y-14">
    <header class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b hairline pb-6">
      <div class="space-y-3 max-w-prose">
        <span class="eyebrow">Curriculum Vitae</span>
        <h1>CV</h1>
        <p class="soft">{{ researchProfile }}</p>
      </div>
      <div class="flex flex-row md:flex-col gap-2 shrink-0">
        <a :href="site.cv" class="btn" download>
          <Icon name="lucide:file-down" class="w-4 h-4" /> Download PDF
        </a>
        <a :href="site.cv" class="btn-ghost" target="_blank" rel="noopener">View in browser</a>
      </div>
    </header>

    <section class="space-y-8">
      <h2 class="!text-3xl">Experience</h2>
      <CvTimeline :items="experience" />
    </section>

    <section class="space-y-8">
      <h2 class="!text-3xl">Education</h2>
      <CvTimeline :items="education" />
    </section>

    <section v-if="publications.length" class="space-y-6">
      <div class="flex items-baseline justify-between">
        <h2 class="!text-3xl">Publications</h2>
        <NuxtLink to="/publications" class="text-sm muted hover:text-ink">By category →</NuxtLink>
      </div>
      <PublicationList :items="publications" />
    </section>

    <section class="space-y-6">
      <h2 class="!text-3xl">Certifications</h2>
      <ol class="space-y-6">
        <li
          v-for="c in certifications"
          :key="c.title"
          class="grid grid-cols-1 md:grid-cols-[12rem_1fr] gap-4 md:gap-8"
        >
          <div class="muted text-sm font-mono pt-1">{{ c.date }}</div>
          <div class="space-y-1">
            <p class="text-xs uppercase tracking-wider muted">{{ c.category }}</p>
            <h3 class="!text-xl">{{ c.title }}</h3>
            <p class="soft text-sm">{{ c.issuer }} · {{ c.location }}</p>
          </div>
        </li>
      </ol>
    </section>

    <section class="space-y-6">
      <h2 class="!text-3xl">Awards</h2>
      <ol class="space-y-6">
        <li
          v-for="a in awards"
          :key="a.title"
          class="grid grid-cols-1 md:grid-cols-[12rem_1fr] gap-4 md:gap-8"
        >
          <div class="muted text-sm font-mono pt-1">{{ a.location }}</div>
          <div class="space-y-1.5">
            <h3 class="!text-xl">{{ a.title }}</h3>
            <p class="soft text-sm italic">{{ a.subtitle }}</p>
            <p class="soft text-sm pt-1">{{ a.description }}</p>
          </div>
        </li>
      </ol>
    </section>

    <section class="space-y-6">
      <h2 class="!text-3xl">Languages</h2>
      <ul class="divide-y hairline border-y hairline">
        <li v-for="l in languages" :key="l.name" class="py-3 flex justify-between text-sm">
          <span>{{ l.name }}</span>
          <span class="muted">{{ l.level }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
