import { site } from './data/site'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@vueuse/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: site.name,
      titleTemplate: `%s · ${site.name}`,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: site.description },
        { name: 'author', content: site.name },
        { name: 'theme-color', content: '#f5f0e8' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: site.name },
        { property: 'og:title', content: site.name },
        { property: 'og:description', content: site.description },
        { property: 'og:image', content: `${site.url}/og.png` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: `${site.name}, ${site.role}` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: `${site.url}/og.png` },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
        },
      ],
      script: [
        // Apply the saved theme before first paint (light unless the visitor chose dark).
        { innerHTML: `try{if(localStorage.getItem('theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}` },
      ],
    },
  },

  content: {
    highlight: {
      theme: 'github-light',
    },
    markdown: {
      anchorLinks: false,
    },
  },

  icon: {
    // Bundle the icons used in components so client-only renders never hit the network.
    clientBundle: { scan: true },
  },

  routeRules: {
    '/news': { redirect: '/activities' },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/publications', '/projects', '/cv', '/activities', '/news', '/gallery'],
    },
  },

  typescript: {
    strict: true,
  },
})
