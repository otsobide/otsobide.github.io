<script setup lang="ts">
import galleryData from '~/data/gallery.json'
import countryData from '~/data/countries.json'

interface Photo {
  title: string
  image: string
  link?: string
  tags: string[]
  caption?: string
  date?: string
  width?: number
  height?: number
}

usePageMeta({
  title: 'Gallery',
  description: 'A selection of my favourite photos, pulled from Flickr.',
})

const PAGE_SIZE = 24

const photos = galleryData as Photo[]
const countries = countryData as Record<string, { name: string, flag: string }>

/** Flickr serves sizes up to 1024px (_b) under the same secret; _c is the 800px version. */
const thumbUrl = (src: string) => src.replace(/_b\.(jpe?g|png)$/i, '_c.$1')
const countryOf = (photo: Photo) => photo.tags.map((t) => countries[t]?.name).find(Boolean)
const titleOf = (photo: Photo) => (photo.title && photo.title !== 'Untitled' ? photo.title : countryOf(photo) ?? 'Untitled')

const activeTag = ref<string | null>(null)
const visibleCount = ref(PAGE_SIZE)

/** Country chips, most photographed first. */
const allTags = computed(() => {
  const counts = new Map<string, number>()
  for (const p of photos) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag, count]) => ({ tag, count, name: countries[tag]?.name ?? tag, flag: countries[tag]?.flag }))
})

const filteredPhotos = computed(() =>
  activeTag.value ? photos.filter((p) => p.tags.includes(activeTag.value!)) : photos,
)

const visiblePhotos = computed(() => filteredPhotos.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < filteredPhotos.value.length)

const setTag = (tag: string | null) => {
  activeTag.value = activeTag.value === tag ? null : tag
  visibleCount.value = PAGE_SIZE
}

const sentinel = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!sentinel.value || typeof IntersectionObserver === 'undefined') return
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && hasMore.value) {
          visibleCount.value = Math.min(
            visibleCount.value + PAGE_SIZE,
            filteredPhotos.value.length,
          )
        }
      }
    },
    { rootMargin: '600px 0px' },
  )
  observer.observe(sentinel.value)
  onUnmounted(() => observer.disconnect())
})

// ----- lightbox -----
const dialog = ref<HTMLDialogElement | null>(null)
const current = ref(0)
const loaded = ref(false)
const currentPhoto = computed(() => filteredPhotos.value[current.value])

const show = (index: number) => {
  const n = filteredPhotos.value.length
  current.value = (index + n) % n
  loaded.value = false
  // Warm up the neighbours so arrow keys feel instant.
  for (const d of [1, -1]) {
    const neighbour = filteredPhotos.value[(current.value + d + n) % n]
    if (neighbour) new Image().src = neighbour.image
  }
}

const open = (index: number) => {
  show(index)
  dialog.value?.showModal()
}

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') show(current.value + 1)
  if (e.key === 'ArrowLeft') show(current.value - 1)
}

// Clicking the backdrop (the dialog element itself) closes it.
const onDialogClick = (e: MouseEvent) => {
  if (e.target === dialog.value) dialog.value?.close()
}

let touchX: number | null = null
const onTouchStart = (e: TouchEvent) => {
  touchX = e.touches[0]?.clientX ?? null
}
const onTouchEnd = (e: TouchEvent) => {
  const end = e.changedTouches[0]?.clientX
  if (touchX !== null && end !== undefined && Math.abs(end - touchX) > 50) show(current.value + (end < touchX ? 1 : -1))
  touchX = null
}
</script>

