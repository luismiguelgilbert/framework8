<script setup lang="ts">
const state = useUser();
const appConfig = useAppConfig();
const colorMode = useColorMode();
const myAxios = useAxios();

const setTheme = async (color: 'light' | 'dark') => {
  colorMode.preference = color;
  state.value.theme = color;
  try {
    await myAxios.patch(`/api/users/${state.value.userData.id}/preferences`, { dark_enabled: color === 'dark' });
  } catch (error) {
    console.error(error);
  }
}

const setDarkColor = async (color: string) => {
  appConfig.ui.gray = color;
  try {
    await myAxios.patch(`/api/users/${state.value.userData.id}/preferences`, { default_dark_color: color });
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div class="mx-5 py-1 sm:py-3">
    <div class="ml-2 mb-2"><span class="font-semibold text-lg">Seleccione su tema preferido</span></div>
    <BittSkeletonList
      v-if="state.isLoadingUser"
      :items="1" />
    <div v-else>
      <div>
        <URadioGroup
          class="px-5 py-2"
          v-model="state.theme"
          :options="state.themes"
          @update:modelValue="setTheme" />
        <div v-if="state.theme === 'dark'">
          <div class="ml-2 mb-2"><span class="font-semibold text-lg">Seleccione su color de fondo preferido</span></div>
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
    <br /><br />
  </div>
</template>