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
    <div class="ml-2 mb-2"><span class="font-semibold text-lg">Seleccione el Color</span></div>
    <UCard
        :ui="{
          body: 'p-0',
          header: {
            padding: 'sm:px-2 px-2 py-3',
          },
          footer: {
            padding: 'px-0 py-0 sm:px-0'
          }
        }"
        class="overflow-y-auto">
        <URadio
          v-for="color in state.colors"
          :key="color"
          :label="`&#9679 ${color}`"
          :value="color"
          class="px-5 py-2"
          v-model="state.preferedColor"
          @update:modelValue="setColor">
          <template #label>
            <span :class="`text-${color}-400`">{{ color }}</span>
          </template>
        </URadio>
    </UCard>
  </div>
</template>