<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'
import { security_roles_schema } from '@/typings/client/securityRoles'
import type { type_security_roles_schema } from '@/typings/client/securityRoles'
import Basic from './basic.vue'
import Permissions from './permissions.vue'
import Users from './users.vue'

const route = useRoute();
const { currentRoute } = useRouter();
const state = useSecurityRoles();
const toast = useToast();
const myAxios = useAxios();
const recordID = route.params.id;

const tabs = [
  { slot: 'basic', label: 'Información del Perfil', icon: 'i-heroicons-identification', defaultOpen: true },
  { slot: 'links', label: 'Permisos', icon: 'i-heroicons-lock-closed', defaultOpen: false },
  { slot: 'users', label: 'Usuarios con este perfil', icon: 'i-heroicons-users', defaultOpen: false },
]

const goBack = () => { 
  const queryParams = currentRoute.value.query;
  const querystring = Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join('&');
  navigateTo(`/security/roles/${querystring ? `?${querystring}` : ''}`);
}

const validateAndSave = async (event: FormSubmitEvent<type_security_roles_schema>) => {
  console.log('validateAndSave');
  console.log(event);
  state.value.isLoading = true;
  const body = {
    // profile_data: state.value.profileData,
    // profile_links: state.value.profileLinks,
    profile_data: event.data.profileData,
    profile_links: event.data.profileLinks,
  }
  try {
    if (recordID === 'new') {
      const { data } = await myAxios.post(`/api/roles/${recordID}`, body);
      navigateTo(`/security/roles/${data.id}`);
    } else {
      await myAxios.patch(`/api/roles/${recordID}`, body);
    }
    toast.add({ title: 'Perfil guardado', icon: 'i-heroicons-check-circle', color: 'primary' });
  } catch(error) {
    console.error(error);
    toast.add({ title: 'Error al guardar perfil', icon: 'i-heroicons-exclamation-triangle', color: 'red' });
  } finally {
    state.value.isLoading = false;
  }
}

onMounted(() => {
  // state.value.profileData = sys_profiles.parse({});
  state.value.usersData = [];
  state.value.profileLinks = [];
  state.value.allLinks = [];
  
  if (!isNaN(Number(recordID))) {
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
  } else {
    state.value.isLoading = true;
    const promise1 = myAxios.get(`/api/lookups/sys_links`);
    Promise.all([promise1]).then((values) => {
      state.value.allLinks = values[0].data;
      state.value.profileData.name_es = 'Nuevo Perfil';
      state.value.isLoading = false;
    });
  }
});
</script>

<template>
  <div class="max-w-3xl mx-auto"><!--Required to prevent hydration mismatch-->
    <UForm :schema="security_roles_schema" :state="state" @submit="validateAndSave">
      <UCard
        :ui="{
          rounded: 'rounded-none sm:rounded-lg',
          body: 'px-0',
          header: {
            padding: 'sm:px-2 px-2 py-3',
          },
        }"
        class="overflow-y-auto">
        <template #header>
          <div class="flex">
            <div class="w-8">
              <span class="fa-stack fa-1x content-center items-center">
                <i class="fa fa-circle fa-stack-2x icon-background text-gray-200 dark:text-gray-800"></i>
                <i class="fa fa-edit fa-stack-1x"></i>
              </span>
            </div>
            <div>
              <span
                v-if="!state.isLoading"
                class="pl-3 font-semibold text-gray-700 dark:text-gray-300 text-2xl text-ellipsis overflow-hidden">
                {{ state.profileData.name_es }}
              </span>
            </div>
          </div>
        </template>

        <div class="h-[calc(100dvh-200px)] sm:h-[calc(100dvh-176px)] overflow-y-auto">
          <BittSkeletonList v-if="state.isLoading" class="mx-6 mt-5" :items="10" />
          <UAccordion
            v-if="!state.isLoading"
            class="px-0 sm:px-0 py-0 sm:py-0"
            :items="tabs"
            color="primary"
            variant="soft"
            size="xl"
            :ui="{ 
              default: { 
                openIcon: 'i-heroicons-chevron-down-20-solid',
                closeIcon: 'fas fa-search',
                class: 'mb-0 w-full rounded-none',
                variant: 'soft',
                size: 'xl',
              },
            }">
            <template #basic><Basic class="px-2 sm:px-4 pb-6" /></template>
            <template #links><Permissions class="px-2 sm:px-4 pb-6" /></template>
            <template #users><Users class="px-2 sm:px-4 pb-6" /></template>
          </UAccordion>
          <br /><br />
        </div>

        <template #footer>
          <div class="flex justify-between">
            <UButton
              size="xl"
              label="Regresar" 
              variant="ghost"
              :disabled="state.isLoading"
              @click="goBack">
              <template #leading>
                <i class="fa-solid fa-circle-chevron-left fa-xl"></i>
              </template>
            </UButton>
            <div class="px-1"></div>
            <div>
              <UButton
                size="xl"
                label="Guardar"
                color="primary"
                type="submit"
                :loading="state.isLoading"
                :disabled="state.isLoading">
                <template #leading v-if="!state.isLoading">
                  <i class="fa-solid fa-save fa-xl"></i>
                </template>
              </UButton>
            </div>
          </div>
        </template>
      </UCard>
    </UForm>
  </div>
</template>