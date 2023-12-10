<script setup lang="ts">
import FileSaver from 'file-saver';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { sort_options, status_options} from '@/typings/server/sys_companies';
import { filter_payload_object, filter_keys_enum } from '@/typings/server/filter_payload';
import type { type_sys_companies } from '@/typings/server/sys_companies';
import type { filter_payload } from '@/typings/server/filter_payload';
import EditForm from './[id]/index.vue';
import { PermissionsList } from '@/typings/client/permissionsEnum';

useHead({ title: 'Compañías' });
const mainState = useUser();
const { currentRoute, push } = useRouter();
const myAxios = useAxios();
const toast = useToast();
const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greaterOrEqual('sm');

const uiTable = computed(() => {
  return {
    thead: smAndLarger.value ? 'visible' : 'hidden',
    td: { base: 'py-5 pl-4'},
    divide: smAndLarger.value ? 'divide-y divide-gray-300 dark:divide-gray-700' : 'divide-y divide-white dark:divide-gray-900',
    tbody: smAndLarger.value ? 'divide-y divide-gray-200 dark:divide-gray-800' : 'divide-y divide-white dark:divide-gray-900',
  }
});
const uiMainCard = { 
  body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' } ,
  rounded: 'rounded-none',
};
const uiMobileButton = { rounded: 'rounded-none' };
const uiOptions = { rounded: 'rounded-none sm:rounded-lg'};
const uiTableContainer = { 
  rounded: 'rounded-none sm:rounded-lg',
  header: { padding: 'px-1 sm:px-4 py-2', background: 'bg-gray-100 dark:bg-gray-800' },
  body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' } ,
};
const uiSlide = {width: 'w-screen max-w-lg'};
//COMMON REFS
const isLoading = ref<boolean>(false);
const rowsNumber = ref(0);
const payload = ref<filter_payload>(filter_payload_object.parse({
  page: '1',
  rowsPerPage: 20,
  searchString: '',
  sortBy: '1',
  filter: '1',
}));
const selectedFilter = computed(() => status_options.find(option => String(option.value) === payload.value.status));
const selectedSort = computed(() => sort_options.find(option => String(option.value) === payload.value.sortBy));
const isSideOpen = ref(false);
//CUSTOM PROPERTIES & PERMISSIONS
const rows = shallowRef<type_sys_companies[]>([]);
const allowCreate = computed<boolean>(() => mainState.value.menuData.some((item) => item.id === PermissionsList.COMPANIES_CREATE));
const allowEdit = computed<boolean>(() => mainState.value.menuData.some((item) => item.id === PermissionsList.COMPANIES_EDIT));
const allowExport = computed<boolean>(() => mainState.value.menuData.some((item) => item.id === PermissionsList.COMPANIES_EXPORT));
const columns = computed(() => {
  const visibleAlways = { key: 'name_es', name: 'name_es', field: 'name_es', label: 'Compañía', sortable: false };
  const visibleDesktop = [
    { key: 'name_es_short', name: 'name_es_short', field: 'name_es_short', label: 'Nombre', sortable: false },
    // { key: 'created_at', name: 'created_at', field: 'created_at', label: 'Fecha creación', sortable: false },
    { key: 'is_active', name: 'is_active', field: 'is_active', label: 'Estado', sortable: false },
  ];
  return smAndLarger.value ? [visibleAlways, ...visibleDesktop] : [visibleAlways];
});
const fixedOptions = [
  [
    ...status_options.map((option) => { return {...option, click: () => { updateFilter(option.value) } }})
  ],
  [
    ...sort_options.map((option) => { return {...option, click: () => { updateSorting(option.value) } }})
  ]
];
const dropdownOptions = computed(() => {
  let dynamicOptions = [];
  if (allowCreate.value) { dynamicOptions.push({ label: 'Nuevo', icon: 'fas fa-plus-circle', click: () => { goToForm() } }) };
  if (allowExport.value) { dynamicOptions.push({ label: 'Descargar', icon: 'fas fa-file-excel', click: () => { downloadFile() } }) };
  dynamicOptions.push({ label: 'Refrescar', icon: 'fas fa-arrows-rotate', click: () => { loadData() } });
  return dynamicOptions.length > 0
    ? [ ...[dynamicOptions], ...fixedOptions ]
    : [ ...fixedOptions ];
})
//QUERY ROUTER PROPERTIES
const updateQueryState = (newQueries: Array<{parameter: filter_keys_enum, value: string}>) => {
  const newQuery = { ...currentRoute.value.query }
  newQueries.forEach((query) => {
    newQuery[query.parameter] = query.value;
  });
  push({ query: newQuery });
};
const initialQueryStateIntoRefs = () => {
  const queryParams = currentRoute.value.query;
  Object.entries(queryParams).forEach(([key, value]) => {
    const name: filter_keys_enum = key as filter_keys_enum;
    payload.value[name] = value as string;
  });
};
const updateSearchString = useDebounceFn((newString: string) => {
  payload.value.searchString = newString;
  payload.value.page = '1';
  const newQueries = [
    { parameter: filter_keys_enum.SEARCH, value: newString},
  ]
  updateQueryState(newQueries);
  rows.value = [];
  loadData();
}, 1000);
const updateFilter = (newStatus: number) => {
  payload.value.status = String(newStatus);
  payload.value.page = '1';
  const newQueries = [
    { parameter: filter_keys_enum.STATUS, value: String(newStatus)},
  ]
  updateQueryState(newQueries);
  rows.value = [];
  loadData();
};
const updateSorting = (newSorting: number) => {
  payload.value.sortBy = String(newSorting);
  payload.value.page = '1';
  const newQueries = [
    { parameter: filter_keys_enum.SORT, value: String(newSorting)},
  ]
  updateQueryState(newQueries);
  rows.value = [];
  loadData();
};
const updatePage = (newPage: number) => {
  payload.value.page = String(newPage);
  loadData();
};
//ACTIONS
const loadData = async() => {
  try {
    isLoading.value = true;
    const response = await myAxios.post('/api/companies', payload.value);
    const { data } = response;
    rows.value = rows.value.concat(data).filter((arr, index, self) => index === self.findIndex((t) => (t.id === arr.id)));
    rowsNumber.value = data[0]?.row_count ?? 0;
  } catch(error) {
    console.error(error);
    toast.add({ title: 'Error cargando datos', icon: 'i-heroicons-exclamation-triangle', color: 'red' });
  } finally {
    isLoading.value = false;
  }
};
const goToForm = (row?: type_sys_companies) => {
  const rowValue = row?.id ? String(row?.id) : 'new';
  const newQueries = [
    { parameter: filter_keys_enum.ID, value: rowValue },
  ]
  updateQueryState(newQueries);
  isSideOpen.value = true;
};
const shouldOpenSide = () => {
  const queryParams = currentRoute.value.query;
  if (queryParams.id) {
    isSideOpen.value = true;
  }
};
const downloadFile = async() => {
  isLoading.value = true;
  const { data } = await myAxios.post('/api/companies/download', payload.value, { responseType: 'blob' });
  FileSaver.saveAs(data, "Companias.xlsx");
  isLoading.value = false;
};
const loadOnScroll = (event: UIEvent) => {
  const eventTarget = event.target as HTMLElement;
  const { scrollTop, clientHeight, scrollHeight } = eventTarget;
  const offset = 100;
  const isBottom = scrollTop + clientHeight + offset >= scrollHeight;
  const isMoreDataAvailable = rowsNumber.value > rows.value.length;
  if (isBottom && isMoreDataAvailable && !isLoading.value) {
    const newPage = payload.value.page ? Number(Number(payload.value.page)+1) : 1;
    updatePage(newPage);
  }
};
//HOOKS
onMounted(async () => {
  initialQueryStateIntoRefs();
  await loadData();
  shouldOpenSide();
});
</script>

