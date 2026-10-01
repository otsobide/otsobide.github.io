<script setup lang="ts">
import { socials } from '~/data/site'

const props = defineProps<{ exclude?: string[] }>()

const items = computed(() => socials.filter((s) => !props.exclude?.includes(s.name)))
</script>

<template>
  <ul class="flex flex-wrap items-center gap-2" aria-label="Profiles and contact">
    <li v-for="s in items" :key="s.name">
      <a
        :href="s.href"
        :aria-label="s.label"
        :title="s.label"
        :target="s.name === 'email' ? '_self' : '_blank'"
        rel="noopener noreferrer"
        class="grid place-items-center w-9 h-9 rounded-full border hairline text-ink-mute hover:text-accent hover:border-accent hover:opacity-100 transition-colors"
      >
        <Icon :name="s.icon" class="w-[17px] h-[17px]" />
      </a>
    </li>
  </ul>
</template>
