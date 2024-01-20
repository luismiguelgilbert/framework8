<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import type { dropdownOption } from '@/typings/client/datalistDropdownOption';

defineProps({
  dropdownOptions: {
    type: Object as PropType<Array<dropdownOption>>,
    required: true,
  },
  isLoading: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
  hint: {
    type: String as PropType<string>,
    required: true,
    default: 'Buscar',
  },
});
const emits = defineEmits(['update-searchstring']);
const propSearchString = defineModel('payloadSearchString', { type: String, default: '' });


const uiMainCard = { 
  body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' } ,
  rounded: 'rounded-none',
};
const uiMobileButton = { rounded: 'rounded-none' };

const mainState = useUser();
const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greaterOrEqual('sm');

const updatePropSearchString = useDebounceFn((inputEvent: InputEvent) => {
  propSearchString.value = (inputEvent.target as HTMLInputElement).value ?? '';
  emits('update-searchstring');
}, 1000);

</script>

<template>
  <UCard :ui="uiMainCard">
    <div
      class="w-full bg-white"
      :class="smAndLarger ? 'dark:bg-gray-900' : 'dark:bg-gray-900'">
      <div class="flex items-center justify-between gap-3 px-0 py-0 sm:px-4 sm:py-3">
        <UButton
          v-if="!smAndLarger"
          :ui="uiMobileButton"
          variant="ghost"
          icon="i-heroicons-bars-4"
          size="xl"
          class="px-4 py-4"
          @click="mainState.isMenuOpen = true" />
        <UInput
          :model-value="propSearchString"
          :variant="smAndLarger ? 'outline' : 'none'"
          :placeholder="hint"
          size="xl"
          icon="i-heroicons-magnifying-glass-20-solid"
          @input="updatePropSearchString($event)" >
        </UInput>
        <div class="px-1"></div>
        <div>
          <UDropdown
            :items="dropdownOptions"
            :popper="{ placement: 'bottom-start' }">
            <UButton
              :variant="smAndLarger ? 'solid' : 'ghost'"
              :loading="isLoading"
              :label="smAndLarger ? 'Opciones' : ''"
              :trailing-icon="smAndLarger ? 'i-heroicons-chevron-down-20-solid' : ''"
              icon="i-heroicons-cog"
              size="xl"
              class="px-4 py-4" />
          </UDropdown>
        </div>
      </div>
    </div>
  </UCard>
</template>