// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  nitro: {
    preset: 'netlify'
  },
  experimental: { componentIslands: true },
  css: [
    //'@/assets/main.css',
    '@fortawesome/fontawesome-free/css/all.min.css',
    '@/assets/scss/variables.css',
    '@/assets/css/tailwind.css',
    //'~/assets/scss/variables.css',
    // '@/assets/main.css',
  ],
  modules: [// <= This module is making an automatic redirect to login
  '@nuxtjs/supabase', '@nuxt/ui', '@nuxtjs/color-mode', '@nuxtjs/tailwindcss', '@vueuse/nuxt', "@nuxt/image"],
  tailwindcss: {
    configPath: 'tailwind.config',
  },
  colorMode: {
    classSuffix: ''
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, set-user-scalable=no',
    }
  },
  // components: [
  //   { path: '~/components', pathPrefix: false },
  // ]
})