<script setup lang="ts">
import { z } from 'zod';
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
const myAxios = useAxios();


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

//Load User Menu
const loadUserMenu = async () => {
  try {
    state.value.isLoadingUser = true;
    const { data } = await myAxios.get('/api/system/userMenu');
    state.value.menuData = data;
  } catch(error) {
    console.error(error);
    navigateTo('/login');
  } finally {
    state.value.isLoadingMenu = false;
  }
}

//Load User Data
const loadUserData = async() => {
  try {
    state.value.isLoadingUser = true;
    const { data } = await myAxios.get('/api/system/userData');
    state.value.userData = data.userData;
    state.value.userCompanies = data.userCompanies;
    state.value.userCompany = data.userCompany.id;
    state.value.theme = data.userData.dark_enabled ? 'dark' : 'light';
    colorMode.preference = state.value.theme;
    state.value.preferedColor = state.value.userData.default_color ?? 'indigo';
    appConfig.ui.primary = state.value.preferedColor;
    state.value.preferedDarkColor = state.value.userData.default_dark_color ?? 'cool';
    appConfig.ui.gray = state.value.preferedDarkColor;
    handleInitialLoad();
  } catch(error) {
    console.error(error);
    navigateTo('/login');
  } finally {
    state.value.isLoadingUser = false;
  }
}

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
  state.value.menuSelected = matchingPath?.id ?? -1;
}

const logout = async () => {
  await supabase.auth.signOut();
  await router.push('/login');
  //Reset state
  state.value.menuData = [];
  state.value.userData = sys_users.parse({});
  state.value.menuSelected = -1;
  state.value.isMenuOpen = false;
}

onMounted(async() => {
  await loadUserMenu();
  await loadUserData();
});
</script>

<template>
<aside
  id="sidebar"
  class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform sm:translate-x-0 border-r dark:border-gray-800"
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
        class="pt-4 mt-4 space-y-2 font-medium  text-gray-400 dark:text-gray-500 border-gray-200">
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
            :title="menu.name_es"
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