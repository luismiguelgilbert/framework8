<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { type AxiosResponse } from 'axios';
import type { type_traselec_prj_master } from '@/typings/server/traselec';

const uiMainCard = { 
  body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' } ,
  rounded: 'rounded-none',
};
const uiMobileButton = { rounded: 'rounded-none' };

const mainState = useUser();
const myAxios = useAxios();
const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greaterOrEqual('sm');
const selected = ref<number>();
const projects = ref<type_traselec_prj_master[]>();
const loadData = async() => {
  const response: AxiosResponse<type_traselec_prj_master[]> = await myAxios.get(`/api/traselec/prj_root`);
  projects.value = response.data;
};
//HOOKS
onMounted(async () => {
  await loadData();
});
</script>

<template>
  <UCard :ui="uiMainCard">
    <div
      class="w-full bg-white"
      :class="smAndLarger ? 'dark:bg-gray-900' : 'dark:bg-gray-900'">
      <div class="flex items-center justify-between gap-3 px-0 py-0 sm:px-4 sm:py-3">
        <UButton
          v-if="!smAndLarger"
          :ui="uiMobileButton"
          variant="ghost"
          icon="i-heroicons-bars-4"
          size="xl"
          class="px-4 py-4"
          @click="mainState.isMenuOpen = true" />
        <USelectMenu
          v-model="selected"
          :options="projects"
          class="w-full pr-20 md:pr-2"
          placeholder="Seleccione el proyecto"
          searchable-placeholder="Buscar proyecto..."
          :search-attributes="['project_name', 'partner_name']"
          option-attribute="project_name"
          value-attribute="project_id"
          size="xl"
          block
          searchable>
          <template #label>
            <span v-if="selected && projects" class="truncate">{{ projects.find(x=> x.project_id === selected)?.project_name}}</span>
            <span v-else class="text-gray-400 dark:text-gray-500">Seleccione el proyecto</span>
          </template>
          <template #option-empty="{ query }">
            <q>{{ query }}</q> not found
          </template>
          <template #option="{ option }: { option: type_traselec_prj_master }">
            <div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
              <div v-if="option.project_id === selected" class="font-semibold text-primary-500">{{ option.project_name }}</div>
              <div v-if="option.project_id !== selected" class="font-semibold">{{ option.project_name }}</div>
              <div class="text-xs font-light truncate">{{ option.partner_name }}</div>
            </div>
          </template>
        </USelectMenu>
      </div>
    </div>
  </UCard>
</template>