<script setup lang="ts">
import FileSaver from 'file-saver';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import type { type_sys_companies } from '@/typings/server/sys_companies'
import { sort_options, status_options} from '@/typings/server/sys_profiles'
import type { filter_payload } from '@/typings/server/filter_payload'
import { filter_payload_object, filter_keys_enum } from '@/typings/server/filter_payload'

useHead({ title: 'Perfiles' });
const { currentRoute, push } = useRouter();
const myAxios = useAxios();
const toast = useToast();
const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greaterOrEqual('sm');

const uiCard = computed(() => {
  return {
    base: '',
    ring: '',
    divide: smAndLarger.value ? 'divide-y divide-gray-200 dark:divide-gray-700' : 'divide-y divide-white dark:divide-gray-900',
    header: { padding: 'px-0 sm:px-0 py-0' },
    body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
    footer: { padding: 'p-4' },
    rounded: 'rounded-none sm:rounded-lg',
  }
});
const uiTable = computed(() => {
  return {
    td: { base: 'py-5 pl-4'},
    divide: smAndLarger.value ? 'divide-y divide-gray-300 dark:divide-gray-700' : 'divide-y divide-white dark:divide-gray-900',
    tbody: smAndLarger.value ? 'divide-y divide-gray-200 dark:divide-gray-800' : 'divide-y divide-white dark:divide-gray-900',
  }
});
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
//CUSTOM PROPERTIES
const rows = ref<type_sys_companies[]>([]);
const columns = [
  { key: 'name_es', name: 'name_es', field: 'name_es', label: 'Compañía', sortable: false },
  { key: 'created_at', name: 'created_at', field: 'created_at', label: 'Info', sortable: false },
  { key: 'is_active', name: 'is_active', field: 'is_active', label: 'Estado', sortable: false },
]
const items = [
  [
    {
      label: 'Nuevo',
      icon: 'fas fa-plus-circle',
      click: () => { goToForm() },
    },
    {
      label: 'Descargar',
      icon: 'fas fa-file-excel',
      click: () => { downloadFile() },
    },
  ],
  [
    ...status_options.map((option) => { return {...option, click: () => { updateFilter(option.value) } }})
  ],
  [
    ...sort_options.map((option) => { return {...option, click: () => { updateSorting(option.value) } }})
  ]
];
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
    { parameter: filter_keys_enum.PAGE, value: '1'},
    { parameter: filter_keys_enum.SEARCH, value: newString},
  ]
  updateQueryState(newQueries);
  loadData();
}, 1000);
const updateFilter = (newStatus: number) => {
  payload.value.status = String(newStatus);
  payload.value.page = '1';
  const newQueries = [
    { parameter: filter_keys_enum.PAGE, value: '1'},
    { parameter: filter_keys_enum.STATUS, value: String(newStatus)},
  ]
  updateQueryState(newQueries);
  loadData();
};
const updateSorting = (newSorting: number) => {
  payload.value.sortBy = String(newSorting);
  const newQueries = [
    { parameter: filter_keys_enum.SORT, value: String(newSorting)},
  ]
  updateQueryState(newQueries);
  loadData();
};
const updatePage = (newPage: number) => {
  payload.value.page = String(newPage);
  const newQueries = [
    { parameter: filter_keys_enum.PAGE, value: String(newPage)},
  ]
  updateQueryState(newQueries);
  loadData();
};
//ACTIONS
const loadData = async() => {
  try {
    isLoading.value = true;
    const response = await myAxios.post('/api/companies', payload.value);
    const { data } = response;
    rows.value = data;
    rowsNumber.value = data[0]?.row_count ?? 0;
  } catch(error) {
    console.error(error);
    toast.add({ title: 'Error cargando datos', icon: 'i-heroicons-exclamation-triangle', color: 'red' });
  } finally {
    isLoading.value = false;
  }
};
const goToForm = (row?: type_sys_companies) => {
  const queryParams = currentRoute.value.query;
  const querystring = Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join('&');
  if(row && row.id) {
    navigateTo(`/security/companies/${row.id}${querystring ? `?${querystring}` : ''}`);
  } else {
    navigateTo(`/security/companies/new${querystring ? `?${querystring}` : ''}`);
  }
};
const downloadFile = async() => {
  isLoading.value = true;
  const { data } = await myAxios.post('/api/companies/download', payload.value, { responseType: 'blob' });
  FileSaver.saveAs(data, "Perfiles.xlsx");
  isLoading.value = false;
};
//HOOKS
onMounted(() => {
  initialQueryStateIntoRefs();
  loadData();
});
</script>

