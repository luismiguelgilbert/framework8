<script setup lang="ts">
const colorMode = useColorMode()
colorMode.preference = 'light'
</script>

<template>
    <suspense>
      <!-- <slot /> -->
      <NuxtPage />
    </suspense>
</template>