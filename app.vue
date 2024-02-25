<script setup lang="ts">
const colorMode = useColorMode();

const color = computed(() => colorMode.value === 'dark' ? '#111827' : 'white');

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Framework - BITT'
const description = 'Plataforma de administración multifuncioal.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://dashboard-template.nuxt.dev/social-card.png',
  twitterImage: 'https://dashboard-template.nuxt.dev/social-card.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <div>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
    <UModals />
  </div>
</template>

<!-- <NuxtPage :transition="{
  name: 'rotate',
  mode: 'out-in',
}" /> -->
<!-- <style>
body {
  /* font-family: 'Ubuntu', sans-serif; */
  font-family: 'DMSans', sans-serif;
}
.layout-enter-active, .layout-leave-active {
  transition: all 0.4s;
}
.layout-enter-from, .layout-leave-yo {
  filter: grayscale(1);
}
.rotate-enter-active, .rotate-leave-active {
  transition: all 0.4s;
}
.rotate-enter-from, .rotate-leave-to {
  opacity: 0;
  transform: scale();
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style> -->