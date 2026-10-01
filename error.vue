<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const notFound = computed(() => props.error.statusCode === 404)

useSeoMeta({ title: () => (notFound.value ? 'Page not found' : 'Error') })
</script>

<template>
  <NuxtLayout>
    <div class="max-w-prose space-y-5 py-10">
      <span class="eyebrow">{{ error.statusCode }}</span>
      <h1 v-if="notFound">Page <span class="italic accent-text">not found</span></h1>
      <h1 v-else>Something <span class="italic accent-text">went wrong</span></h1>
      <p class="soft">
        {{ notFound ? 'The page you are looking for does not exist or has moved.' : error.statusMessage }}
      </p>
      <a href="/" class="btn-ghost" @click.prevent="clearError({ redirect: '/' })">← Back home</a>
    </div>
  </NuxtLayout>
</template>
