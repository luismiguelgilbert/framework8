<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { type AxiosResponse } from 'axios';
import type { type_traselec_prj_master, type_traselec_prj_master_budgets, type_traselec_prj_master_budget_inv } from '@/typings/server/traselec';

const uiMainCard = { 
  body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' } ,
  rounded: 'rounded-none',
};
const uiMobileButton = { rounded: 'rounded-none' };

const mainState = useUser();
const myAxios = useAxios();
const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greaterOrEqual('sm');
const projectSelected = ref<number>();
const budgetSelected = ref<number>();
const isProjectsLoading = ref<boolean>(false);
const isInventoryLoading = ref<boolean>(false);
const projects = ref<type_traselec_prj_master[]>();
const budgets = ref<type_traselec_prj_master_budgets[]>();
const inventory = ref();
const getProjects = async() => {
  isProjectsLoading.value = true;
  const response: AxiosResponse<type_traselec_prj_master[]> = await myAxios.get(`/api/traselec/prj_root`);
  projects.value = response.data;
  budgets.value = [];
  inventory.value = [];
  isProjectsLoading.value = false;
};
const getBudgets = async() => {
  if (projectSelected.value) {
    isProjectsLoading.value = true;
    budgetSelected.value = undefined;
    const response: AxiosResponse<type_traselec_prj_master[]> = await myAxios.post('/api/traselec/prj_budgets', projectSelected.value);
    budgets.value = response.data;
    inventory.value = [];
    isProjectsLoading.value = false;
  }
};
const getInventory = async() => {
  if (budgetSelected.value) {
    isInventoryLoading.value = true;
    const response: AxiosResponse<type_traselec_prj_master_budget_inv[]> = await myAxios.post('/api/traselec/prj_budget_inv', budgetSelected.value);
    inventory.value = response.data;
    isInventoryLoading.value = false;
  }
}
//HOOKS
onMounted(async () => {
  await getProjects();
});
</script>

<template>
  <div>
    <UCard :ui="uiMainCard">
      <div
        class="w-full bg-white"
        :class="smAndLarger ? 'dark:bg-gray-900' : 'dark:bg-gray-900'">
        <div class="flex items-start justify-between gap-3 px-0 py-0 sm:px-4 sm:py-3">
          <UButton
            v-if="!smAndLarger"
            :ui="uiMobileButton"
            variant="ghost"
            icon="i-heroicons-bars-4"
            size="xl"
            class="px-4 py-4"
            @click="mainState.isMenuOpen = true" />
          <div class="space-y-4 w-full">
            <UFormGroup
              class="w-full pr-20 md:pr-2"
              label="Obra/Proyecto"
              size="xl"
              name="projectSelected">
              <USelectMenu
                v-model="projectSelected"
                :options="projects"
                :loading="isProjectsLoading"
                placeholder="Seleccione el proyecto"
                searchable-placeholder="Buscar proyecto..."
                :search-attributes="['project_name', 'partner_name']"
                option-attribute="project_name"
                value-attribute="project_id"
                size="xl"
                block
                searchable
                @update:model-value="getBudgets" >
                <template #label>
                  <span v-if="projectSelected && projects" class="truncate">{{ projects.find(x=> x.project_id === projectSelected)?.project_name}}</span>
                  <span v-else class="text-gray-400 dark:text-gray-500">Seleccione el proyecto</span>
                </template>
                <template #option-empty="{ query }">
                  <q>{{ query }}</q> not found
                </template>
                <template #option="{ option }: { option: type_traselec_prj_master }">
                  <div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    <div v-if="option.project_id === projectSelected" class="font-semibold text-primary-500">{{ option.project_name }}</div>
                    <div v-if="option.project_id !== projectSelected" class="font-semibold">{{ option.project_name }}</div>
                    <div class="text-xs font-light truncate">{{ option.partner_name }}</div>
                  </div>
                </template>
              </USelectMenu>
            </UFormGroup>
            <UFormGroup
              class="w-full pr-20 md:pr-2 pb-2"
              label="Presupuesto"
              size="xl"
              name="selected">
              <USelectMenu
                v-model="budgetSelected"
                :options="budgets"
                :loading="isProjectsLoading"
                placeholder="Seleccione el presupuesto"
                searchable-placeholder="Presupuesto..."
                :search-attributes="['project_name', 'partner_name']"
                option-attribute="project_name"
                value-attribute="project_id"
                size="xl"
                block
                searchable
                @update:model-value="getInventory">
                <template #label>
                  <span v-if="budgetSelected && budgets" class="truncate">{{ budgets.find(x=> x.project_id === budgetSelected)?.code}}</span>
                  <span v-else class="text-gray-400 dark:text-gray-500">Seleccione el presupuesto</span>
                </template>
                <template #option-empty="{ query }">
                  <q>{{ query }}</q> not found
                </template>
                <template #option="{ option }: { option: type_traselec_prj_master_budgets }">
                  <div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    <div v-if="option.project_id === budgetSelected" class="font-semibold text-primary-500">{{ option.code }}</div>
                    <div v-if="option.project_id !== budgetSelected" class="font-semibold">{{ option.code }}</div>
                    <div class="text-xs font-light truncate">{{ option.name }}</div>
                  </div>
                </template>
              </USelectMenu>
            </UFormGroup>
          </div>
        </div>
      </div>
    </UCard>
    <UTable
      class="h-[calc(100dvh-170px)] sm:h-[calc(100dvh-190px)] overflow-x-hidden"
      :columns="[{ key: 'product', name: 'product', field: 'product', label: 'Item', sortable: false }]"
      :rows="inventory"
      :loading="isInventoryLoading">
      <template #product-data="{ row }: { row: type_traselec_prj_master_budget_inv }">
        <div class="flex	">
          <div class="w-full">
            <div
              style="text-wrap: pretty; overflow-wrap: break-word;"
              class="text-base font-semibold">{{ String(row.inv_name).replaceAll('_', ' ') }}
              <span class="font-normal text-gray-500">{{ `(${row.inv_code})` }}</span>
            </div>
              <UMeterGroup
                :min="0"
                :max="row.inv_budget_qty > row.inv_real_qty ? row.inv_budget_qty : row.inv_real_qty"
                size="md"
                icon="i-heroicons-minus">
                <UMeter
                  :value="row.inv_budget_qty > row.inv_real_qty ? row.inv_real_qty : row.inv_budget_qty"
                  color="green"
                  :label="row.inv_budget_qty > row.inv_real_qty ? 'Consumo' : 'Presupuesto'"/>
                <UMeter
                  v-if="row.inv_real_qty > row.inv_budget_qty"
                  :value="Math.abs(row.inv_real_qty - row.inv_budget_qty)" 
                  color="red"
                  label="Exceso" />
                <template #indicator>
                  <div class="flex gap-1.5 justify-end text-sm">
                    <p>{{ row.inv_real_qty }} /</p>
                    <p class="text-gray-500 dark:text-gray-400">
                      {{ row.inv_budget_qty }} {{ row.inv_uom_name }} 
                    </p>
                  </div>
                </template>
              </UMeterGroup>
          </div>
        </div>
      </template>
    </UTable>
  </div>
</template>