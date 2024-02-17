<script setup lang="ts">
const state = useUser();
const appConfig = useAppConfig();
const colorMode = useColorMode();
const isUpdating = ref(false);
const hasError = ref(false);

const setTheme = async () => {
  colorMode.preference = state.value.theme;
  isUpdating.value = true;
  const { error } = await useFetch(`/api/users/${state.value.userData.id}/preferences`, {
    method: 'patch',
    body: { dark_enabled: state.value.theme === 'dark' },
  });
  isUpdating.value = false;
  if (error.value ) { hasError.value = true }
}

const setDarkColor = async () => {
  appConfig.ui.gray = state.value.preferedDarkColor;
  isUpdating.value = true;
  const { error } = await useFetch(`/api/users/${state.value.userData.id}/preferences`, {
    method: 'patch',
    body: { default_dark_color: state.value.preferedDarkColor },
  });
  isUpdating.value = false;
  if (error.value ) { hasError.value = true }
}
</script>

<template>
  <div class="mx-5 py-1 sm:py-3">
    <div class="ml-2 mb-2"><span class="font-semibold text-lg">Seleccione su tema preferido</span></div>
    <div>
      <URadioGroup
        class="px-5 py-2"
        v-model="state.theme"
        :options="state.themes"
        :disabled="isUpdating"
        @update:modelValue="setTheme" />
      <div v-if="state.theme === 'dark'">
        <div class="ml-2 mb-2"><span class="font-semibold text-lg">Seleccione su color de fondo preferido</span></div>
        <URadio
          v-for="color in state.darkColors"
          :key="color"
          :label="`&#9679 ${color}`"
          :value="color"
          :disabled="isUpdating"
          class="px-5"
          v-model="state.preferedDarkColor"
          @update:modelValue="setDarkColor">
          <template #label>
            <span :class="`text-${color}-400`">{{ color }}</span>
          </template>
        </URadio>
      </div>
    </div>
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