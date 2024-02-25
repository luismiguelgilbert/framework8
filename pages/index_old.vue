<script setup lang="ts">
useHead({ title: 'BITT - Welcome' });
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import Colors from './indexColor.vue'
import User from './indexUser.vue'

const state = useUser();
const tab = ref('user');
const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greaterOrEqual('sm');
const tabs = [
  { slot: 'user', value: 'user', label: 'Usuario', icon: 'i-heroicons-user-circle', defaultOpen: true },
  { slot: 'colors', value: 'colors',label: 'Color', icon: 'i-heroicons-swatch', defaultOpen: false },
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
    <!--BODY-->
    <div class="max-w-full mx-auto mt-0">
      <UCard
        :ui="{ 
          rounded: 'rounded-none',
          header: { padding: 'px-1 sm:px-4 py-2' },
          body: { padding: '', base: '' } ,
        }" >
        <BTabs
          v-model="tab"
          :items="tabs" />
        <UDivider />
        <div class="h-[calc(100dvh-95px)] sm:h-[calc(100dvh-120px)] xl:h-[calc(100dvh-120px)] overflow-x-hidden overflow-y-auto px-4">
          <BittSkeletonList v-if="state.isLoadingUser" class="mx-6 mt-5" :items="1" />
          <div v-else>
            <User v-if="tab === tabs[0].value" class="px-2 sm:px-4 pb-6" />
            <Colors v-if="tab === tabs[1].value" class="px-2 sm:px-4 pb-6" />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>