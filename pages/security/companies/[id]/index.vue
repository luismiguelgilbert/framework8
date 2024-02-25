<script setup lang="ts">
import { type LocationQueryValue } from '#vue-router'
import { security_companies_schema, type type_security_companies_schema } from '@/typings/client/securityCompanies'
import Basic from './basic.vue'
import Users from './users.vue'
import { AxiosError } from 'axios';

const props = defineProps({
  allowCreate: { type: Boolean, required: true },
  allowEdit: { type: Boolean, required: true },
})
const emit = defineEmits(['closed']);

const { currentRoute, push } = useRouter();
const state = useSecurityCompanies();
const myAxios = useAxios();
const recordID = ref<LocationQueryValue>(currentRoute.value.query.id as LocationQueryValue);
const currenTab = ref(0);
const alertVisible = ref<boolean>(false);
const alertColor = ref<'rose'|'green'>('rose');
const alertMessage = ref<string>('');
const alertDescription = ref<string>('');
const alertIcon = ref<string>('');
const body = ref<type_security_companies_schema>();

const editModeLabel = computed<string>(() => recordID.value === 'new' ? 'Crear' : 'Editar' );
const isSaveButtonVisible = computed(() => recordID.value === 'new' ? props.allowCreate : props.allowEdit);

const tabs = [
  { slot: 'basic', value: 'basic', label: 'Información', icon: 'i-heroicons-identification', defaultOpen: true },
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
    const res = security_companies_schema.safeParse(state.value);
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
        companyData: state.value.companyData,
        usersData: [],
      };
      if (recordID.value === 'new') {
        const { data } = await myAxios.post(`/api/companies/${recordID.value}`, body.value);
        body.value.id = data.id;
        state.value.companyData.id = data.id;
        state.value.id = data.id;
        const newQuery = { ...currentRoute.value.query, id: data.id }
        push({ query: newQuery });
      } else {
        body.value.id = recordID.value?.toString();
        await myAxios.patch(`/api/companies/${recordID.value}`, body.value);
      }
      alertColor.value = 'green';
      alertMessage.value = 'Compañía guardada';
      alertDescription.value = '';
      alertVisible.value = true;
      alertIcon.value = 'i-heroicons-check-circle';
    }
  } catch(error) {
    console.error(error);
    alertColor.value = 'rose';
    alertMessage.value = 'Error al guardar compañía';
    alertVisible.value = true;
    alertDescription.value = (error as AxiosError).response?.statusText ?? '';
    alertIcon.value = 'i-heroicons-exclamation-circle';
  } finally {
    state.value.isLoading = false;
  }
}
const resetData = () => {
  state.value.companyData.id = '';
  state.value.companyData.name_es = '';
  state.value.companyData.name_es_short = '';
  state.value.companyData.company_number = '';
  state.value.companyData.billing_phone = '';
  state.value.companyData.billing_address = '';
  state.value.companyData.is_active = true;
  state.value.usersData = [];
}
const loadRecordData = (recordID: LocationQueryValue) => {
  resetData();
  if (recordID != 'new') {
    state.value.isLoading = true;
    const promise1 = myAxios.get(`/api/companies/${recordID}`);
    const promise2 = myAxios.get(`/api/companies/${recordID}/users`);
    Promise.all([promise1, promise2]).then((values) => {
      state.value.companyData = values[0].data;
      state.value.usersData = values[1].data;
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
          <span class="font-semibold text-xl pl-2"> {{`${editModeLabel} Compañía`}} </span>
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
              <Users v-show="currenTab === 1" class="px-2 sm:px-4 pb-6" />
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
              <i class="i-heroicons-check-circle"></i>
            </template>
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>