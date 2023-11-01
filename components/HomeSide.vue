<script setup lang="ts">
import { z } from 'zod';
import { sp_system_menu } from '@/typings/server/sp_system_menu';
import type { type_sp_system_menu } from '@/typings/server/sp_system_menu';
import { sys_users } from "@/typings/server/sys_users";

useHead({ title: 'BITT - Welcome' });
const appConfig = useAppConfig()
const colorMode = useColorMode()
const router = useRouter();
const { path } = useRoute();
const state = useUser();
const currentRoute = computed(() => state.value.menuData?.find(menu => menu.id === state.value.menuSelected));

const openMenu = (menu: z.infer<typeof sp_system_menu>) => {
  if (state.value.menuSelected !== menu.id) { 
    state.value.menuSelected = menu.id!;
    navigateTo(menu.link!);
  }
  state.value.isMenuOpen = false;
};

//Load User Menu Data
state.value.isLoadingUser = true;
const { data: userMenuData, error: userMenuError } = await useFetch('/api/system/userMenu');
if (userMenuError.value?.statusCode === 401) { navigateTo('/login') }
state.value.menuData = userMenuData.value!;
state.value.isLoadingUser = false;

//Load User Data
state.value.isLoadingMenu = true;
const { data: userData, error: userDataError } = await useFetch('/api/system/userData');
if (userDataError.value) { navigateTo('/login') }
state.value.userData = userData.value!;
state.value.theme = userData.value?.dark_enabled ? 'dark' : 'light';
colorMode.preference = state.value.theme;
state.value.preferedColor = userData.value?.default_color ?? 'indigo';
appConfig.ui.primary = state.value.preferedColor;
state.value.preferedDarkColor = userData.value?.default_dark_color ?? 'cool';
appConfig.ui.gray = state.value.preferedDarkColor;
state.value.isLoadingMenu = false;

const logout = async () => {
  await router.push('/login');
  const authCookie = useCookie('sb-access-token');
  authCookie.value = null;
  //Reset state
  state.value.menuData = [];
  state.value.userData = sys_users.parse({});
  state.value.menuSelected = -1;
  state.value.isMenuOpen = false;
}

//Selects the current menu item, based on matching path with longest length
let matchingPaths: type_sp_system_menu[] = [];
let matchingPath: type_sp_system_menu = {} as type_sp_system_menu;
state.value.menuData?.forEach(menu => {
  if (menu.link && path.includes(menu.link)) {
    matchingPaths.push(menu);
  }
});
matchingPath = matchingPaths.sort((a, b) => b.link!.length - a.link!.length)[0];
state.value.menuSelected = matchingPath?.id ?? -1;
</script>

<template>

<nav class="inline-flex w-screen items-center border-b-2 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700 text-sm text-gray-500 sm:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:focus:ring-gray-600">
  <UButton
    class="h-fit py-8 pl-4 pr-5 rounded-none"
    square
    size="xl"
    variant="ghost"
    @click="state.isMenuOpen = true">
    <template #leading>
      <i class="fas fa-rectangle-list fa-xl"></i>
    </template>
  </UButton>
  <div class="inline-flex w-screen items-center justify-start">
    <span class="pl-2 text-xl font-semibold text-gray-800 dark:text-gray-400">{{ currentRoute?.name_es }}</span>
  </div>
</nav>

<aside
  id="sidebar"
  class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform sm:translate-x-0 border-r dark:border-transparent"
  :class="{ '-translate-x-full' : !state.isMenuOpen }"
  aria-label="Sidebar">
  <div
    v-if="!state.isLoadingMenu"
    class="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-900">
    <div
      v-for="(rootMenu, index) in state.menuData?.filter((m) => m.parent === null)"
      :key="index">
      <ul 
        v-if="rootMenu.id !== 0 && state.menuData.filter(m => m.parent == rootMenu.id).length > 0" 
        class="pt-4 mt-4 space-y-2 font-medium border-t text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700">
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
            block
            size="xl"
            variant="soft"
            :label="menu.name_es"
            @click="openMenu(menu)">
            <template #leading>
              <i :class="`${menu.icon} fa-xl`"></i>
            </template>
          </UButton>
          <UButton
            v-else
            class="justify-start"
            truncate
            block
            size="xl"
            color="gray"
            variant="ghost"
            :label="menu.name_es"
            @click="openMenu(menu)">
            <template #leading>
              <i :class="`${menu.icon} fa-xl`"></i>
            </template>
          </UButton>
        </NuxtLink>
      </ul>
    </div>
    <br/><br/> <br/>
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
      @click="logout">
      <template #leading>
        <i class="fa-solid fa-door-open fa-xl"></i>
      </template>
    </UButton>
   </div>
</aside>

</template>