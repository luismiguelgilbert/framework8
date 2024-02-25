// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // devtools: { enabled: true },
  nitro: {
    preset: 'netlify'
  },
  // experimental: { componentIslands: true },
  // css: [
    // '@fortawesome/fontawesome-free/css/all.min.css',
    // '@/assets/scss/variables.css',
    // '@/assets/css/tailwind.css',
  // ],
  extends: ['@nuxt/ui-pro'],
  modules: [
    '@nuxt/ui',
    '@nuxtjs/supabase',
    // '@nuxtjs/color-mode',
    // '@nuxtjs/tailwindcss',
    // '@vueuse/nuxt',
    '@nuxt/image',
  ],
  components: [{
    path: '~/components'
  }, {
    path: '~/components/bitt',
    pathPrefix: false
  }],
  // tailwindcss: {
  //   configPath: 'tailwind.config',
  // },
  // colorMode: {
  //   classSuffix: ''
  // },
  // app: {
  //   head: {
  //     charset: 'utf-8',
  //     viewport: 'width=device-width, initial-scale=1, set-user-scalable=no',
  //   }
  // },
  fontMetrics: {
    fonts: ['DM Sans']
  },
  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      'DM+Sans': [300, 400, 500, 600, 700]
    }
  },
})