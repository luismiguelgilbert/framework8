<script setup lang="ts">
const state = useUser();
const appConfig = useAppConfig();
const colorMode = useColorMode();

const setTheme = (color: 'light' | 'dark') => {
  colorMode.preference = color;
  state.value.theme = color;
}

const setDarkColor = (color: string) => {
  appConfig.ui.gray = color;
}
</script>

<template>
  <div class="mx-5 py-1 sm:py-3">
    <div class="ml-2 mb-2"><span class="font-semibold text-lg">Seleccione el tema</span></div>
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
        <BittSkeletonList
          v-if="state.isLoadingUser"
          :items="1" />
        <div v-else>
          <div>
            <URadioGroup
              class="px-5 py-2"
              v-model="state.theme"
              legend="Seleccione su tema preferido"
              :options="state.themes"
              @update:modelValue="setTheme" />
            <div v-if="state.theme === 'dark'">
              <div class="border border-neutral-100 dark:border-neutral-700" />
              <URadio
                v-for="color in state.darkColors"
                :key="color"
                :label="`&#9679 ${color}`"
                :value="color"
                class="px-5"
                v-model="state.preferedDarkColor"
                @update:modelValue="setDarkColor">
                <template #label>
                  <span :class="`text-${color}-400`">{{ color }}</span>
                </template>
              </URadio>
            </div>
          </div>
        </div>
    </UCard>
  </div>
</template>