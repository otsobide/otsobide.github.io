<script setup lang="ts">
usePageMeta({ title: 'Blog' })

const { data: posts } = await useAsyncData('blog', () =>
  queryContent('/blog').sort({ date: -1 }).find(),
)
</script>

<template>
  <div class="space-y-10">
    <header class="space-y-3 border-b hairline pb-6">
      <h1>Blog</h1>
      <p class="soft max-w-prose">
        Occasional writing on threat hunting, adversary emulation and adjacent topics.
      </p>
    </header>

    <ul v-if="posts && posts.length" class="space-y-8">
      <li v-for="post in posts" :key="post._path">
        <NuxtLink :to="post._path" class="group block">
          <h2 class="!text-2xl group-hover:text-accent transition-colors">
            {{ post.title }}
          </h2>
          <p v-if="post.description" class="soft mt-1">{{ post.description }}</p>
          <p class="muted text-xs mt-2 font-mono">
            {{ new Date(post.date).toLocaleDateString('en', { year: 'numeric', month: 'long', day: '2-digit' }) }}
          </p>
        </NuxtLink>
      </li>
    </ul>

    <p v-else class="muted italic">
      Nothing published yet, come back soon.
    </p>
  </div>
</template>
