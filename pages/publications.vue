<script setup lang="ts">
import { publicationTypes, sortPublications, type Publication, type PublicationType } from '~/utils/publications'

usePageMeta({
  title: 'Publications',
  description: 'Peer-reviewed publications by Javier Parada, grouped by category in reverse chronological order.',
})

const { data } = await useAsyncData('all-publications', () =>
  queryContent<Publication>('/publications').find(),
)

const publications = computed(() => sortPublications(data.value ?? []))

const groups = computed(() =>
  [
    ...(Object.keys(publicationTypes) as PublicationType[]).map((type) => ({
      type: type as string,
      label: publicationTypes[type],
      items: publications.value.filter((p) => p.type === type),
    })),
    // Entries without a recognised `type` in their frontmatter.
    {
      type: 'other',
      label: 'Other Publications',
      items: publications.value.filter((p) => !p.type || !(p.type in publicationTypes)),
    },
  ].filter((g) => g.items.length > 0),
)
</script>

<template>
  <div class="space-y-12">
    <header class="space-y-3 border-b hairline pb-6">
      <span class="eyebrow">Research output</span>
      <h1>Publications</h1>
      <p class="soft max-w-prose">
        Peer-reviewed research on cyber threat hunting, adversary emulation and threat
        intelligence for critical infrastructures, by category and in reverse chronological order.
      </p>
    </header>

    <PublicationStats v-if="publications.length" :items="publications" />

    <section v-for="g in groups" :key="g.type" class="space-y-4">
      <div class="flex items-baseline justify-between gap-4">
        <h2 class="!text-3xl">{{ g.label }}</h2>
        <span class="pill font-mono">{{ g.items.length }}</span>
      </div>
      <PublicationList :items="g.items" />
    </section>

    <p v-if="publications.length === 0" class="muted italic">
      No publications listed yet.
    </p>
  </div>
</template>
