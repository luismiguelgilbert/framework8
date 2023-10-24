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
  modules: [
    //'@nuxtjs/supabase' <= This module is making an automatic redirect to login
    '@nuxt/ui',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],
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
  pinia: {
    autoImports: ['defineStore','acceptHMRUpdate'],
  },
  /*supabase: {
    client: {
      auth: {
        persistSession: false //or true
      }
    }
  }*/
  /*quasar: {
    sassVariables: 'assets/scss/variables.scss',
    plugins: [
      // 'AppFullscreen',
      // 'BottomSheet',
      'Dialog',
      'Loading',
      'LoadingBar',
      'Notify',
    ],
    iconSet: 'fontawesome-v6',
    quietSassWarnings: true,
    extras: {
      fontIcons: ['fontawesome-v6'],
      font: 'roboto-font-latin-ext'
    },
    config: {
      brand: {
        primary: '#6366f1',//blue > '#3b82f6',
        positive: '#00DC82',
        //dark: '#1b1917',
        //dark: '#020617',
        //'dark-page': '#121212',
        //primary   : #3b82f6;
      }
    }
  }*/
})
