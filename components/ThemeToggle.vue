<script setup lang="ts">
// The saved theme is applied before first paint by the inline script in nuxt.config.ts.
const dark = ref(false)

onMounted(() => {
  dark.value = document.documentElement.dataset.theme === 'dark'
})

const toggle = () => {
  dark.value = !dark.value
  const theme = dark.value ? 'dark' : 'light'
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem('theme', theme)
  }
  catch {
    // Storage blocked: the choice lasts until the page is reloaded.
  }
}
</script>

<template>
  <button
    type="button"
    class="icon-btn theme-toggle"
    aria-label="Dark theme"
    title="Toggle dark theme"
    :aria-pressed="dark"
    @click="toggle"
  >
    <Icon name="lucide:moon" class="moon w-[18px] h-[18px]" />
    <Icon name="lucide:sun" class="sun w-[18px] h-[18px]" />
  </button>
</template>
