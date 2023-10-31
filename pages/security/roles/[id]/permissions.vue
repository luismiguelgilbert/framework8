<script setup lang="ts">
const state = useSecurityRoles();

const columns = [
  // {  key: 'id',  label: 'ID'},
  // {  key: 'parent',  label: 'Parent'},
  {  key: 'name_es',  label: 'Permisos', sortable: false},
];

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
  //const link = state.value.allLinks.find(object => object.id === id);
}
</script>

<template>
  <div class="py-5 mx-5" >
    <UCard
      class="w-full"
      :ui="{
        body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
      }">
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
    <!--<UFormGroup
      name="profileLinks">
      <div
        v-for="(rootMenu, index) in allLinksRoot"
        :key="index">
        <h5 class="pt-2 text-md text-neutral-600 font-bold dark:text-white">
          {{ rootMenu.name_es }}
        </h5>
        <div
          v-for="(menu, index) in state.allLinks.filter(object => object.parent === rootMenu.id)"
          :key="index"
          class="py-2">
          <UCheckbox
            :label="menu.name_es!"
            :help="menu.comment_es!"
            v-model="state.profileLinks"
            :value="menu" />
        </div>
      </div>
    </UFormGroup>-->
  </div>
</template>