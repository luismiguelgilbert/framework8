<script setup lang="ts">
const state = useSecurityCompanies();
</script>

<template>
  <!--<div class="mx-5 py-1 sm:py-3">-->
  <div class="mx-2">
    <div class="ml-2 mb-2"><span class="font-semibold text-lg">Datos de la Compañía</span></div>
    <UFormGroup
      class="px-2 py-2"
      size="xl"
      label="Estado de la Compañía"
      name="companyData.is_active">
      <div class="flex items-center justify-start">
        <UToggle
          v-model:model-value="state.companyData.is_active"
          color="primary" />
      </div>
    </UFormGroup>
    <UFormGroup
      class="px-2 py-2"
      label="Código"
      size="xl"
      name="companyData.id">
      <UInput
        v-model:model-value="state.companyData.id"
        required
        label="Código"
        size="xl"
        type="text"
        name="id"
        readonly
        placeholder="ID de la Compañía"
        :loading="state.isLoading">
        <template #leading v-if="!state.isLoading">
          <i class="i-heroicons-circle-stack  text-gray-500"></i>
        </template>
      </UInput>
    </UFormGroup>
    <UFormGroup
      class="px-2 py-2"
      size="xl"
      label="Nombre de la compañía"
      name="companyData.name_es">
      <UInput
        v-model:model-value="state.companyData.name_es_short"
        label="Nombre de la Compañía"
        size="xl"
        type="text"
        name="name_es"
        placeholder="Ingrese nombre de la compañía"
        :loading="state.isLoading">
        <template #leading v-if="!state.isLoading">
          <i class="i-heroicons-building-office  text-gray-500"></i>
        </template>
      </UInput>
    </UFormGroup>
    <UFormGroup
      class="px-2 py-2"
      size="xl"
      label="Razón Social de la compañía"
      name="companyData.name_es">
      <UInput
        v-model:model-value="state.companyData.name_es"
        label="Nombre de la Compañía"
        size="xl"
        type="text"
        name="name_es"
        placeholder="Ingrese Razón Social de la compañía"
        :loading="state.isLoading">
        <template #leading v-if="!state.isLoading">
          <i class="i-heroicons-building-office-columns  text-gray-500"></i>
        </template>
      </UInput>
    </UFormGroup>
    <UFormGroup
      class="px-2 py-2"
      size="xl"
      label="RUC de la compañía"
      name="companyData.name_es">
      <UInput
        v-model:model-value="state.companyData.company_number"
        label="RUC de la Compañía"
        size="xl"
        type="text"
        name="name_es"
        placeholder="Ingrese RUC de la compañía"
        :loading="state.isLoading">
        <template #leading v-if="!state.isLoading">
          <i class="i-heroicons-hashtag  text-gray-500"></i>
        </template>
      </UInput>
    </UFormGroup>
    <UFormGroup
      class="px-2 py-2"
      size="xl"
      label="Teléfono de la compañía"
      name="companyData.name_es">
      <UInput
        v-model:model-value="state.companyData.billing_phone"
        label="Nombre de la Compañía"
        size="xl"
        type="text"
        name="name_es"
        placeholder="Ingrese Teléfono de la compañía"
        :loading="state.isLoading">
        <template #leading v-if="!state.isLoading">
          <i class="i-heroicons-phone  text-gray-500"></i>
        </template>
      </UInput>
    </UFormGroup>
    <UFormGroup
      class="px-2 py-2"
      size="xl"
      label="Dirección de la compañía"
      name="companyData.name_es">
      <UInput
        v-model:model-value="state.companyData.billing_address"
        label="Nombre de la Compañía"
        size="xl"
        type="text"
        name="name_es"
        placeholder="Ingrese Dirección de la compañía"
        :loading="state.isLoading">
        <template #leading v-if="!state.isLoading">
          <i class="i-heroicons-map-pin  text-gray-500"></i>
        </template>
      </UInput>
    </UFormGroup>
  </div>
</template>