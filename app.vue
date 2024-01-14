<script setup lang="ts">
</script>
<template>
  <NuxtLayout>
    <div>
      <!-- <NuxtLoadingIndicator /> -->
      <NuxtPage :transition="{
        name: 'rotate',
        mode: 'out-in',
      }" />
    </div>
  </NuxtLayout>
  <UNotifications />
</template>

<style>
body {
  font-family: 'Ubuntu', sans-serif;
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
</style>