<script setup lang="ts">
import type { TimelineEntry } from '~/data/cv'

defineProps<{ items: TimelineEntry[] }>()
</script>

<template>
  <ol class="timeline">
    <li v-for="e in items" :key="`${e.role}-${e.where}`" class="item">
      <div class="period muted text-sm font-mono">{{ e.period }}</div>
      <div class="node" aria-hidden="true">
        <span v-if="e.logo" class="logo">
          <img :src="e.logo.src" :alt="e.logo.alt" width="44" height="44" loading="lazy" />
        </span>
        <span v-else class="dot" />
      </div>
      <div class="entry space-y-1.5">
        <h3 class="!text-xl">{{ e.role }}</h3>
        <p class="soft">
          {{ e.where }}<span v-if="e.location" class="muted"> · {{ e.location }}</span>
        </p>
        <ul v-if="e.bullets" class="bullets space-y-1 text-sm soft pt-1">
          <li v-for="b in e.bullets" :key="b">{{ b }}</li>
        </ul>
        <div v-if="e.skills" class="flex flex-wrap gap-1.5 pt-2">
          <span v-for="s in e.skills" :key="s" class="tag">{{ s }}</span>
        </div>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.timeline {
  --node: 2.75rem;
  --period: 10rem;
  --gap: 1.25rem;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
}

/* A hairline runs down the node column, behind the logos and dots. */
.timeline::before {
  content: '';
  position: absolute;
  top: calc(var(--node) / 2);
  bottom: 0.5rem;
  left: calc(var(--node) / 2);
  width: 1px;
  background-color: rgb(var(--border-strong));
}

.item {
  display: grid;
  grid-template-columns: var(--node) 1fr;
  grid-template-areas:
    'node period'
    'node entry';
  column-gap: var(--gap);
  row-gap: 0.25rem;
}
@media (min-width: 768px) {
  .timeline::before {
    left: calc(var(--period) + var(--gap) + var(--node) / 2);
  }
  .item {
    grid-template-columns: var(--period) var(--node) 1fr;
    grid-template-areas: 'period node entry';
  }
  .period {
    text-align: right;
    padding-top: 0.35rem;
  }
}

.period { grid-area: period; }
.entry { grid-area: entry; min-width: 0; }

.node {
  grid-area: node;
  position: relative;
  display: flex;
  justify-content: center;
  height: var(--node);
}
.logo {
  display: block;
  width: var(--node);
  height: var(--node);
  padding: 0.3rem;
  border: 1px solid rgb(var(--border));
  border-radius: 0.6rem;
  background-color: #fff;
  /* Ring of page colour so the line seems to stop at the node. */
  box-shadow: 0 0 0 4px rgb(var(--bg));
}
.logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.dot {
  margin-top: calc(var(--node) / 2 - 0.35rem);
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 999px;
  border: 2px solid rgb(var(--accent));
  background-color: rgb(var(--bg));
  box-shadow: 0 0 0 4px rgb(var(--bg));
}

.bullets > li {
  position: relative;
  padding-left: 1rem;
}
.bullets > li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.6em;
  width: 0.4rem;
  height: 1px;
  background-color: rgb(var(--accent));
}
</style>