<template>
  <div><!--Required to prevent hydration mismatch-->
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
          <UInput
            :model-value="payload.searchString"
            :variant="smAndLarger ? 'outline' : 'none'"
            size="xl"
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="Buscar Compañías..."
            @input="(event: InputEvent) => updateSearchString((event.target as HTMLInputElement).value)">
          </UInput>
          <div class="px-1"></div>
          <div>
            <UDropdown
              :items="dropdownOptions"
              :popper="{ placement: 'bottom-start' }">
              <UButton
                :variant="smAndLarger ? 'solid' : 'ghost'"
                :ui="uiOptions"
                :loading="isLoading"
                :label="smAndLarger ? 'Opciones' : ''"
                :trailing-icon="smAndLarger ? 'i-heroicons-chevron-down-20-solid' : ''"
                icon="i-heroicons-cog"
                size="xl"
                class="px-4 py-4" />
            </UDropdown>
          </div>
        </div>
      </div>
    </UCard>
    <div v-if="smAndLarger" class="h-2">
      <UProgress v-if="isLoading" animation="carousel" />
    </div>
    <div class="max-w-3xl mx-auto mt-0 sm:mt-3">
      <UCard :ui="uiTableContainer">
        <!--HEADER-->
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <span>
              <UIcon name="pl-1 fas fa-filter text-gray-400" />
              <span class="pl-2 font-bold">{{ selectedFilter?.label }}</span>
              <UIcon v-if="smAndLarger" name="pl-6 fas fa-arrow-up-short-wide text-gray-500" />
              <span v-if="smAndLarger" class="pl-2 font-bold">{{ selectedSort?.label }}</span>
            </span>
            <span class="font-semibold pr-1">{{ rowsNumber }} registros</span>
          </div>
        </template>
        <!--BODY-->
        <div class="h-[calc(100dvh-100px)] sm:h-[calc(100dvh-170px)] overflow-x-hidden" @scroll="loadOnScroll">
          <UTable
            :columns="columns"
            :rows="rows"
            :ui="uiTable"
            :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No hay datos.' }"
            @select="goToForm">
            <!--RazónSocial-->
            <template #name_es-header>
              <span class="hidden sm:block">Compañía</span>
            </template>
            <template #name_es-data="{ row }">
              <!--Desktop-->
              <div v-if="smAndLarger">
                <div class="flex items-center flex-row">
                  <UChip
                    inset
                    :color="row.is_active ? 'primary' : 'rose'" >
                    <UAvatar size="sm">
                      {{ row.name_es[0] }}
                    </UAvatar>
                  </UChip>
                  <div class="ps-3">
                    <div class="text-base font-semibold">{{ row.name_es_short }}</div>
                    <div class="font-normal text-gray-500">{{ row.name_es }}</div>
                    <div class="font-normal text-gray-500">{{ `RUC: ${row.company_number}` }}</div>
                  </div>
                </div>
              </div>
              <!--Mobile-->
              <div v-if="!smAndLarger" style="width: calc(90vw); overflow-x: hidden; text-overflow: ellipsis;">
                <div class="flex flex-row items-center">
                  <UChip
                    inset
                    :color="row.is_active ? 'primary' : 'rose'" >
                    <UAvatar size="sm">
                      {{ row.name_es[0] }}
                    </UAvatar>
                  </UChip>
                  <div class="ps-3">
                    <div style="text-wrap: pretty; overflow-wrap: break-word;" class="text-base font-semibold">{{ String(row.name_es_short).replaceAll('_', ' ') }}</div>
                    <div class="font-normal text-gray-500">{{ `${row.name_es}` }}</div>
                    <div class="font-normal text-gray-500">{{ `${row.company_number}` }}</div>
                  </div>
                </div>
              </div>
            </template>
            <!--Nombre-->
            <template #name_es_short-header>
              <span class="hidden sm:block">Nombre</span>
            </template>
            <template #name_es_short-data="{ row }">
              <div class="ps-3">
                <div class="flex items-center">
                  <i class="hidden sm:block fa-solid fa-phone text-gray-400 pr-2"></i>
                  <div class="font-normal text-gray-500">{{ `${row.billing_phone}` }}</div>
                </div>
                <div class="flex items-center w-15 whitespace-break-spaces">
                  <i class="hidden sm:block fa-solid fa-location-pin text-gray-400 pr-2"></i>
                  <div class="font-normal text-gray-500 ">{{ `${row.billing_address}` }}</div>
                </div>
              </div>
            </template>
            <template #is_active-header>
              <span class="hidden sm:block">Activo?</span>
            </template>
            <template #is_active-data="{ row }">
              <span class="hidden sm:block">
              <UBadge
                v-if="row.is_active"
                class="ml-2"
                variant="soft"
                color="primary"
                label="&#9679; Activo" />
              <UBadge
                v-else
                class="ml-2"
                variant="soft" 
                color="rose"
                label="&#9679; Inactivo" />
              </span>
            </template>
          </UTable>
        </div>
      </UCard>
    </div>
    <div v-if="!smAndLarger" class="h-2">
      <UProgress v-if="isLoading" animation="carousel" />
    </div>
    <USlideover
      :ui="uiSlide"
      v-model="isSideOpen"
      prevent-close>
      <EditForm
        :allow-create="allowCreate"
        :allow-edit="allowEdit"
        @closed="isSideOpen = false" />
    </USlideover>
  </div>
</template>