<script setup lang="ts">
useHead({ title: 'Bodegas' });
const route = useRoute();

</script>

<template>
  Bodegas =)
  {{ route.params.company_id }}
</template>