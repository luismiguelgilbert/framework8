<script setup lang="ts">
const state = useUser();
const appConfig = useAppConfig();
const isUpdating = ref(false);
const hasError = ref(false);

const setColor = async () => {
  appConfig.ui.primary = state.value.preferedColor;

  isUpdating.value = true;
  hasError.value = false;
  const { error } = await useFetch(`/api/users/${state.value.userData.id}/preferences`, {
    method: 'patch',
    body: { default_color: state.value.preferedColor },
  });
  isUpdating.value = false;
  if (error.value ) { hasError.value = true }
}
</script>

<template>
  <div class="mx-5 py-1 sm:py-3">
    <div class="ml-2 mb-2">
      <span class="font-semibold text-lg">Seleccione su color preferido</span>
    </div>
    <URadioGroup
      class="px-5 py-2"
      v-model="state.preferedColor"
      :options="state.colors"
      :disabled="isUpdating"
      @update:modelValue="setColor" />
    <UProgress v-if="isUpdating" animation="carousel" />
    <UAlert
      v-if="hasError"
      icon='i-heroicons-exclamation-circle'
      color="rose"
      variant="solid"
      title="Error al guardar preferencia"
    />
    <br /><br />
  </div>
</template>