<script setup lang="ts">
import type { type_sys_profiles } from '@/typings/server/sys_profiles'
import { sort_options, status_options} from '@/typings/server/sys_profiles'
import type { filter_payload } from '@/typings/server/filter_payload'
import { filter_payload_object, filter_keys_enum } from '@/typings/server/filter_payload'

useHead({ title: 'Roles' });
const { currentRoute, push } = useRouter();
const myAxios = useAxios();
const toast = useToast();
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
const rows = ref([]);//TODO: SET TYPE
const columns = [
  { key: 'id', name: 'id', field: 'id', label: 'Código', sortable: false },
  { key: 'name_es', name: 'name_es', field: 'name_es', label: 'Perfil', sortable: false },
  { key: 'created_at', name: 'created_at', field: 'created_at', label: 'Fecha creación', sortable: false },
  { key: 'is_active', name: 'is_active', field: 'is_active', label: 'Estado', sortable: false },
]
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
//QUERY ROUTER PROPERTIES
const loadData = async() => {
  try {
    isLoading.value = true;
    const response = await myAxios.post('/api/roles', payload.value);
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
const goToForm = (row?: type_sys_profiles) => {
  const queryParams = currentRoute.value.query;
  const querystring = Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join('&');
  if(row && row.id) {
    navigateTo(`/security/roles/${row.id}${querystring ? `?${querystring}` : ''}`);
  } else {
    navigateTo(`/security/roles/new${querystring ? `?${querystring}` : ''}`);
  }
};
onMounted(() => {
  initialQueryStateIntoRefs();
  loadData();
});
</script>

<template>
  <div class="max-w-3xl mx-auto"><!--Required to prevent hydration mismatch-->
    <UCard
      :ui="{
        base: '',
        ring: '',
        divide: 'divide-y divide-gray-200 dark:divide-gray-700',
        header: { padding: 'px-4 py-5' },
        body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
        footer: { padding: 'p-4' },
        rounded: 'rounded-none sm:rounded-lg',
      }">
      <div class="flex items-center justify-between gap-3 px-4 py-3">
        <UInput
          :model-value="payload.searchString"
          :loading="isLoading"
          size="xl"
          placeholder="Buscar..."
          @input="(event: InputEvent) => updateSearchString((event.target as HTMLInputElement).value)">
          <template #trailing>
            <i class="fas fa-search fa-xl text-gray-500"></i>
          </template>
        </UInput>
        <div class="px-1"></div>
        <div>
          <UButton
            variant="solid"
            type="submit"
            label="Nuevo"
            size="xl"
            @click="goToForm">
            <template #leading>
              <i class="fas fa-circle-plus fa-xl"></i>
            </template>
          </UButton>
        </div>
      </div>

      <div class="flex items-center justify-between gap-3 px-4 py-3">
        <USelect
          v-model="payload.status"
          :options="status_options"
          icon="i-heroicons-funnel"
          @update:model-value="(e) => updateFilter(e)" />
        <USelect
          :model-value="Number(payload.sortBy)"
          :options="sort_options"
          icon="i-heroicons-arrows-up-down"
          @update:model-value="(e) => updateSorting(e)" />
      </div>

      <UTable 
        class="h-[calc(100dvh-260px)] sm:h-[calc(100dvh-225px)] overflow-x-hidden"
        :columns="columns"
        :rows="rows"
        :loading="isLoading"
        :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
        @select="goToForm">
        <!--ID-->
        <template #id-data="{ row }">
          <UAvatar
            :chip-color="row.is_active ? 'primary' : 'rose'"
            chip-text=""
            chip-position="top-right"
            size="sm">
            {{ String(row.id) }}
          </UAvatar>
        </template>
        <!--Nombre-->
        <template #name_es-data="{ row }">
          <div class="flex flex-col py-0">
            <dd class="font-semibold">{{ row.name_es }}</dd>
            <dt class="hidden sm:block">
              <i class="fa-solid fa-user-group fa-sm text-gray-400"></i> {{ row.user_count }}
            </dt>
            <dt class="block sm:hidden">
              <i class="fa-solid fa-user-group fa-sm text-gray-400"></i> {{ row.user_count }}
              <i class="fa-regular fa-calendar fa-sm text-gray-400 pl-2 "></i>
              {{ new Intl.DateTimeFormat("es", { day: "numeric", month: "long", year: "numeric" }).format(new Date(row.created_at)) }}
            </dt>
          </div>
        </template>
        <!--Fecha Creación-->
        <template #created_at-header>
          <span class="hidden sm:block">Fecha Creación</span>
        </template>
        <template #created_at-data="{ row }">
          <div class="flex items-center">
            <i class="hidden sm:block fa-regular fa-calendar text-gray-400 pr-2"></i>
            <span class="hidden sm:block">{{ new Intl.DateTimeFormat("es", { day: "numeric", month: "long", year: "numeric" }).format(new Date(row.created_at)) }}</span>
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