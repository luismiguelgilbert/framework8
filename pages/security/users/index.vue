<script setup lang="ts">
import FileSaver from 'file-saver';
import { type AxiosResponse } from 'axios';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { filter_keys_enum } from '@/typings/server/filter_payload';
import { PermissionsList } from '@/typings/client/permissionsEnum';

import { sort_options, status_options, type type_sys_users } from '@/typings/server/sys_users';
import EditForm from './[id]/index.vue';

useHead({ title: 'Usuarios' });
const { currentRoute, push } = useRouter();
const mainState = useUser();
const myAxios = useAxios();
const toast = useToast();
const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greaterOrEqual('sm');

//COMMON REFS
const isLoading = ref<boolean>(false);
const rowsNumber = ref(0);
const isSideOpen = ref(false);
//CUSTOM REFS
const state = useSecurityUsersMainCard().value;
const selectedFilter = computed(() => status_options.find(option => String(option.value) === state.payload.status));
const selectedSort = computed(() => sort_options.find(option => String(option.value) === state.payload.sortBy));
//CUSTOM PROPERTIES & PERMISSIONS
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
    ...status_options.map((option) => { return {...option, click: () => { updatePayload(filter_keys_enum.STATUS, String(option.value), true, true) } }})
  ],
  [
    ...sort_options.map((option) => { return {...option, click: () => { updatePayload(filter_keys_enum.SORT, String(option.value), true, true) } }})
  ]
];
const dropdownOptions = computed(() => {
  let dynamicOptions = [];
  if (allowCreate.value) { dynamicOptions.push({ label: 'Nuevo', icon: 'fas fa-plus-circle', click: () => { updatePayload(filter_keys_enum.ID, 'new', false, false) } }) };
  if (allowExport.value) { dynamicOptions.push({ label: 'Descargar', icon: 'fas fa-file-excel', click: () => { downloadFile() } }) };
  dynamicOptions.push({ label: 'Refrescar', icon: 'fas fa-arrows-rotate', click: () => { loadData() } });
  return dynamicOptions.length > 0
    ? [ ...[dynamicOptions], ...fixedOptions ]
    : [ ...fixedOptions ];
});
//ACTIONS
const syncPayloadWithQuery = () => {
  //Query to Payload
  if(state.payload.isDefault === '1') {
    const queryParams = currentRoute.value.query;
    Object.entries(queryParams)
      .filter(entry =>
        !entry[0].includes(filter_keys_enum.PAGE)
        && !entry[0].includes(filter_keys_enum.ROWS)
        && !entry[0].includes(filter_keys_enum.DEFAULT))
      .forEach(([key, value]) => {
        state.payload[key as filter_keys_enum] = value as string;
    });
  }
  //Payload to Query
  state.payload.isDefault = '0';
  let newQueries: Partial<Record<filter_keys_enum, string>> = {};
  Object.entries(state.payload)
    .filter(entry =>
      !entry[0].includes(filter_keys_enum.PAGE)
      && !entry[0].includes(filter_keys_enum.ROWS)
      && !entry[0].includes(filter_keys_enum.DEFAULT))
    .filter(entry => entry[1].length > 0)
    .forEach(([key, value]) => {
      newQueries[key as filter_keys_enum] = value;
  });
  push({ query: newQueries });
};
const resetData = () => {
  state.payload.page = '1';
  state.rows = [];
};
const updatePayload = (attribute: string, value: string|null, shouldResetData: boolean, shouldLoadData: boolean) => {
  shouldResetData && resetData();
  if (attribute === filter_keys_enum.STATUS) {
    state.payload.status = value ?? '';
  }
  if (attribute === filter_keys_enum.SORT) {
    state.payload.sortBy = value ?? '';
  }
  if (attribute === filter_keys_enum.ID) {
    state.payload.id = value ?? '';
    isSideOpen.value = !!state.payload.id;
  }
  syncPayloadWithQuery();
  shouldLoadData && loadData();
};
const updatePage = (newPage: number) => {
  state.payload.page = String(newPage);
  loadData();
};
const loadOnScroll = (event: UIEvent) => {
  const eventTarget = event.target as HTMLElement;
  const { scrollTop, clientHeight, scrollHeight } = eventTarget;
  const offset = 100;
  const isBottom = scrollTop + clientHeight + offset >= scrollHeight;
  const isMoreDataAvailable = rowsNumber.value > state.rows.length;
  if (isBottom && isMoreDataAvailable && !isLoading.value) {
    const newPage = state.payload.page ? Number(Number(state.payload.page)+1) : 1;
    updatePage(newPage);
  }
};
//CUSTOM ACTIONS
const loadData = async() => {
  try {
    isLoading.value = true;
    const response: AxiosResponse<type_sys_users[]> = await myAxios.post('/api/users', state.payload);
    const { data } = response;
    data.forEach((row) => {
      const existingIndex = state.rows.findIndex((item) => item.id === row.id);
      if (existingIndex >= 0) {
        state.rows[existingIndex] = row;
      } else {
        state.rows.push(row);
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
const downloadFile = async() => {
  isLoading.value = true;
  const { data } = await myAxios.post('/api/users/download', state.payload, { responseType: 'blob' });
  FileSaver.saveAs(data, "Usuarios.xlsx");
  isLoading.value = false;
};
//HOOKS
onMounted(async () => {
  resetData();
  syncPayloadWithQuery();
  await loadData();
  isSideOpen.value = !!state.payload.id;
});
</script>

<template>
  <div><!--Required to prevent hydration mismatch-->
    <DatalistHeader
      :dropdown-options="dropdownOptions"
      :is-loading="isLoading"
      v-model:payload-searchString="state.payload.searchString"
      hint="Buscar usuarios"
      @update-searchstring="updatePayload(filter_keys_enum.SEARCH, null, true, true)" />
    <DatalistMainCard
      :requires-company="false"
      :is-loading="isLoading"
      :is-side-open="isSideOpen"
      :selected-filter="selectedFilter?.label ?? '' "
      :selected-sort="selectedSort?.label ?? '' "
      :rows-number="rowsNumber ?? 0 "
      @table-scroll="loadOnScroll" >
      <template v-slot:table>
        <UTable
          :columns="columns"
          :rows="state.rows"
          :ui="{
            thead: 'collapse sm:visible',
            td: { base: 'py-5 pl-4 whitespace-nowrap'},
            divide: 'divide-y divide-white sm:divide-gray-200 dark:divide-gray-900 sm:dark:divide-gray-700',
            tbody: 'divide-y divide-white sm:divide-gray-100 dark:divide-gray-900 sm:dark:divide-gray-800',
          }"
          :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No hay datos.' }"
          @select="(row: type_sys_users) => updatePayload(filter_keys_enum.ID, String(row.id), false, false)">
          <!--Nombre-->
          <template #user_name-header>
            <span class="hidden sm:block">Usuario</span>
          </template>
          <template #user_name-data="{ row }: { row: type_sys_users }">
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
                  <div class="text-base font-semibold whitespace-normal break-all">{{ `${row.user_name} ${row.user_lastname}` }}</div>
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
                  <div class="text-base font-semibold whitespace-normal break-all">{{ `${row.user_name} ${row.user_lastname}` }}</div>
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
          <template #sys_profile_name-data="{ row }: { row: type_sys_users }">
            <!--Desktop-->
            <div v-if="smAndLarger">
              <div class="ps-3">
                <div class="text-base font-semibold">{{ row.sys_profile_name }}</div>
                <div class="font-normal text-gray-500">{{ row.id }}</div>
              </div>
            </div>
          </template>
        </UTable>
      </template>
      <template v-slot:editForm>
        <EditForm
          :allow-create="allowCreate"
          :allow-edit="allowEdit"
          @closed="updatePayload(filter_keys_enum.ID, null, false, true)" />
      </template>
    </DatalistMainCard>
  </div>
</template>