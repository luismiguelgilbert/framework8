<script setup lang="ts">
import { type LocationQueryValue } from '#vue-router'

const state = useUom();
const { currentRoute } = useRouter();
const recordID = ref<LocationQueryValue>(currentRoute.value.query?.id as LocationQueryValue);
const isCreating = computed<boolean>(() => recordID.value === 'new' );
</script>

<template>
  <div class="mx-2">
    <div class="ml-2 mb-2"><span class="font-semibold text-lg">Datos Básicos de la Unidad</span></div>
    <UFormGroup
      class="px-2 py-2"
      size="xl"
      label="Estado de la Unidad"
      name="uomData.is_active">
      <div class="flex items-center justify-start">
        <UToggle
          v-model:model-value="state.uomData.is_active"
          color="primary" />
      </div>
    </UFormGroup>
    <UFormGroup
      v-if="!isCreating"
      class="px-2 py-2"
      label="Código"
      size="xl"
      name="uomData.id">
      <UInput
        v-model:model-value="state.uomData.id"
        required
        label="Código"
        size="xl"
        type="text"
        name="id"
        readonly
        placeholder="ID de la Unidad"
        :loading="state.isLoading">
        <template #leading v-if="!state.isLoading">
          <i class="i-heroicons-circle-stack  text-gray-500"></i>
        </template>
      </UInput>
    </UFormGroup>
    <UFormGroup
      class="px-2 py-2"
      label="Nombre"
      size="xl"
      name="uomData.name_es">
      <UInput
        v-model:model-value="state.uomData.name_es"
        required
        label="Nombre"
        size="xl"
        type="text"
        name="name_es"
        placeholder="Ingrese el Nombre de la Unidad"
        :loading="state.isLoading">
        <template #leading v-if="!state.isLoading">
          <i class="i-heroicons-scale  text-gray-500"></i>
        </template>
      </UInput>
    </UFormGroup>
    <UFormGroup
      class="px-2 py-2"
      size="xl"
      label="Abreviatura"
      name="uomData.name_es_short">
      <UInput
        v-model:model-value="state.uomData.name_es_short"
        label="Abreviatura de la Unidad"
        size="xl"
        type="text"
        name="name_es_short"
        placeholder="Ingrese la Abreviatura de la Unidad"
        :loading="state.isLoading">
        <template #leading v-if="!state.isLoading">
          <i class="i-heroicons-ellipsis-vertical text-gray-500"></i>
        </template>
      </UInput>
    </UFormGroup>
  </div>
</template>