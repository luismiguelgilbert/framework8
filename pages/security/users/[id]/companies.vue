<script setup lang="ts">
const state = useSecurityUsers();

const columns = [
  {  key: 'name_es',  label: 'Permisos', sortable: false},
];
const uiCard = {
  body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
}
const allCompanies = computed(() => {
  return state.value?.allCompanies?.map(x => { return { ...x, row_count: 1 } });
});
</script>

<template>
  <div class="mx-2">
    <div class="ml-2 mb-2"><span class="font-semibold text-lg">Compañías asignadas al Usuario</span></div>
    <UCard
      class="w-full"
      :ui="uiCard">
      <UTable
        class="w-full"
        :columns="columns"
        v-model="state.userCompanies"
        :sort="{ column: 'path', direction: 'desc' }"
        :rows="allCompanies">
        <template #name_es-data="{ row }">
          <UIcon v-if="row.row_level === 1" :name="row.icon" class="pl-4" />
          {{ row.name_es }} 
        </template>
      </UTable>
    </UCard>
  </div>
</template>