<script setup lang="ts">
import { type LocationQueryValue } from '#vue-router'
import { security_roles_schema, type type_security_roles_schema } from '@/typings/client/securityRoles'
import Basic from './basic.vue'
import Permissions from './permissions.vue'
import Users from './users.vue'
import { AxiosError } from 'axios';

const props = defineProps({
  allowCreate: { type: Boolean, required: true },
  allowEdit: { type: Boolean, required: true },
})
const emit = defineEmits(['closed']);

const { currentRoute, push } = useRouter();
const state = useSecurityRoles();
const myAxios = useAxios();
const recordID = ref<LocationQueryValue>(currentRoute.value.query.id as LocationQueryValue);
const currenTab = ref(0);
const alertVisible = ref<boolean>(false);
const alertColor = ref<'rose'|'green'>('rose');
const alertMessage = ref<string>('');
const alertDescription = ref<string>('');
const alertIcon = ref<string>('');
const body = ref<type_security_roles_schema>();

const editModeLabel = computed<string>(() => recordID.value === 'new' ? 'Crear' : 'Editar' );
const isSaveButtonVisible = computed(() => recordID.value === 'new' ? props.allowCreate : props.allowEdit);

const tabs = [
  { slot: 'basic', value: 'basic', label: 'Información', icon: 'i-heroicons-identification', defaultOpen: true },
  { slot: 'links', value: 'links', label: 'Permisos', icon: 'i-heroicons-lock-closed', defaultOpen: false },
  { slot: 'users', value: 'users',label: 'Usuarios', icon: 'i-heroicons-users', defaultOpen: false },
]
const uiCard = {
  rounded: 'rounded-none',
  body: 'px-0',
  header: {
    padding: 'sm:px-2 px-2 py-3',
  },
}

const goBack = () => { 
  const newQuery = { ...currentRoute.value.query }
  delete newQuery.id;
  push({ query: newQuery });
  emit('closed');
}
const validateAndSave = async () => {
  try {
    state.value.isLoading = true;
    const res = security_roles_schema.safeParse(state.value);
    if (!res.success) {
      alertColor.value = 'rose';
      alertMessage.value = res.error.issues.map((issue) => issue.message).join('\n');
      alertVisible.value = true;
      alertDescription.value = '';
      alertIcon.value = 'i-heroicons-exclamation-circle';
      console.error(res);
      return;
    } else {
      body.value = {
        isLoading: false,
        profileData: state.value.profileData,
        profileLinks: state.value.profileLinks,
        usersData: [],
        allLinks: [],
      };
      if (recordID.value === 'new') {
        const { data } = await myAxios.post(`/api/roles/${recordID.value}`, body.value);
        body.value.id = data.id;
        state.value.profileData.id = data.id;
        state.value.id = data.id;
        const newQuery = { ...currentRoute.value.query, id: data.id }
        push({ query: newQuery });
      } else {
        body.value.id = Number(recordID.value);
        await myAxios.patch(`/api/roles/${recordID.value}`, body.value);
      }
      alertColor.value = 'green';
      alertMessage.value = 'Perfil guardado';
      alertDescription.value = '';
      alertVisible.value = true;
      alertIcon.value = 'i-heroicons-check-circle';
    }
  } catch(error) {
    console.error(error);
    alertColor.value = 'rose';
    alertMessage.value = 'Error al guardar perfil';
    alertVisible.value = true;
    alertDescription.value = (error as AxiosError).response?.statusText ?? '';
    alertIcon.value = 'i-heroicons-exclamation-circle';
  } finally {
    state.value.isLoading = false;
  }
}
const resetData = () => {
  state.value.profileData.id = 0;
  state.value.profileData.name_es = 'Nuevo Perfil';
  state.value.profileData.is_active = true;
  state.value.usersData = [];
  state.value.profileLinks = [];
  state.value.allLinks = [];
}
const loadRecordData = (recordID: LocationQueryValue) => {
  resetData();
  if (recordID && recordID === 'new') {
    state.value.isLoading = true;
    const promise1 = myAxios.get(`/api/lookups/sys_links`);
    Promise.all([promise1]).then((values) => {
      state.value.allLinks = values[0].data;
      state.value.profileData.id = 0;
      state.value.profileData.name_es = 'Nuevo Perfil';
      state.value.isLoading = false;
    });
  } else if (recordID) {
    state.value.isLoading = true;
    const promise1 = myAxios.get(`/api/roles/${recordID}`);
    const promise2 = myAxios.get(`/api/roles/${recordID}/users`);
    const promise3 = myAxios.get(`/api/roles/${recordID}/sys_links`);
    const promise4 = myAxios.get(`/api/lookups/sys_links`);
    Promise.all([promise1, promise2, promise3, promise4]).then((values) => {
      state.value.profileData = values[0].data;
      state.value.usersData = values[1].data;
      state.value.profileLinks = values[2].data;
      state.value.allLinks = values[3].data;
      state.value.isLoading = false;
    });
  }
};
//HOOKS
onMounted(() => { loadRecordData(recordID.value) });
watch(
  () => currentRoute.value.query.id,
  () => {
    recordID.value = currentRoute.value.query.id as LocationQueryValue;
    recordID.value && loadRecordData(recordID.value);
  }
)
</script>

<template>
  <div><!--Required to prevent hydration mismatch-->
    <UCard
      :ui="uiCard">
      <!--HEADER-->
      <template #header>
        <div class="flex items-center">
          <UButton
            color="gray"
            variant="link"
            :padded="false"
            icon="i-heroicons-x-circle"
            @click="goBack" />
          <span class="font-semibold text-xl pl-2"> {{`${editModeLabel} Perfil`}} </span>
        </div>
      </template>
      <!--BODY-->
      <div>
        <UTabs
          v-model="currenTab"
          :items="tabs"
          :ui="{
            list: { rounded: 'rounded-none' }
          }"
          class="w-full" />
        <div class="h-[calc(100dvh-180px)] sm:h-[calc(100dvh-179px)] overflow-y-auto">
          <BittSkeletonList v-if="state.isLoading" class="mx-6 mt-5" :items="1" />
          <div v-else>
            <UForm :state="state">
              <Basic v-show="currenTab === 0" class="px-2 sm:px-4 pb-6" />
              <Permissions v-show="currenTab === 1" class="px-2 sm:px-4 pb-6" />
              <Users v-show="currenTab === 2" class="px-2 sm:px-4 pb-6" />
            </UForm>
          </div>
        </div>
      </div>
      <!--FOOTER-->   
      <template #footer>
        <UAlert
          v-if="!isSaveButtonVisible"
          icon="i-heroicons-information-circle"
          color="yellow"
          title="No tiene permisos para guardar cambios"
          variant="solid" />
        <div v-else>
          <UAlert
            v-if="alertVisible"
            :ui="{ title: 'text-xs', description: 'text-xs' }"
            :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'white', variant: 'link', padded: false }"
            :icon="alertIcon"
            :color="alertColor"
            :title="alertMessage"
            :description="alertDescription"
            variant="solid"
            @close="alertVisible = false" />
          <UButton
            v-if="!alertVisible"
            :disabled="state.isLoading"
            :loading="state.isLoading"
            block
            size="xl"
            label="Guardar" 
            variant="solid"
            @click="validateAndSave">
            <template #leading v-if="!state.isLoading">
              <i class="fa-solid fa-save fa-xl"></i>
            </template>
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>