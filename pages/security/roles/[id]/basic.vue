<script setup lang="ts">
const state = useSecurityRoles();
</script>

<template>
  <div class="mx-5 py-5">
    <UFormGroup
      size="xl"
      label="Estado del Perfil"
      name="profileData.is_active">
      <div class="flex items-center justify-start">
        <UToggle
          v-model:model-value="state.profileData.is_active"
          color="primary" />
      </div>
    </UFormGroup>
    <UFormGroup
      class="py-5"
      label="Código"
      size="xl"
      name="profileData.id">
      <UInput
        v-model:model-value="state.profileData.id"
        required
        label="Código"
        size="xl"
        type="text"
        name="id"
        readonly
        placeholder="ID del Perfil"
        :loading="state.isLoading">
        <template #leading v-if="!state.isLoading">
          <i class="fas fa-database fa-xl text-gray-500"></i>
        </template>
      </UInput>
    </UFormGroup>
    <UFormGroup
      size="xl"
      label="Nombre del Perfil"
      name="profileData.name_es">
      <UInput
        v-model:model-value="state.profileData.name_es"
        label="Nombre del Perfil"
        size="xl"
        type="text"
        name="name_es"
        placeholder="Ingrese nombre del perfil"
        :loading="state.isLoading">
        <template #leading v-if="!state.isLoading">
          <i class="fas fa-circle-user fa-xl text-gray-500"></i>
        </template>
      </UInput>
    </UFormGroup>
  </div>
</template>