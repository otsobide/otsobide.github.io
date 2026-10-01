<script setup lang="ts">
usePageMeta({
  title: 'Projects',
  description: 'A growing collection of open-source projects.',
})

const { data: projects } = await useAsyncData('all-projects', () =>
  queryContent('/projects').sort({ importance: -1 }).find(),
)

const categoryLabels: Record<string, string> = {
  working: "Projects I'm working on",
  maintaining: 'Projects I still maintain',
  legacy: 'Legacy Projects',
  other: 'Other',
}

const categories = computed(() => {
  const map = new Map<string, any[]>()
  for (const p of projects.value || []) {
    const cat = (p.category as string) || 'other'
    if (!map.has(cat)) map.set(cat, [])
    map.get(cat)!.push(p)
  }
  const order = ['working', 'maintaining', 'legacy', 'other']
  return [...map.entries()].sort(
    (a, b) => order.indexOf(a[0]) - order.indexOf(b[0]),
  )
})
</script>

<template>
  <div class="space-y-14">
    <header class="space-y-3 border-b hairline pb-6">
      <span class="eyebrow">Code &amp; tools</span>
      <h1>Projects</h1>
      <p class="soft max-w-prose">
        A growing collection of open-source projects, templates, tools and utilities
        I've built over the years.
      </p>
    </header>

    <section class="space-y-10">
      <div class="space-y-2">
        <h2 class="!text-4xl font-serif">Minor Projects</h2>
        <p class="soft text-sm max-w-prose">
          Small utilities, templates and side experiments. Major software projects
          coming soon.
        </p>
      </div>

      <section v-for="[cat, items] in categories" :key="cat" class="space-y-6">
        <h3 class="!text-2xl font-serif">{{ categoryLabels[cat] || cat }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <a
            v-for="p in items"
            :key="p._path"
            :href="p.url"
            target="_blank"
            rel="noopener"
            class="group block p-6 card-warm hover:opacity-100"
          >
            <div class="flex items-start justify-between gap-3">
              <h4 class="!text-xl font-serif leading-tight flex items-center gap-2">
                <span v-if="p.emoji" class="text-xl">{{ p.emoji }}</span>
                <span>{{ p.title }}</span>
              </h4>
              <Icon
                name="lucide:arrow-up-right"
                class="w-4 h-4 mt-2 muted group-hover:text-accent transition-colors"
              />
            </div>
            <p class="text-sm soft mt-2 leading-relaxed">{{ p.description }}</p>
            <div v-if="p.stack" class="flex flex-wrap gap-1.5 mt-4">
              <span
                v-for="tag in p.stack"
                :key="tag"
                class="tag !rounded-full"
              >
                {{ tag }}
              </span>
            </div>
          </a>
        </div>
      </section>
    </section>
  </div>
</template>
