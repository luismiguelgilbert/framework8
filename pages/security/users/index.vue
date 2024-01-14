<script setup lang="ts">
import FileSaver from 'file-saver';
import type { AxiosResponse } from 'axios';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { sort_options, status_options } from '@/typings/server/sys_users';
import { filter_payload_object, filter_keys_enum } from '@/typings/server/filter_payload';
import type { type_sys_users } from '@/typings/server/sys_users';
import type { filter_payload } from '@/typings/server/filter_payload';
import EditForm from './[id]/index.vue';
import { PermissionsList } from '@/typings/client/permissionsEnum';

useHead({ title: 'Usuarios' });
const mainState = useUser();
const { currentRoute, push } = useRouter();
const myAxios = useAxios();
const toast = useToast();
const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greaterOrEqual('sm');
const lgAndLarger = breakpoints.greaterOrEqual('lg');

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
  rounded: 'rounded-none xl:rounded-lg',
  header: { padding: 'px-1 sm:px-4 py-2', background: 'bg-gray-100 dark:bg-gray-800 xl:rounded-t-lg' },
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
const rows = ref<type_sys_users[]>([]);
const allowCreate = computed<boolean>(() => mainState.value.menuData.some((item) => item.id === PermissionsList.USERS_CREATE));
const allowEdit = computed<boolean>(() => mainState.value.menuData.some((item) => item.id === PermissionsList.USERS_EDIT));
const allowExport = computed<boolean>(() => mainState.value.menuData.some((item) => item.id === PermissionsList.USERS_EXPORT));
const columns = computed(() => {
  const visibleAlways = { key: 'user_name', name: 'user_name', field: 'user_name', label: 'Usuario', sortable: false };
  const visibleDesktop = [
    { key: 'sys_profile_name', name: 'sys_profile_name', field: 'sys_profile_name', label: 'Perfil', sortable: false },
    // { key: 'created_at', name: 'created_at', field: 'created_at', label: 'Fecha creación', sortable: false },
    // { key: 'is_active', name: 'is_active', field: 'is_active', label: 'Estado', sortable: false },
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
const updateSearchString = () => {
  payload.value.page = '1';
  const newQueries = [
    { parameter: filter_keys_enum.SEARCH, value: payload.value.searchString!},
  ]
  updateQueryState(newQueries);
  rows.value = [];
  loadData();
};
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
    const response: AxiosResponse<type_sys_users[]> = await myAxios.post('/api/users', payload.value);
    const { data } = response;
    data.forEach((row) => {
      const existingIndex = rows.value.findIndex((item) => item.id === row.id);
      if (existingIndex >= 0) {
        rows.value[existingIndex] = row;
      } else {
        rows.value.push(row);
      }
    });
    rowsNumber.value = data[0]?.row_count ?? 0;
  } catch(error) {
    console.error(error);
    toast.add({ title: 'Error cargando datos', icon: 'i-heroicons-exclamation-triangle', color: 'red' });
  } finally {
    isLoading.value = false;
  }
};
const goToForm = (row?: type_sys_users) => {
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
  const { data } = await myAxios.post('/api/users/download', payload.value, { responseType: 'blob' });
  FileSaver.saveAs(data, "Usuarios.xlsx");
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
const closeAndRefresh = () => {
  isSideOpen.value = false
  loadData();
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
    <DatalistHeader
      :dropdown-options="dropdownOptions"
      :is-loading="isLoading"
      v-model:payload-searchString="payload.searchString"
      hint="Buscar usuarios"
      @update-searchstring="updateSearchString" />
    <div class="max-w-full xl:max-w-3xl mx-auto mt-0 xl:mt-3">
      <UCard :ui="uiTableContainer">
        <!--HEADER-->
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <span>
              <UIcon name="pl-1 fas fa-filter text-gray-400" />
              <span class="pl-2 font-bold">{{ selectedFilter?.label }}</span>
              <UIcon v-if="lgAndLarger" name="pl-6 fas fa-arrow-up-short-wide text-gray-500" />
              <span v-if="lgAndLarger" class="pl-2 font-bold">{{ selectedSort?.label }}</span>
            </span>
            <span class="font-semibold pr-1">{{ rowsNumber }} registros</span>
          </div>
        </template>
        <!--BODY-->
        <div class="h-[calc(100dvh-95px)] sm:h-[calc(100dvh-120px)] xl:h-[calc(100dvh-170px)] overflow-x-hidden" @scroll="loadOnScroll">
          <UProgress v-if="isLoading" animation="carousel" class="max-w-3xl absolute z-50" />
          <UTable
            :columns="columns"
            :rows="rows"
            :ui="uiTable"
            :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No hay datos.' }"
            @select="goToForm">
            <!--Nombre-->
            <template #user_name-header>
              <span class="hidden sm:block">Usuario</span>
            </template>
            <template #user_name-data="{ row }">
              <div v-if="smAndLarger">
                <div class="flex items-center flex-row">
                  <UAvatar
                    v-if="row.avatar_url && row.avatar_url.length > 0"
                    :src="row.avatar_url"
                    :avatar="{ src: row.avatar_url }"
                    size="sm" i>
                  </UAvatar>
                  <UAvatar
                    v-else
                    size="sm">
                    {{ row.user_name[0] }}
                  </UAvatar>
                  <div class="ps-3">
                    <div style="text-wrap: pretty; overflow-wrap: break-word;" class="text-base font-semibold">{{ `${row.user_name} ${row.user_lastname}` }}</div>
                    <div class="font-normal text-gray-500">{{ row.email }}</div>
                  </div>
                </div>
              </div>
              <!--Mobile-->
              <div v-if="!smAndLarger" style="width: calc(90vw); overflow-x: hidden; text-overflow: ellipsis;">
                <div class="flex flex-row items-center">
                  <UAvatar size="sm">
                    {{ row.user_name[0] }}
                  </UAvatar>
                  <div class="ps-3">
                    <div style="text-wrap: pretty; overflow-wrap: break-word;" class="text-base font-semibold">{{ `${row.user_name} ${row.user_lastname}` }}</div>
                    <div class="font-normal text-gray-500">{{ row.email }}</div>
                    <div class="font-normal text-gray-500">{{ row.sys_profile_name }}</div>
                  </div>
                </div>
              </div>
            </template>
            <!--Profile-->
            <template #sys_profile_name-header>
              <span class="hidden sm:block pl-2">Perfil</span>
            </template>
            <template #sys_profile_name-data="{ row }">
              <!--Desktop-->
              <div v-if="smAndLarger">
                <div class="ps-3">
                  <div class="text-base font-semibold">{{ row.sys_profile_name }}</div>
                  <div class="font-normal text-gray-500">{{ row.id }}</div>
                </div>
              </div>
            </template>
          </UTable>
          <br /><br />
        </div>
      </UCard>
    </div>
    <USlideover
      :ui="uiSlide"
      v-model="isSideOpen"
      prevent-close>
      <EditForm
        :allow-create="allowCreate"
        :allow-edit="allowEdit"
        @closed="closeAndRefresh" />
    </USlideover>
  </div>
</template>