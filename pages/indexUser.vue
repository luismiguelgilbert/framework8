<script setup lang="ts">
const state = useUser();
</script>

<template>
  <div class="mx-5 py-1 sm:py-3">
    <div class="ml-2 mb-2"><span class="font-semibold text-lg">Datos del Usuario</span></div>
    <UCard>
      <UFormGroup
        label="Código"
        size="xl"
        name="profileData.id">
        <UInput
          :value="state.userData.id"
          required
          label="Código"
          size="xl"
          type="text"
          name="id"
          readonly
          :loading="state.isLoadingUser">
          <template #leading v-if="!state.isLoadingUser">
            <i class="fas fa-database fa-xl text-gray-500"></i>
          </template>
        </UInput>
      </UFormGroup>
      <UFormGroup
        class="pb-5"
        size="xl"
        label="Mail"
        name="profileData.name_es">
        <UInput
          :value="state.userData.email"
          label="Mail"
          size="xl"
          type="text"
          name="email"
          readonly
          :loading="state.isLoadingUser">
          <template #leading v-if="!state.isLoadingUser">
            <i class="fas fa-envelope fa-xl text-gray-500"></i>
          </template>
        </UInput>
      </UFormGroup>
      <UFormGroup
        class="pb-5"
        size="xl"
        label="Nombres"
        name="profileData.name_es">
        <UInput
          :value="state.userData.user_name"
          label="Nombres"
          size="xl"
          type="text"
          name="user_name"
          readonly
          :loading="state.isLoadingUser">
          <template #leading v-if="!state.isLoadingUser">
            <i class="fas fa-user fa-xl text-gray-500"></i>
          </template>
        </UInput>
      </UFormGroup>
      <UFormGroup
        class="pb-5"
        size="xl"
        label="Apellidos"
        name="profileData.name_es">
        <UInput
          :value="state.userData.user_lastname"
          label="Apellidos"
          size="xl"
          type="text"
          name="user_lastname"
          readonly
          :loading="state.isLoadingUser">
          <template #leading v-if="!state.isLoadingUser">
            <i class="far fa-user fa-xl text-gray-500"></i>
          </template>
        </UInput>
      </UFormGroup>
      <UFormGroup
        class="pb-5"
        size="xl"
        label="Perfil"
        name="profileData.sys_profile_name">
        <UInput
          :value="state.userData.sys_profile_name"
          label="Perfil"
          size="xl"
          type="text"
          name="sys_profile_name"
          readonly
          :loading="state.isLoadingUser">
          <template #leading v-if="!state.isLoadingUser">
            <i class="fas fa-circle-user fa-xl text-gray-500"></i>
          </template>
        </UInput>
      </UFormGroup>
      <UFormGroup
        class="pb-5"
        size="xl"
        label="Último Ingreso"
        name="profileData.last_sign_in_at">
        <UInput
          :value="state.userData.last_sign_in_at"
          label="Último Ingreso"
          size="xl"
          type="text"
          name="last_sign_in_at"
          readonly
          :loading="state.isLoadingUser">
          <template #leading v-if="!state.isLoadingUser">
            <i class="fas fa-door-open fa-xl text-gray-500"></i>
          </template>
        </UInput>
      </UFormGroup>
      <UFormGroup
        class="pb-5"
        size="xl"
        label="Fecha de creación"
        name="profileData.created_at">
        <UInput
          :value="state.userData.created_at"
          label="Fecha de creación"
          size="xl"
          type="text"
          name="created_at"
          readonly
          :loading="state.isLoadingUser">
          <template #leading v-if="!state.isLoadingUser">
            <i class="fas fa-marker fa-xl text-gray-500"></i>
          </template>
        </UInput>
      </UFormGroup>
      <UFormGroup
        class="pb-5"
        size="xl"
        label="Fecha de actualización"
        name="profileData.updated_at">
        <UInput
          :value="state.userData.updated_at"
          label="Fecha de actualización"
          size="xl"
          type="text"
          name="updated_at"
          readonly
          :loading="state.isLoadingUser">
          <template #leading v-if="!state.isLoadingUser">
            <i class="fas fa-edit fa-xl text-gray-500"></i>
          </template>
        </UInput>
      </UFormGroup>
    </UCard>
  </div>
</template>