<script setup lang="ts">
const state = useUser();
const isUpdating = ref(false);
const hasError = ref(false);

const setPreferedCompany = async (company: string) => {
  isUpdating.value = true;
  hasError.value = false;
  const { error } = await useFetch(`/api/users/${state.value.userData.id}/preferences`, {
    method: 'patch',
    body: { prefered_company: state.value.userCompany },
  });
  isUpdating.value = false;
  if (error.value ) { hasError.value = true }
}
</script>

<template>
  <div class="mx-5 py-1 sm:py-3">
    <div class="ml-2 mb-2">
      <span class="font-semibold text-lg">Seleccione su organización</span>
    </div>
    <URadioGroup
      v-if="state.userCompany"
      class="px-5 py-2"
      v-model="state.userCompany"
      optionAttribute="name_es_short"
      valueAttribute="id"
      :disabled="isUpdating"
      :options="state.userCompanies"
      @update:modelValue="setPreferedCompany" />
    <UProgress v-if="isUpdating" animation="carousel" />
    <UAlert
      v-if="hasError"
      icon='i-heroicons-exclamation-circle'
      color="rose"
      variant="solid"
      title="Error al guardar organización"
    />
    <br /><br />
  </div>
</template>