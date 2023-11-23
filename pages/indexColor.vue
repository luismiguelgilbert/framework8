<script setup lang="ts">
const state = useUser();
const appConfig = useAppConfig();

const setColor = (color: string) => {
  appConfig.ui.primary = color;
  state.value.preferedColor = color;
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
      @update:modelValue="setColor" />
    <br /><br />
  </div>
</template>