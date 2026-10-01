<script setup lang="ts">
import { nav, site } from '~/data/site'

const year = new Date().getFullYear()

const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<template>
  <footer class="border-t hairline mt-24 surface-tint text-sm">
    <div class="container-page grid grid-cols-1 gap-10 py-12 md:grid-cols-[1.6fr_0.8fr_1.3fr] md:gap-12">
      <div class="flex flex-col items-start gap-2">
        <NuxtLink to="/" class="font-serif text-2xl tracking-tight text-ink hover:opacity-80">
          {{ site.firstName }} <span class="italic accent-text">{{ site.lastName }}</span>
        </NuxtLink>
        <p class="text-ink">{{ site.role }}</p>
        <p class="muted leading-relaxed">
          Eurecat Technology Centre, Barcelona<br>
          NicsLab, University of Malaga
        </p>
        <a :href="site.cv" class="btn-ghost mt-3 !px-3 !py-1.5 !text-xs" download>
          <Icon name="lucide:file-down" class="w-3.5 h-3.5" /> Download CV
        </a>
      </div>

      <nav aria-label="Footer">
        <p class="eyebrow mb-4">Explore</p>
        <ul class="space-y-2">
          <li v-for="item in nav" :key="item.to">
            <NuxtLink :to="item.to" class="soft hover:text-accent hover:opacity-100 transition-colors">
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div>
        <p class="eyebrow mb-4">Contact</p>
        <ul class="space-y-2">
          <li>
            <a
              :href="`mailto:${site.email}`"
              class="inline-flex items-center gap-2 soft hover:text-accent hover:opacity-100 transition-colors break-all"
            >
              <Icon name="lucide:mail" class="w-4 h-4 shrink-0" /> {{ site.email }}
            </a>
          </li>
          <li class="flex items-center gap-2 muted">
            <Icon name="lucide:map-pin" class="w-4 h-4 shrink-0" /> {{ site.location }}
          </li>
        </ul>
        <SocialLinks :exclude="['email']" class="mt-5" />
      </div>
    </div>

    <div class="border-t hairline">
      <div class="container-page flex items-center justify-between gap-4 py-5 text-xs muted">
        <p>© {{ year }} {{ site.name }}.</p>
        <a href="#" class="muted hover:text-accent hover:opacity-100 transition-colors" @click.prevent="toTop">
          Back to top ↑
        </a>
      </div>
    </div>
  </footer>
</template>
