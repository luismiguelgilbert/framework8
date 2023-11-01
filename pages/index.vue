<script setup lang="ts">
useHead({ title: 'BITT - Welcome' });
import Theme from './indexTheme.vue'
import Colors from './indexColor.vue'
import User from './indexUser.vue'

const state = useUser();
const currenTab = ref('user');
</script>

<template>
  <div class="max-w-3xl mx-auto"><!--Required to prevent hydration mismatch-->
    <!--class="max-w-3xl h-[calc(100dvh-70px)] sm:h-[calc(100dvh-25px)] mx-auto overflow-y-auto"-->
    <UCard
      :ui="{
          rounded: 'rounded-none sm:rounded-lg',
          body: 'px-0',
          header: {
            padding: 'sm:px-2 px-2 py-3',
          },
          footer: {
            padding: 'px-0 py-0 sm:px-0'
          }
        }">
      <!--HEADER-->
      <template #header>
        <div class="flex items-center justify-between gap-3 px-4 py-3">
          <BittSkeletonTitle v-if="state.isLoadingUser" />
          <div v-else class="flex items-center">
            <UAvatar
              v-if="state.userData?.avatar_url"
              :src="state.userData?.avatar_url!"
              :alt="state.userData.user_name!"
              size="sm" />
            <span class="pl-2 text-2xl font-bold">
              Bievenido {{state.userData?.user_name}}!
            </span>
          </div>
        </div>
      </template>
      <!--BODY-->
      <div class="h-[calc(100dvh-192px)] sm:h-[calc(100dvh-170px)] overflow-y-auto">
        <BittSkeletonList v-if="state.isLoadingUser" class="mx-6 mt-5" :items="10" />
        <div v-else class="py-4">
          <Theme v-show="currenTab === 'theme'" class="px-2 sm:px-4 pb-6" />
          <Colors v-show="currenTab == 'colors'" class="px-2 sm:px-4 pb-6" />
          <User v-show="currenTab === 'user'" class="px-2 sm:px-4 pb-6" />
        </div>
        <br /><br />
      </div>
      <!--HEADER-->
      <template #footer>
        <UButtonGroup size="xl" orientation="horizontal" :ui="{ rounded: 'rounded-none' }" class="grid grid-cols-3 text-center"> 
          <UButton @click="currenTab = 'user'" label="Usuario" icon="i-heroicons-user-circle" :variant="currenTab === 'user' ? 'solid':'soft'" size="xl" truncate class="justify-center" />
          <UButton @click="currenTab = 'theme'" label="Tema" icon="i-heroicons-moon" :variant="currenTab === 'theme' ? 'solid':'soft'" size="xl" truncate class="justify-center" />
          <UButton @click="currenTab = 'colors'" label="Color" icon="i-heroicons-swatch" :variant="currenTab === 'colors' ? 'solid':'soft'" size="xl" truncate class="justify-center" />
        </UButtonGroup>
      </template>
    </UCard>
  </div>
</template>