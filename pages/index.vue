<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore';
useHead({ title: 'BITT - Welcome' });

const store = useUserStore();
const appConfig = useAppConfig();
const colorMode = useColorMode();
const { colors, darkColors, preferedColor, preferedDarkColor, themes, theme, userData } = storeToRefs(store);

const rowsPerPageOptions = [
  { label: '5 registros por página', value: 5 },
  { label: '10 registros por página', value: 10 },
  { label: '25 registros por página', value: 25 },
  { label: '50 registros por página', value: 50 },
  { label: '100 registros por página', value: 100 },
];

const setTheme = (color: 'light' | 'dark') => {
  colorMode.preference = color;
  theme.value = color;
}

const setColor = (color: string) => {
  appConfig.ui.primary = color;
  preferedColor.value = color;
}

const setDarkColor = (color: string) => {
  appConfig.ui.gray = color;
}

//console.log('appConfig', {appConfig});
</script>

<template>
  <UCard
    class="max-w-3xl h-[calc(100dvh-70px)] sm:h-[calc(100dvh-25px)] mx-auto overflow-y-auto"
    :ui="{ body: 'px-0' }">
    <template #header>
      <div class="flex items-center space-x-2">
        <BittSkeletonTitle v-if="store.isLoadingUser" />
        <div v-else class="flex items-center">
          <UAvatar
            v-if="userData?.avatar_url"
            :src="userData?.avatar_url!"
            :alt="userData.user_name!"
            size="sm" />
          <span class="pl-2 text-2xl text-neutral-600 font-bold dark:text-white">Bievenido {{userData?.user_name}}!</span>
        </div>
      </div>
    </template>
    <div class="border border-neutral-100 dark:border-neutral-700" />
    <div class="px-6 py-2">
      <h6 class="text-md text-neutral-600 font-bold dark:text-white">Seleccione su tema:</h6>
      <BittSkeletonList
        v-if="store.isLoadingUser"
        :items="1" />
      <div v-else>
        <URadio
          v-for="theme in themes"
          :key="theme"
          :label="theme"
          :value="theme"
          v-model="store.theme"
          @update:modelValue="setTheme" />
      </div>
    </div>
    <div class="border border-neutral-100 dark:border-neutral-700" />
    <div v-if="theme === 'dark'" class="px-6 py-2">
      <h6 class="text-md text-neutral-600 font-bold dark:text-white">Seleccione su color para el tema Oscuro:</h6>
      <BittSkeletonList
        v-if="store.isLoadingUser"
        :items="6" />
      <div v-else>
        <URadio
          v-for="color in darkColors"
          :key="color"
          :label="`&#9679 ${color}`"
          :value="color"
          v-model="store.preferedDarkColor"
          @update:modelValue="setDarkColor">
          <template #label>
            <span :class="`text-${color}-400`">{{ color }}</span>
          </template>
        </URadio>
      </div>
    </div>
    <div class="border border-neutral-100 dark:border-neutral-700" />
    <div class="px-6 py-2">
      <h6 class="text-md text-neutral-600 font-bold dark:text-white">Seleccione su color:</h6>
      <BittSkeletonList
        v-if="store.isLoadingUser"
        :items="6" />
      <div v-else>
        <URadio
          v-for="color in colors"
          :key="color"
          :label="`&#9679 ${color}`"
          :value="color"
          v-model="store.preferedColor"
          @update:modelValue="setColor">
          <template #label>
            <span :class="`text-${color}-400`">{{ color }}</span>
          </template>
        </URadio>
      </div>
    </div>
    <div class="border border-neutral-100 dark:border-neutral-700" />
    <div class="px-6 py-2">
      <h6 class="text-md text-neutral-600 font-bold dark:text-white">Registros por Página:</h6>
      <BittSkeletonList
        v-if="store.isLoadingUser"
        :items="6" />
      <div v-else>
        <URadio
          v-for="rowOption in rowsPerPageOptions"
          :key="rowOption.value"
          :label="rowOption.label"
          :value="rowOption.value"
          v-model="store.rowsPerPage">
          <!--<template #label>
            <span :class="`text-${color}-400`">{{ color }}</span>
          </template>-->
        </URadio>
      </div>
    </div>
  </UCard>
</template>