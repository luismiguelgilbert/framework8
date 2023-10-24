<script setup lang="ts">
useHead({ title: 'BITT - Ingreso' });
definePageMeta({
  layout: "login",
});
const route = useRoute();
const error = String(route.query.error) ?? null;
</script>

<template>
  <LoginSSR :error="error" />
</template>