<template>
  <div class="max-w-3xl mx-auto"><!--Required to prevent hydration mismatch-->
    <UCard :ui="uiCard">
      <!--HEADER-->
      <template #header>
        <div class="flex items-center justify-between gap-3 px-4 py-3">
          <UInput
            :model-value="payload.searchString"
            :loading="isLoading"
            :variant="smAndLarger ? 'outline' : 'none'"
            size="xl"
            placeholder="Buscar..."
            @input="(event: InputEvent) => updateSearchString((event.target as HTMLInputElement).value)">
            <template #trailing>
              <i v-if="smAndLarger" class="fas fa-search fa-xl text-gray-500"></i>
            </template>
          </UInput>
          <div class="px-1"></div>
          <div>
            <UDropdown
              :items="items"
              :popper="{ placement: 'bottom-start' }">
              <UButton
                variant="solid"
                icon="i-heroicons-bars-3"
                size="xl"
                :loading="isLoading"
                label="Opciones"
                trailing-icon="i-heroicons-chevron-down-20-solid" />
            </UDropdown>
          </div>
        </div>
      </template>
      <!--BODY-->
      <div class="h-[calc(100dvh-205px)] sm:h-[calc(100dvh-170px)] overflow-x-hidden">
        <div class="border border-neutral-100 dark:border-neutral-700" />
        <UTable
          :columns="columns"
          :rows="rows"
          :loading="isLoading"
          :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
          :ui="uiTable"
          @select="goToForm">
          <!--Nombre-->
          <template #name_es-data="{ row }">
            <div class="flex items-center flex-row">
              <!--<UAvatar
                :chip-color="row.is_active ? 'primary' : 'rose'"
                chip-text=""
                chip-position="top-right"
                size="sm">
                {{ String(row.id) }}
              </UAvatar>-->
              <dl class="pl-2">
                <dd class="font-semibold">{{ row.name_es_short }}</dd>
                <div class="flex-row">
                  <i class="fas fa-building fa-sm text-gray-400"></i>
                  {{ row.name_es }}
                </div>
                <div class="flex-row">
                  <i class="fas fa-hashtag fa-sm text-gray-400"></i>
                  {{ row.company_number }}
                </div>

                <!--Mobile-->
                <div class="flex-row items-center flex sm:hidden">
                  <i class="fas fa-user-circle text-gray-400"></i>
                  <span class="font-semibold pl-1">{{ `${row.sys_profile_name}` }}</span>
                </div>
                <div class="flex-row items-center flex sm:hidden">
                  <i class="fas fa-door-open text-gray-400"></i>
                  <!--<span class="pl-1">{{ new Intl.DateTimeFormat("es", { day: "numeric", month: "long", year: "numeric" }).format(new Date(row.last_sign_in_at)) }}</span>-->
                </div>
              </dl>
            </div>
          </template>
          <!--Info-->
          <template #created_at-data="{ row }">
            <div class="flex items-center flex-row">
              <dl class="pl-2">
                <dd class="font-semibold">{{ row.billing_address }}</dd>
                <div class="flex-row">
                  <i class="fas fa-hashtag fa-sm text-gray-400"></i>
                  {{ row.billing_phone }}
                </div>
              </dl>
            </div>
          </template>
          <!--Estado-->
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
      <!--FOOTER-->
      <template #footer>
        <div class="flex justify-between items-center">
          <UPagination
            :model-value="Number(payload.page)"
            :page-count="Number(payload.rowsPerPage)"
            :total="rowsNumber"
            :max="4"
            size="md"
            @update:model-value="(e) => updatePage(e)" />
          <div>
            <span>{{ rowsNumber }}</span>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>