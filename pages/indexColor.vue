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
    <div class="ml-2 mb-2"><span class="font-semibold text-lg">Seleccione su tema preferido</span></div>
    <div>
      <URadioGroup
        class="px-5 py-2"
        v-model="state.theme"
        :options="state.themes"
        :disabled="isUpdating"
        @update:modelValue="setTheme" />
      <div
        v-if="state.theme === 'dark'"
        class="ml-2 mb-2 mt-4">
        <span class="font-semibold text-lg">Seleccione su fondo preferido</span>
        <div class="ml-4 mt-5">
          <USelectMenu
            v-model="state.preferedDarkColor"
            :options="state.darkColors"
            :disabled="isUpdating"
            @update:modelValue="setDarkColor" />
        </div>
      </div>
    </div>
    <div class="ml-2 mb-2 mt-10">
      <span class="font-semibold text-lg">Seleccione su color preferido</span>
      <div class="ml-4 mt-5">
        <USelectMenu
          v-model="state.preferedColor"
          :options="state.colors"
          :disabled="isUpdating"
          @update:modelValue="setColor">
          <template #leading>
            <UBadge :ui="{ rounded: 'rounded-full' }"></UBadge>
          </template>
          <template #option="{ option: color }">
            <span class="h-2 w-2 rounded-full" :class="`bg-${color}-500 dark:bg-${color}-400`" />
            <span class="truncate">{{ color }}</span>
          </template>
        </USelectMenu>
      </div>
    </div>
    <UProgress class="mt-5 ml-5" v-if="isUpdating" animation="carousel" />
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