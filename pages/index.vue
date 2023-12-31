<script setup lang="ts">
useHead({ title: 'BITT - Welcome' });
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import Theme from './indexTheme.vue'
import Companies from './indexCompanies.vue'
import Colors from './indexColor.vue'
import User from './indexUser.vue'

const state = useUser();
const currenTab = ref(0);
const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greaterOrEqual('sm');
const tabs = [
  { slot: 'user', value: 'user', label: 'Usuario', icon: 'i-heroicons-user-circle', defaultOpen: true },
  { slot: 'companies', value: 'companies', label: 'Compañías', icon: 'i-heroicons-building-office-2', defaultOpen: false },
  { slot: 'colors', value: 'colors',label: 'Color', icon: 'i-heroicons-swatch', defaultOpen: false },
  { slot: 'theme', value: 'theme', label: 'Tema', icon: 'i-heroicons-moon', defaultOpen: false },
]
</script>

<template>
  <div><!--Required to prevent hydration mismatch-->
    <!--HEADER-->
    <UCard
      :ui="{ 
        body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' } ,
        rounded: 'rounded-none',
        header: { padding: 'px-0 py-0 sm:px-0' }
      }">
      <!--HEADER-->
      <template #header>
        <div class="flex items-center px-0 sm:px-4 py-0 sm:py-6">
          <UButton
            v-if="!smAndLarger"
            variant="ghost"
            icon="i-heroicons-bars-4"
            size="xl"
            class="px-4 py-4"
            :ui="{ rounded: 'rounded-none'}"
            @click="state.isMenuOpen = true" />
          <BittSkeletonTitle v-if="state.isLoadingUser" />
          <div v-else class="flex items-center pl-1">
            <NuxtImg 
              v-if="state.userData?.avatar_url"
              :src="state.userData?.avatar_url!"
              width="20"
              height="20"
              class="rounded" />
            <span class="text-xl truncate font-bold pl-2">
              Bienvenido {{state.userData?.user_name}}!
            </span>
          </div>
        </div>
      </template>
    </UCard>
    <div v-if="smAndLarger" class="h-2">
      <UProgress v-if="state.isLoadingMenu || state.isLoadingUser" animation="carousel" />
    </div>
    <!--BODY-->
    <div class="max-w-3xl mx-auto mt-0 sm:mt-3">
      <UCard
        :ui="{ 
          rounded: 'rounded-none sm:rounded-lg',
          header: { padding: 'px-1 sm:px-4 py-2' },
          body: { padding: '', base: '' } ,
        }" >
        <UTabs
          color="red"
          v-model="currenTab"
          :items="tabs"
          :ui="{
            list: {
              rounded: 'rounded-none',
              //padding: `${state.theme === 'dark' ? 'px-0' : 'p1'}`
            },
          }"
          class="w-full" />
          {{  }}
        <div class="h-[calc(100dvh-100px)] sm:h-[calc(100dvh-175px)] overflow-y-auto">
          <BittSkeletonList v-if="state.isLoadingUser" class="mx-6 mt-5" :items="1" />
          <div v-else>
            <User v-show="currenTab === 0" class="px-2 sm:px-4 pb-6" />
            <Companies v-show="currenTab === 1" class="px-2 sm:px-4 pb-6" />
            <Colors v-show="currenTab === 2" class="px-2 sm:px-4 pb-6" />
            <Theme v-show="currenTab === 3" class="px-2 sm:px-4 pb-6" />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>