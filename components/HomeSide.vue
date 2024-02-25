<script setup lang="ts">
import { z } from 'zod';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { sp_system_menu } from '@/typings/server/sp_system_menu';
import { sys_users } from "@/typings/server/sys_users";
import type { type_sp_system_menu } from '@/typings/server/sp_system_menu';

useHead({ title: 'BITT - Welcome' });
const appConfig = useAppConfig()
const colorMode = useColorMode()
const router = useRouter();
const { path } = useRoute();
const state = useUser();
const supabase = useSupabaseClient();
const breakpoints = useBreakpoints(breakpointsTailwind);
const mdAndLarger = breakpoints.greaterOrEqual('md');
const isLoading = ref(false);
const isUpdating = ref(false);


const openMenu = (menu: z.infer<typeof sp_system_menu>) => {
  if (state.value.menuSelected !== menu.id) { 
    state.value.menuSelected = menu.id!;
    const newURL = menu.requires_company 
    ? `${menu.link}/${state.value.userCompany}`
    : menu.link;
    navigateTo(newURL)
  }
  state.value.isMenuOpen = false;
};

const handleInitialLoad = () => {
  //Selects the current menu item, based on matching path with longest length
  let matchingPaths: type_sp_system_menu[] = [];
  let matchingPath: type_sp_system_menu = {} as type_sp_system_menu;
  state.value.menuData?.forEach(menu => {
    if (menu.link && path.includes(menu.link)) {
      matchingPaths.push(menu);
    }
  });
  matchingPath = matchingPaths.sort((a, b) => b.link!.length - a.link!.length)[0];
  state.value.menuSelected = matchingPath?.id ?? '-1';
};

//Load Menu Data
const { data:menuData, error:menuError, pending: menuPending } = await useFetch('/api/system/userMenu');
if (menuError.value) { navigateTo('/login') }
if (!menuError.value && menuData.value) { state.value.menuData = menuData.value }

//Load User Data
const { data:userData, error:userError } = await useFetch('/api/system/userData');
if (userError.value) { navigateTo('/login') }
if (!userError.value && userData.value) {
  state.value.userData = userData.value.userData;
  state.value.userCompanies = userData.value.userCompanies;
  state.value.userCompany = userData.value.userCompany.id;
  state.value.theme = userData.value.userData.dark_enabled ? 'dark' : 'light';
  colorMode.preference = state.value.theme;
  state.value.preferedColor = state.value.userData.default_color ?? 'indigo';
  appConfig.ui.primary = state.value.preferedColor;
  state.value.preferedDarkColor = state.value.userData.default_dark_color ?? 'cool';
  appConfig.ui.gray = state.value.preferedDarkColor;
  handleInitialLoad();
}

const setPreferedCompany = async (company: string) => {
  isUpdating.value = true;
  await useFetch(`/api/users/${state.value.userData.id}/preferences`, {
    method: 'patch',
    body: { prefered_company: state.value.userCompany },
  });
  isUpdating.value = false;
}

const logout = async () => {
  isLoading.value = true;
  await supabase.auth.signOut();
  document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
  await router.push('/login');
  //Reset state
  state.value.menuData = [];
  state.value.userData = sys_users.parse({});
  state.value.menuSelected = '-1';
  state.value.isMenuOpen = false;
  isLoading.value = false;
}

</script>

