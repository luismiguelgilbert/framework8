<script setup lang="ts">
useHead({ title: 'Bodegas' });
const route = useRoute();

const { data } = await useFetch('/api/traselec/inv_master')

</script>

<template>
  <div  class="h-[calc(100dvh-95px)] sm:h-[calc(100dvh-120px)] overflow-x-hidden">
    <UTable
      :rows="data"
      >
    </UTable>
  </div>
</template>