<script setup lang="ts">
import type { DashboardSidebarLink } from '#ui-pro/types'

const appConfig = useAppConfig();
const colorMode = useColorMode();
const state = useUser();

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
}

const userMenu = computed<Array<DashboardSidebarLink>>(() => {
  let rootMenu = state.value.menuData.filter((menu) => !menu.parent)
    .map(menu => { 
      const children = state.value.menuData.filter((child) => child.parent === menu.id)
        .map(x => { return {
          // id: x.id,
          label: x.name_es,
          to: x.link!,
        }
      });

      return {
        // id: menu.id,
        label: menu.name_es,
        icon: menu.icon!,
        to: menu.id === '0' ? '/' : undefined,
        children: menu.id != '0' ? children : undefined
      }
    });
  return rootMenu;
});

</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel :width="250" :resizable="{ min: 200, max: 300 }" collapsible>
      <UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
        <template #left>
          <TeamsDropdown />
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <UDashboardSidebarLinks :links="userMenu" />
        <UDivider class="sticky bottom-0" />
        <template #footer>
          <UserDropdown />
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <slot />
  </UDashboardLayout>
</template>