<script setup lang="ts">
useHead({ title: 'Marcas' });
const route = useRoute();

</script>

<template>
  Marcas
  {{ route.params.company_id }}
</template>