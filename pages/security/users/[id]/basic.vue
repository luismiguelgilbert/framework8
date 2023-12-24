<script setup lang="ts">
const state = useSecurityUsers();
</script>

<template>
  <div class="mx-2">
    <div class="ml-2 mb-2"><span class="font-semibold text-lg">Datos Básicos del Usuario</span></div>
    <UFormGroup
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
          <i class="fas fa-database fa-xl text-gray-500"></i>
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
        readonly
        placeholder="Email del Usuario"
        :loading="state.isLoading">
        <template #leading v-if="!state.isLoading">
          <i class="fas fa-database fa-xl text-gray-500"></i>
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
          <i class="far fa-user fa-xl text-gray-500"></i>
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
          <i class="fas fa-user fa-xl text-gray-500"></i>
        </template>
      </UInput>
    </UFormGroup>
    <UFormGroup
      class="px-2 py-2"
      size="xl"
      label="Perfil del Usuario"
      name="userData.sys_profile_id">
      <USelect
        v-model:model-value="state.userData.sys_profile_id"
        label="Perfil del Usuario"
        size="xl"
        type="text"
        name="sys_profile_id"
        placeholder="Seleccione el perfil del usuario"
        :loading="state.isLoading"
        :options="state.allProfiles"
        optionAttribute="name_es"
        valueAttribute="id">
        <template #leading v-if="!state.isLoading">
          <i class="fas fa-circle-user fa-xl text-gray-500"></i>
        </template>
      </USelect>
    </UFormGroup>
  </div>
</template>