<script setup lang="ts">
import { type LocationQueryValue } from '#vue-router'

const state = useSecurityUsers();
const { currentRoute } = useRouter();
const recordID = ref<LocationQueryValue>(currentRoute.value.query?.id as LocationQueryValue);
const isCreating = computed<boolean>(() => recordID.value === 'new' );
</script>

<template>
  <div class="mx-2">
    <div class="ml-2 mb-2"><span class="font-semibold text-lg">Datos Básicos del Usuario</span></div>
    <UFormGroup
      v-if="!isCreating"
      class="px-2 py-2"
      label="Código"
      size="xl"
      name="userData.id">
      <UInput
        v-model:model-value="state.userData.id"
        required
        label="Código"
        size="xl"
        type="text"
        name="id"
        readonly
        placeholder="ID del Usuario"
        :loading="state.isLoading">
        <template #leading v-if="!state.isLoading">
          <i class="i-heroicons-circle-stack  text-gray-500"></i>
        </template>
      </UInput>
    </UFormGroup>
    <UFormGroup
      class="px-2 py-2"
      label="Email"
      size="xl"
      name="userData.email">
      <UInput
        v-model:model-value="state.userData.email"
        required
        label="Código"
        size="xl"
        type="text"
        name="email"
        :readonly="!isCreating"
        placeholder="Email del Usuario"
        :loading="state.isLoading">
        <template #leading v-if="!state.isLoading">
          <i class="i-heroicons-envelope  text-gray-500"></i>
        </template>
      </UInput>
    </UFormGroup>
    <UFormGroup
      class="px-2 py-2"
      size="xl"
      label="Nombres del Usuario"
      name="userData.user_name">
      <UInput
        v-model:model-value="state.userData.user_name"
        label="Nombre del Usuario"
        size="xl"
        type="text"
        name="user_name"
        placeholder="Ingrese nombres del usuario"
        :loading="state.isLoading">
        <template #leading v-if="!state.isLoading">
          <i class="i-heroicons-user text-gray-500"></i>
        </template>
      </UInput>
    </UFormGroup>
    <UFormGroup
      class="px-2 py-2"
      size="xl"
      label="Apellidos del Usuario"
      name="userData.user_lastname">
      <UInput
        v-model:model-value="state.userData.user_lastname"
        label="Nombre del Usuario"
        size="xl"
        type="text"
        name="user_lastname"
        placeholder="Ingrese apellidos del usuario"
        :loading="state.isLoading">
        <template #leading v-if="!state.isLoading">
          <i class="i-heroicons-user  text-gray-500"></i>
        </template>
      </UInput>
    </UFormGroup>
    <UFormGroup
      class="px-2 py-2"
      size="xl"
      label="Perfil del Usuario"
      name="userData.sys_profile_id">
      <USelectMenu
        v-model="state.userData.sys_profile_id"
        placeholder="Seleccione el perfil del usuario"
        option-attribute="name_es"
        value-attribute="id"
        searchable
        searchable-placeholder="Buscar perfil..."
        :options="state.allProfiles">
        <template #leading v-if="!state.isLoading">
          <i class="i-heroicons-user-circle  text-gray-500"></i>
        </template>
        <template #label>
          <span v-if="state.userData.sys_profile_id > 0">{{ state.allProfiles.find(x=> x.id === state.userData.sys_profile_id)?.name_es}}</span>
          <span v-else class="text-gray-400 dark:text-gray-500">Seleccione el perfil del usuario</span>
        </template>
      </USelectMenu>
    </UFormGroup>
  </div>
</template>