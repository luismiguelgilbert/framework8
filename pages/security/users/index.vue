<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { useSecurityUsersStore } from '@/stores/SecurityUsers';
import { type_sys_users } from '@/typings/server/sys_users'
import config from './config'

useHead({ title: 'Usuarios' });
const store = useSecurityUsersStore();
const userStore = useUserStore();
const myAxios = useAxios();
const toast = useToast();
const payload = computed(() => {
  return {
    ...store.filter,
    rowsPerPage: userStore.rowsPerPage,
  }
});

const loadData = async(resetPage? : boolean) => {
  try {
    if(resetPage) {
      store.filter.page = 1;
    }
    store.isLoading = true;
    const response = await myAxios.post('/api/users', payload.value);
    const { data } = response;
    store.rows = data;
    store.filter.rowsNumber = data[0]?.row_count ?? 0;
  } catch(error) {
    console.error(error);
    toast.add({ title: 'Error cargando datos', icon: 'i-heroicons-exclamation-triangle', color: 'red' });
  } finally {
    store.isLoading = false;
  }
};

const updateSearchString = useDebounceFn((e: string) => {
  store.filter.searchString = e;
  loadData(true);
}, 1000);

const rowSelected = (row: type_sys_users) => {
  if(row.id) {
    navigateTo(`/security/users/${row.id}`);
  }
}

onMounted(() => {
  loadData(true);
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
          :model-value="store.filter.searchString"
          :loading="store.isLoading"
          size="xl"
          placeholder="Buscar..."
          @input="(event: InputEvent) => updateSearchString((event.target as HTMLInputElement).value)">
          <template #trailing>
            <i class="fas fa-search fa-xl text-gray-500"></i>
          </template>
        </UInput>
        <div class="px-1"></div>
        <div>
          <USelectMenu
            size="xl"
            v-model="store.filter.status"
            :options="config.statusOptions"
            value-attribute="value"
            option-attribute="label"
            multiple
            placeholder="Estado"
            @update:model-value="loadData(true)">
            <template #label>
              <i class="i-heroicons-funnel" />
              <span class="truncate">{{ store.filterLabel }}</span>
            </template>
          </USelectMenu>
        </div>
      </div>

      <div class="flex items-center justify-between gap-3 px-4 py-3">
        <UButton
          size="xl"
          variant="solid"
          type="submit"
          label="Nuevo">
          <template #leading>
            <i class="fas fa-circle-plus fa-xl"></i>
          </template>
        </UButton>
        <div class="px-1"></div>
        <div>
          <USelect
            v-model="store.filter.sortBy"
            :options="config.sortOptions"
            size="xl"
            icon="i-heroicons-arrows-up-down"
            @update:model-value="loadData(false)" />
        </div>
      </div>
      
      <UTable 
        class="h-[calc(100dvh-275px)] sm:h-[calc(100dvh-244px)] overflow-x-hidden"
        :columns="config.columns"
        :rows="store.rows"
        :loading="store.isLoading"
        :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
        @select="rowSelected">
        <!--Foto-->
        <template #avatar_url-data="{ row }">
          <UAvatar
            class="ml-2"
            size="md"
            :src="row.avatar_url"/>
        </template>
        <!--Nombre-->
        <template #user_name-data="{ row }">
          <div class="flex flex-col py-0">
            <dd class="font-semibold">{{ `${row.user_name} ${row.user_lastname}` }}</dd>
            <dt class="hidden sm:block">
              <i class="fa-solid fa-envelope fa-sm text-gray-400"></i> {{ row.email }}
            </dt>
            <dt class="block sm:hidden">
              <i class="fa-solid fa-envelope fa-sm text-gray-400"></i> {{ row.email }}
            </dt>
            <dt class="block sm:hidden">
              <i class="fa-solid fa-door-open fa-sm text-gray-400"></i>
              {{ new Intl.DateTimeFormat("es", { day: "numeric", month: "long", year: "numeric" }).format(new Date(row.last_sign_in_at)) }}
            </dt>
            <dt class="block sm:hidden">
              <i class="fa-solid fa-user-circle fa-sm text-gray-400"></i>
              {{ row.sys_profile_name }}
            </dt>
          </div>
        </template>
        <!--Last Sign In-->
        <template #last_sign_in_at-header>
          <span class="hidden sm:block">Último Ingreso</span>
        </template>
        <template #last_sign_in_at-data="{ row }">
          <div class="flex flex-col py-0">
            <dd class="hidden sm:block font-semibold">{{ `${row.sys_profile_name}` }}</dd>
          </div>
          <div class="flex items-center">
            <i class="hidden sm:block fa-solid fa-door-open text-gray-400 pr-2"></i>
            <span class="hidden sm:block">{{ new Intl.DateTimeFormat("es", { day: "numeric", month: "long", year: "numeric" }).format(new Date(row.last_sign_in_at)) }}</span>
          </div>
        </template>
      </UTable>
      <template #footer>
        <div class="flex justify-between items-center">
          <UPagination
            v-model="store.filter.page"
            :max="5"
            :page-count="payload.rowsPerPage"
            :total="store.filter.rowsNumber"
            size="lg"
            @update:model-value="loadData(false)" />
          <div>
            <span>{{ store.filter.rowsNumber }}</span>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>