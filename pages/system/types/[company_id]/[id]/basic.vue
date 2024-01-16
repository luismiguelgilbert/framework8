<script setup lang="ts">
import { type LocationQueryValue } from '#vue-router'

const state = useInvTypes();
const { currentRoute } = useRouter();
const recordID = ref<LocationQueryValue>(currentRoute.value.query?.id as LocationQueryValue);
const isCreating = computed<boolean>(() => recordID.value === 'new' );
const updateParentField = (val: string) => {
  if (val === state.value.invTypeData.parent) {
    state.value.invTypeData.parent = null;
  } else {
    state.value.invTypeData.parent = val;
  }
}
</script>

<template>
  <div class="mx-2">
    <div class="ml-2 mb-2"><span class="font-semibold text-lg">Datos Básicos de la Unidad</span></div>
    <UFormGroup
      class="px-2 py-2"
      size="xl"
      label="Estado del Tipo"
      name="invTypeData.is_active">
      <div class="flex items-center justify-start">
        <UToggle
          v-model:model-value="state.invTypeData.is_active"
          color="primary" />
      </div>
    </UFormGroup>
    <UFormGroup
      v-if="!isCreating"
      class="px-2 py-2"
      label="Código"
      size="xl"
      name="invTypeData.id">
      <UInput
        v-model:model-value="state.invTypeData.id"
        required
        label="Código"
        size="xl"
        type="text"
        name="id"
        readonly
        placeholder="ID del Tipo"
        :loading="state.isLoading">
        <template #leading v-if="!state.isLoading">
          <i class="fas fa-database fa-xl text-gray-500"></i>
        </template>
      </UInput>
    </UFormGroup>
    <UFormGroup
      class="px-2 py-2"
      label="Nombre"
      size="xl"
      name="invTypeData.name_es">
      <UInput
        v-model:model-value="state.invTypeData.name_es"
        required
        label="Nombre"
        size="xl"
        type="text"
        name="name_es"
        placeholder="Ingrese el Nombre del Tipo"
        :loading="state.isLoading">
        <template #leading v-if="!state.isLoading">
          <i class="fas fa-ruler-combined fa-xl text-gray-500"></i>
        </template>
      </UInput>
    </UFormGroup>
    <UFormGroup
      class="px-2 py-2"
      size="xl"
      label="Pertenece a (opcional)"
      name="invTypeData.parent">
      <USelectMenu
        :model-value="state.invTypeData.parent!"
        placeholder="Seleccione el tipo al que pertenece"
        option-attribute="name_es"
        value-attribute="id"
        searchable
        searchable-placeholder="Buscar tipo..."
        :options="state.allTypes.filter(x => x.id !== state.invTypeData.id)"
        @update:modelValue="updateParentField">
        <template #leading v-if="!state.isLoading">
          <i class="fas fa-circle-user fa-xl text-gray-500"></i>
        </template>
        <template #label>
          <span v-if="state.invTypeData.parent">{{ state.allTypes.find(x=> x.id === state.invTypeData.parent)?.name_es}}</span>
          <span v-else class="text-gray-400 dark:text-gray-500">Seleccione el tipo al que pertenece</span>
        </template>
      </USelectMenu>
    </UFormGroup>
  </div>
</template>