import { defineStore } from 'pinia'
import type { type_sp_system_menu } from '@/typings/server/sp_system_menu';
import { sys_users, type type_sys_users } from "@/typings/server/sys_users";

interface userState {
  colors: ['indigo', 'violet', 'fuchsia', 'slate', 'zinc', 'neutral', 'stone', 'cool', 'green', 'emerald', 'teal', 'cyan', 'lime', 'blue', 'sky', 'orange', 'amber', 'yellow', 'bitt'],
  darkColors: ['slate', 'cool', 'zinc', 'stone', 'neutral'],
  themes: ['light', 'dark'],
  isLoadingMenu: boolean,
  isLoadingUser: boolean,
  menuData: type_sp_system_menu[],
  userData: type_sys_users,
  menuSelected: number,
  isMenuOpen: boolean,
  theme: string,
  preferedColor: string,
  preferedDarkColor: string,
  rowsPerPage: number,
}

export const useUserStore = defineStore({
  id: 'user-store',
  state: () : userState => {
    return {
      colors: ['indigo', 'violet', 'fuchsia', 'slate', 'zinc', 'neutral', 'stone', 'cool', 'green', 'emerald', 'teal', 'cyan', 'lime', 'blue', 'sky', 'orange', 'amber', 'yellow', 'bitt'],
      themes: ['light', 'dark'],
      darkColors: ['slate', 'cool', 'zinc', 'stone', 'neutral'],
      isLoadingMenu: false,
      isLoadingUser: false,
      menuData: [],
      userData: sys_users.parse({}),
      menuSelected: -1,
      isMenuOpen: false,
      theme: 'light',
      preferedColor: 'indigo',
      preferedDarkColor: 'neutral',
      rowsPerPage: 10,
    }
  },
  actions: {
    resetData() {
      this.menuData = [];
      this.userData = sys_users.parse({});
      this.menuSelected = -1;
      this.isMenuOpen = false;
    },
  },
})