<script setup lang="ts">
import { site } from '~/data/site'

const route = useRoute()
const canonical = computed(() => site.url + (route.path === '/' ? '/' : route.path.replace(/\/$/, '')))

useHead({ link: [{ rel: 'canonical', href: canonical }] })
useSeoMeta({ ogUrl: canonical })
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <SiteHeader />
    <main class="flex-1 w-full container-page py-14 md:py-20">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
