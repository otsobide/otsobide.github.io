<script setup lang="ts">
import { authorOrcids, orcidUrl, selfAuthor } from '~/data/authors'
import { publicationId, publicationLink, type Publication } from '~/utils/publications'

defineProps<{ items: Publication[] }>()

const formatAuthor = (author: string) => author.replace(/\{|\}/g, '')
</script>

<template>
  <ul class="divide-y hairline border-y hairline">
    <li
      v-for="pub in items"
      :id="publicationId(pub)"
      :key="pub._path ?? pub.title"
      class="publication py-6 scroll-mt-24"
    >
      <div class="grid grid-cols-1 md:grid-cols-[8rem_1fr] gap-5">
        <div class="hidden md:flex items-start">
          <a
            v-if="pub.preview && publicationLink(pub)"
            :href="publicationLink(pub)"
            target="_blank"
            rel="noopener"
            :aria-label="`Open “${pub.title}”`"
            class="block rounded-sm border hairline bg-white p-2 transition hover:opacity-100 hover:border-accent hover:-translate-y-0.5"
          >
            <img :src="`/img/${pub.preview}`" :alt="pub.abbr ?? pub.venue" class="w-24 h-24 object-contain" />
          </a>
          <div v-else-if="pub.preview" class="rounded-sm border hairline bg-white p-2">
            <img :src="`/img/${pub.preview}`" :alt="pub.abbr ?? pub.venue" class="w-24 h-24 object-contain" />
          </div>
          <div
            v-else
            class="w-28 h-28 rounded-sm border hairline surface flex items-center justify-center text-xs muted font-mono text-center p-2"
          >
            {{ pub.abbr || pub.year }}
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="font-serif text-xl leading-snug">
            <a
              v-if="publicationLink(pub)"
              :href="publicationLink(pub)"
              target="_blank"
              rel="noopener"
              class="text-ink hover:text-accent hover:opacity-100 transition-colors"
            >
              {{ pub.title }}
            </a>
            <template v-else>{{ pub.title }}</template>
          </h3>
          <p class="text-sm soft leading-relaxed">
            <template v-for="(author, i) in pub.authors" :key="i">
              <a
                v-if="authorOrcids[author]"
                :href="orcidUrl(authorOrcids[author])"
                target="_blank"
                rel="noopener"
                :title="`ORCID ${authorOrcids[author]}`"
                class="whitespace-nowrap hover:text-accent hover:opacity-100"
                :class="author === selfAuthor ? 'font-medium text-ink' : 'text-inherit'"
              >
                {{ formatAuthor(author) }}<Icon name="simple-icons:orcid" class="w-3 h-3 ml-1 align-[-1px] text-[#a6ce39]" />
              </a>
              <span v-else :class="author === selfAuthor ? 'font-medium text-ink' : ''">
                {{ formatAuthor(author) }}
              </span>
              <span v-if="i < pub.authors.length - 1">, </span>
            </template>
          </p>
          <p class="text-sm">
            <em class="text-ink-soft">{{ pub.venue }}</em>
            <span v-if="pub.year" class="muted"> · {{ pub.year }}</span>
          </p>
          <div class="flex flex-wrap gap-2 pt-1">
            <span v-if="pub.abbr" class="pill font-mono">{{ pub.abbr }}</span>
            <span v-if="pub.jcr" class="pill font-mono !border-accent/40 text-accent">
              JCR {{ pub.jcr.quartile }} <span class="muted">· IF {{ pub.jcr.impactFactor.toFixed(1) }}</span>
            </span>
            <a v-if="pub.pdf" :href="pub.pdf" target="_blank" rel="noopener" class="pill">
              <Icon name="lucide:file-text" class="w-3 h-3" /> PDF
            </a>
            <a v-if="pub.doi" :href="`https://doi.org/${pub.doi}`" target="_blank" rel="noopener" class="pill">
              <Icon name="lucide:external-link" class="w-3 h-3" /> DOI
            </a>
            <a v-if="pub.url" :href="pub.url" target="_blank" rel="noopener" class="pill">
              <Icon name="lucide:link" class="w-3 h-3" /> link
            </a>
            <a v-if="pub.venueUrl" :href="pub.venueUrl" target="_blank" rel="noopener" class="pill">
              <Icon name="lucide:globe" class="w-3 h-3" /> venue
            </a>
            <a v-if="pub.code" :href="pub.code" target="_blank" rel="noopener" class="pill">
              <Icon name="simple-icons:github" class="w-3 h-3" /> code
            </a>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped>
/* Briefly tint the entry a link from another page points at (/publications#id). */
.publication:target {
  animation: target-flash 2.4s ease-out;
}
@keyframes target-flash {
  0%, 30% { background-color: rgb(var(--accent) / 0.08); }
  100% { background-color: transparent; }
}
</style>
