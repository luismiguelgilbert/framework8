<script setup lang="ts">
useHead({ title: 'BITT - Ingreso' });

definePageMeta({
  layout: "login",
});
const route = useRoute();
const myAxios = useAxios();
const error = String(route.query.error) ?? null;

const refreshSessionFromCookies = async () => {
  try {
    await myAxios.post('/api/refresh-session');
    navigateTo('/');
  } catch(error) {
    console.error(error);
  }
}
//HOOKS
onMounted(async () => {
  try{
    const cat = localStorage.getItem("myCat");
    await refreshSessionFromCookies();
  }catch(error){
    console.error(error);
  }
});
</script>

<template>
  <LoginSSR :error="error" />
</template>