<template>
  <div class="space-y-12">
    <header class="space-y-3 border-b hairline pb-6">
      <span class="eyebrow">Photography</span>
      <h1>Gallery</h1>
      <p class="soft max-w-prose">
        A selection of my favourite photos, pulled from
        <a href="https://www.flickr.com/photos/tanukifilm/" target="_blank" rel="noopener">Flickr</a>.
        Filter by country below, and click any photo to view it larger.
      </p>
    </header>

    <div v-if="allTags.length" class="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by country">
      <button type="button" class="chip" :aria-pressed="activeTag === null" @click="setTag(null)">
        All · {{ photos.length }}
      </button>
      <button
        v-for="t in allTags"
        :key="t.tag"
        type="button"
        class="chip"
        :aria-pressed="activeTag === t.tag"
        @click="setTag(t.tag)"
      >
        <Icon v-if="t.flag" :name="`flag:${t.flag}-4x3`" class="w-4 h-3 rounded-[2px] shadow-[0_0_0_1px_rgb(0_0_0/0.08)]" />
        {{ t.name }} · {{ t.count }}
      </button>
    </div>

    <div
      v-if="visiblePhotos.length"
      class="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]"
    >
      <button
        v-for="(photo, i) in visiblePhotos"
        :key="photo.image"
        type="button"
        class="group relative block w-full mb-4 break-inside-avoid overflow-hidden rounded-lg border hairline surface-tint cursor-zoom-in"
        :style="photo.width && photo.height ? { aspectRatio: `${photo.width} / ${photo.height}` } : undefined"
        :aria-label="`View “${titleOf(photo)}”`"
        @click="open(i)"
      >
        <img
          :src="thumbUrl(photo.image)"
          :alt="titleOf(photo)"
          :width="photo.width"
          :height="photo.height"
          loading="lazy"
          decoding="async"
          class="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <span
          class="absolute inset-x-0 bottom-0 p-3 text-left bg-gradient-to-t from-[rgb(0_0_0/0.7)] via-[rgb(0_0_0/0.35)] to-transparent text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
        >
          <span class="block font-serif text-base leading-tight">{{ titleOf(photo) }}</span>
          <span v-if="countryOf(photo) && countryOf(photo) !== titleOf(photo)" class="block text-xs opacity-80 mt-0.5">
            {{ countryOf(photo) }}
          </span>
        </span>
      </button>
    </div>

    <p v-else class="muted italic">
      <template v-if="photos.length === 0">
        No photos yet, come back soon.
      </template>
      <template v-else>
        No photos match the selected country.
      </template>
    </p>

    <div ref="sentinel" class="h-4" />

    <p v-if="hasMore" class="muted text-xs text-center font-mono">
      Loading more…
    </p>

    <dialog
      ref="dialog"
      aria-label="Photo viewer"
      class="lightbox"
      @click="onDialogClick"
      @keydown="onKey"
      @touchstart.passive="onTouchStart"
      @touchend="onTouchEnd"
    >
      <div v-if="currentPhoto" class="relative grid place-items-center min-h-[40vh] bg-[#141413]">
        <img
          :key="currentPhoto.image"
          :src="currentPhoto.image"
          :alt="titleOf(currentPhoto)"
          class="max-w-full max-h-[calc(94vh-4.5rem)] object-contain transition-opacity duration-300"
          :class="loaded ? 'opacity-100' : 'opacity-0'"
          @load="loaded = true"
        />
        <button type="button" class="lb-btn left-3 top-1/2 -mt-5" aria-label="Previous photo" @click="show(current - 1)">
          <Icon name="lucide:chevron-left" class="w-5 h-5" />
        </button>
        <button type="button" class="lb-btn right-3 top-1/2 -mt-5" aria-label="Next photo" @click="show(current + 1)">
          <Icon name="lucide:chevron-right" class="w-5 h-5" />
        </button>
        <button type="button" class="lb-btn right-3 top-3" aria-label="Close" @click="dialog?.close()">
          <Icon name="lucide:x" class="w-5 h-5" />
        </button>
      </div>
      <div v-if="currentPhoto" class="flex items-center gap-4 px-4 py-3">
        <div class="flex-1 min-w-0">
          <p class="font-serif text-lg leading-tight truncate">{{ titleOf(currentPhoto) }}</p>
          <p class="text-xs text-[#b0aea5]">
            {{ [countryOf(currentPhoto), currentPhoto.date].filter((s) => s && s !== titleOf(currentPhoto)).join(' · ') }}
          </p>
        </div>
        <span class="font-mono text-xs text-[#b0aea5] tabular-nums">{{ current + 1 }} / {{ filteredPhotos.length }}</span>
        <a
          v-if="currentPhoto.link"
          :href="currentPhoto.link"
          target="_blank"
          rel="noopener"
          class="pill !text-[#faf9f5] !border-white/20 hover:!border-white/50"
        >
          <Icon name="lucide:external-link" class="w-3 h-3" /> Flickr
        </a>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
.lightbox {
  width: min(94vw, 76rem);
  max-width: none;
  max-height: 94vh;
  padding: 0;
  border: none;
  border-radius: 0.75rem;
  overflow: hidden;
  color: #faf9f5;
  background: #1f1e1d;
}
.lightbox::backdrop {
  background: rgb(20 20 19 / 0.85);
  backdrop-filter: blur(4px);
}
.lb-btn {
  position: absolute;
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  color: #fff;
  background: rgb(255 255 255 / 0.12);
  transition: background-color 0.2s ease;
}
.lb-btn:hover {
  background: rgb(255 255 255 / 0.25);
}
</style>
