<script setup lang="ts">
import { z } from 'zod';
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore';
import { sp_system_menu } from '@/typings/server/sp_system_menu';
import type { type_sp_system_menu } from '@/typings/server/sp_system_menu';

useHead({ title: 'BITT - Welcome' });
const store = useUserStore();
const appConfig = useAppConfig()
const colorMode = useColorMode()
const router = useRouter();
const { path } = useRoute();
const { isLoadingMenu, menuData, menuSelected } = storeToRefs(store);
const currentRoute = computed(() => menuData?.value?.find(menu => menu.id === menuSelected?.value));

const openMenu = (menu: z.infer<typeof sp_system_menu>) => {
  if (store.menuSelected !== menu.id) { 
    store.menuSelected = menu.id!;
    navigateTo(menu.link!);
  }
  store.isMenuOpen = false;
};

//Load User Menu Data
store.isLoadingUser = true;
const { data: userMenuData, error: userMenuError } = await useFetch('/api/system/userMenu');
if (userMenuError.value?.statusCode === 401) { navigateTo('/login') }
store.menuData = userMenuData.value!;
store.isLoadingUser = false;

//Load User Data
store.isLoadingMenu = true;
const { data: userData, error: userDataError } = await useFetch('/api/system/userData');
if (userDataError.value) { navigateTo('/login') }
store.userData = userData.value!;
store.theme = userData.value?.dark_enabled ? 'dark' : 'light';
colorMode.preference = store.theme;
store.preferedColor = userData.value?.default_color ?? 'indigo';
appConfig.ui.primary = store.preferedColor;
store.preferedDarkColor = userData.value?.default_dark_color ?? 'cool';
appConfig.ui.gray = store.preferedDarkColor;
store.isLoadingMenu = false;

const logout = async () => {
  await router.push('/login');
  const authCookie = useCookie('sb-access-token');
  authCookie.value = null;
  store.resetData();
}

//Selects the current menu item, based on matching path with longest length
let matchingPaths: type_sp_system_menu[] = [];
let matchingPath: type_sp_system_menu = {} as type_sp_system_menu;
menuData.value?.forEach(menu => {
  if (menu.link && path.includes(menu.link)) {
    matchingPaths.push(menu);
  }
});
matchingPath = matchingPaths.sort((a, b) => b.link!.length - a.link!.length)[0];
menuSelected.value = matchingPath?.id ?? -1;
</script>

<template>

<nav class="inline-flex w-screen items-center border-b-2 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700 text-sm text-gray-500 sm:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:focus:ring-gray-600">
  <UButton
    class="h-fit py-8 pl-4 pr-5 rounded-none"
    square
    size="xl"
    variant="ghost"
    @click="store.isMenuOpen = true">
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
  :class="{ '-translate-x-full' : !store.isMenuOpen }"
  aria-label="Sidebar">
  <div
    v-if="!isLoadingMenu"
    class="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-900">
    <div
      v-for="(rootMenu, index) in menuData?.filter((m) => m.parent === null)"
      :key="index">
      <ul 
        v-if="rootMenu.id !== 0" 
        class="pt-4 mt-4 space-y-2 font-medium border-t text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700">
        {{ rootMenu.name_es }}
      </ul>
      <ul
        v-for="(menu, index) in menuData?.filter((m) => m.parent === rootMenu.id)"
        :key="index" 
        class="space-y-2 font-medium"
        @click="openMenu(menu)">
        <NuxtLink class="w-full pt-2">
          <UButton
            v-if="menu.id === store.menuSelected"
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