<script setup lang="ts">
const state = useSecurityRoles();

const columns = [
  {  key: 'name_es',  label: 'Permisos', sortable: false},
];
const uiCard = {
  body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
}

const allLinksRoot = computed(() => state.value.allLinks
  .filter(object => object.row_level > 0)
  .sort((a, b) => b.parent! - a.parent! )
);
const getNameFromId = (id: number) => {
  const link = state.value.allLinks.find(object => object.id === id);
  return link ? link.name_es : '';
}
const getIconFromId = (id: number) => {
  const link = state.value.allLinks.find(object => object.id === id);
  return link ? link.icon! : '';
}
const getGrandparentNameFromId = (parentId: number) => {
  const grandParentId = state.value.allLinks.find(object => object.id === parentId)?.parent;
  return grandParentId ? `${getNameFromId(grandParentId)} / ` : '';
}
</script>

<template>
  <div class="mx-2">
    <div class="ml-2 mb-2"><span class="font-semibold text-lg">Permisos asignados al Perfil</span></div>
    <UCard
      class="w-full"
      :ui="uiCard">
      <UTable
        class="w-full"
        :columns="columns"
        v-model="state.profileLinks"
        :sort="{ column: 'name_es', direction: 'desc' }"
        :rows="allLinksRoot">
        <template #name_es-data="{ row }">
          <UIcon v-if="row.row_level === 1" :name="row.icon" class="pl-4" />
          <UIcon v-if="row.row_level === 2" :name="getIconFromId(row.parent)" class="pl-4" />
          {{ getGrandparentNameFromId(row.parent) }}
          {{ getNameFromId(row.parent) }} / 
          {{ row.name_es }} 
        </template>
      </UTable>
    </UCard>
  </div>
</template>