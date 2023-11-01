<script setup lang="ts">
useHead({ title: 'BITT - Ingreso' });

definePageMeta({
  layout: "login",
});
const route = useRoute();
const myAxios = useAxios();
const error = String(route.query.error) ?? null;

//HOOKS
onMounted(async () => {
  const response = await myAxios.post('/api/refresh-session');
  console.log(response);
});
</script>

<template>
  <LoginSSR :error="error" />
</template>
