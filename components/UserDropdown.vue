<script setup lang="ts">
import { sys_users } from "@/typings/server/sys_users";
const state = useUser();
const supabase = useSupabaseClient();

const items = computed(() => [
  [
    {
      label: 'Sign out',
      icon: 'i-heroicons-arrow-left-start-on-rectangle',
      click: () => logout()
    }
  ]
])

const logout = async () => {
  // isLoading.value = true;
  await supabase.auth.signOut();
  document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
  // await router.push('/login');
  navigateTo('/login');
  //Reset state
  state.value.menuData = [];
  state.value.userData = sys_users.parse({});
  state.value.menuSelected = '-1';
  state.value.isMenuOpen = false;
  // isLoading.value = false;
}
</script>

<template>
  <UDropdown mode="hover" :items="items" :ui="{ width: 'w-full', item: { disabled: 'cursor-text select-text' } }" :popper="{ strategy: 'absolute', placement: 'top' }" class="w-full">
    <template #default="{ open }">
      <UButton
        class="w-full"
        :class="[open && 'bg-gray-50 dark:bg-gray-800']"
        color="gray"
        variant="ghost"
        :label="state.userData.user_name">
        <template #leading>
          <NuxtImg 
              v-if="state.userData?.avatar_url"
              :src="state.userData?.avatar_url!"
              width="15"
              height="15"
              class="rounded" />
        </template>

        <template #trailing>
          <UIcon name="i-heroicons-ellipsis-vertical" class="w-5 h-5 ml-auto" />
        </template>
      </UButton>
    </template>

    <template #account>
      <div class="text-left">
        <p>
          Usuario:
        </p>
        <p class="truncate font-medium text-gray-900 dark:text-white">
          {{ state.userData?.email }}
        </p>
      </div>
    </template>
  </UDropdown>
</template>