<template>
  <!-- <div data-headlessui-state="close" class="relative flex-1 flex flex-col w-full focus:outline-none w-screen max-w-md bg-white dark:bg-gray-900">
    <div class="fixed inset-0 transition-opacity bg-gray-200/75 dark:bg-gray-800/75">
      <div class="relative flex-1 flex flex-col w-full focus:outline-none w-screen max-w-md bg-white dark:bg-gray-900">
        <div class="h-[--header-height] flex-shrink-0 flex items-center border-b border-gray-200 dark:border-gray-800 px-4 gap-x-4 min-w-0 !border-transparent">
          <div class="flex items-center justify-between flex-1 gap-x-1.5 min-w-0">
            <div class="flex items-stretch gap-1.5 min-w-0 flex-1">
              <UButton
                class="justify-start"
                truncate
                size="xl"
                variant="ghost"
                @click="state.isMenuOpen = false">
                <template #leading>
                  <i class="i-heroicons-pencil-square"></i>
                </template>
              </UButton>
              <USelectMenu
                v-if="!menuPending && !menuError"
                v-model="state.userCompany"
                class="mb-5"
                value-attribute="id"
                option-attribute="name_es_short"
                size="xl"
                :options="state.userCompanies"
                @update:model-value="setPreferedCompany" />
            </div>
          </div>
        </div>
        <div class="flex flex-col w-full flex-1 relative overflow-hidden">
          <div class="flex-grow flex flex-col min-h-0 gap-y-2 py-2">
            <div class="w-full flex flex-col px-4">
              Searchbar
            </div>
            <div class="flex-1 px-4 flex flex-col gap-y-2 overflow-y-auto">
              <div v-if="!menuPending && !menuError">
                <div
                  v-for="(rootMenu, index) in state.menuData?.filter((m) => m.parent === null)"
                  :key="index">
                  <ul 
                    v-if="rootMenu.id !== '0' && state.menuData.filter(m => m.parent == rootMenu.id).length > 0" 
                    class="pt-4 mt-4 space-y-2 font-medium text-gray-400 dark:text-gray-500 border-gray-200">
                    {{ rootMenu.name_es }}
                  </ul>
                  <ul
                    v-for="(menu, index) in state.menuData?.filter((m) => m.parent === rootMenu.id)"
                    :key="index" 
                    class="space-y-2 font-medium"
                    @click="openMenu(menu)">
                    <NuxtLink class="w-full pt-2">
                      <UButton
                        v-if="menu.id === state.menuSelected"
                        class="justify-start"
                        truncate
                        :title="menu.name_es"
                        block
                        size="xl"
                        variant="ghost"
                        :label="menu.name_es"
                        @click="openMenu(menu)">
                        <template #leading>
                          <i :class="`${menu.icon} `"></i>
                        </template>
                      </UButton>
                      <UButton
                        v-else
                        class="justify-start"
                        truncate
                        :title="menu.name_es"
                        block
                        size="xl"
                        color="gray"
                        variant="ghost"
                        :label="menu.name_es"
                        @click="openMenu(menu)">
                        <template #leading>
                          <i :class="`${menu.icon} `"></i>
                        </template>
                      </UButton>
                    </NuxtLink>
                  </ul>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between gap-x-1.5 flex-shrink-0 px-4">
              Footer
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> -->
<aside
  id="sidebar"
  class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform sm:translate-x-0 border-r dark:border-gray-800"
  :class="{ '-translate-x-full' : !state.isMenuOpen }"
  aria-label="Sidebar">


  <div class="sticky top-0 left-0 z-50 w-full h-14 border-t bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-600">
    <UDropdown class="w-full" :items="state.userCompanies" :popper="{ placement: 'bottom-start' }">
      <UButton block size="xl" variant="ghost" square :label="state.userCompany" trailing-icon="i-heroicons-chevron-down-20-solid" />
    </UDropdown>
    <!-- <USelectMenu
      v-model="state.userCompany"
      class="mb-5"
      value-attribute="id"
      option-attribute="name_es_short"
      size="xl"
      :ui="{ rounded: 'rounded-none', ring: 'ring-0'}"
      :options="state.userCompanies"
      @update:model-value="setPreferedCompany" /> -->
   </div>

  <div
    v-if="!menuPending && !menuError"
    class="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-900">
    <div
      v-for="(rootMenu, index) in state.menuData?.filter((m) => m.parent === null)"
      :key="index">
      <ul 
        v-if="rootMenu.id !== '0' && state.menuData.filter(m => m.parent == rootMenu.id).length > 0" 
        class="pt-4 mt-4 space-y-2 font-medium text-gray-400 dark:text-gray-500 border-gray-200">
        {{ rootMenu.name_es }}
      </ul>
      <ul
        v-for="(menu, index) in state.menuData?.filter((m) => m.parent === rootMenu.id)"
        :key="index" 
        class="space-y-2 font-medium"
        @click="openMenu(menu)">
        <NuxtLink class="w-full pt-2">
          <UButton
            v-if="menu.id === state.menuSelected"
            class="justify-start"
            truncate
            :title="menu.name_es"
            block
            size="xl"
            variant="ghost"
            :label="menu.name_es"
            @click="openMenu(menu)">
            <template #leading>
              <i :class="`${menu.icon} `"></i>
            </template>
          </UButton>
          <UButton
            v-else
            class="justify-start"
            truncate
            :title="menu.name_es"
            block
            size="xl"
            color="gray"
            variant="ghost"
            :label="menu.name_es"
            @click="openMenu(menu)">
            <template #leading>
              <i :class="`${menu.icon} `"></i>
            </template>
          </UButton>
        </NuxtLink>
      </ul>
    </div>
    <br v-if="mdAndLarger" v-for="n in 2"/>
    <br v-if="!mdAndLarger" v-for="n in 7"/>
  </div>
  <div v-else>
    <div v-for="n in 20" class="space-y-2 p-2">
      <USkeleton class="h-4 w-[200px]" />
      <USkeleton class="h-4 w-[150px]" />
    </div>
  </div>

  <div class="sticky bottom-0 left-0 z-50 w-full h-14 border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
    <UButton
      class="h-fit py-4 pr-4 rounded-none"
      square
      block
      label="Logout"
      size="xl"
      :loading="isLoading"
      :disabled="isLoading"
      @click="logout">
      <template #leading v-if="!isLoading">
        <i class="i-heroicons-arrow-left-end-on-rectangle "></i>
      </template>
    </UButton>
   </div>
</aside>

</template>