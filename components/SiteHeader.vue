<script setup lang="ts">
import { nav, site } from '~/data/site'

const route = useRoute()
const menuOpen = ref(false)

const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))

watch(() => route.path, () => {
  menuOpen.value = false
})
onKeyStroke('Escape', () => {
  menuOpen.value = false
})
</script>

<template>
  <header class="border-b hairline sticky top-0 z-30 backdrop-blur bg-paper/90">
    <div class="container-page flex items-center gap-6 h-16">
      <NuxtLink
        to="/"
        class="mr-auto font-serif text-2xl tracking-tight text-ink hover:opacity-80"
      >
        {{ site.firstName }} <span class="italic accent-text">{{ site.lastName }}</span>
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-7 text-sm" aria-label="Main">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="relative py-1 transition-colors hover:opacity-100"
          :class="isActive(item.to) ? 'text-ink font-medium' : 'soft hover:text-ink'"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          {{ item.label }}
          <span v-if="isActive(item.to)" class="absolute inset-x-0 -bottom-px h-px bg-accent" />
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-1 -mr-2">
        <ThemeToggle />
        <button
          type="button"
          class="icon-btn md:hidden"
          aria-controls="mobile-nav"
          :aria-expanded="menuOpen"
          :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
          @click="menuOpen = !menuOpen"
        >
          <Icon v-show="!menuOpen" name="lucide:menu" class="w-5 h-5" />
          <Icon v-show="menuOpen" name="lucide:x" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div
      id="mobile-nav"
      class="md:hidden grid transition-[grid-template-rows] duration-300 ease-out"
      :class="menuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <nav class="overflow-hidden" aria-label="Main (mobile)">
        <div class="container-page pb-2">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            :tabindex="menuOpen ? undefined : -1"
            class="block py-3 border-t hairline text-base transition-colors hover:opacity-100"
            :class="isActive(item.to) ? 'text-ink font-medium' : 'soft hover:text-ink'"
            :aria-current="isActive(item.to) ? 'page' : undefined"
          >
            {{ item.label }}
          </NuxtLink>
        </div>
      </nav>
    </div>
  </header>
</template>
