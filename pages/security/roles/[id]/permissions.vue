<script setup lang="ts">
const state = useSecurityRoles();
import { type type_sys_links } from '@/typings/server/sys_links';

const columns = [
  {  key: 'name_es',  label: 'Permisos', sortable: false},
];
const uiCard = {
  body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
};

const allLinksRoot = computed(() => state.value.allLinks.filter(x => x.row_level > 0));
const getIconFromId = (id: number) => {
  const link = state.value.allLinks.find(object => object.id === id);
  return link ? link.icon! : '';
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
        :rows="allLinksRoot">
        <template #name_es-data="{ row }: { row: type_sys_links }">
          <UIcon v-if="row.row_level === 1" :name="row.icon!" />
          <UIcon v-if="row.row_level === 2" :name="getIconFromId(row.parent!)" />
          {{ row.path }}
          <UIcon v-if="row.row_level === 2" :name="row.icon!" class="pl-1" />
        </template>
      </UTable>
    </UCard>
  </div>
</template>