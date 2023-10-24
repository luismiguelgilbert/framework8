import { defineStore } from 'pinia'
// import { useUserStore } from '@/stores/userStore';
import type { type_sys_profiles } from "@/typings/server/sys_profiles";
import type { type_sys_users } from "@/typings/server/sys_users";
import type { type_sys_links } from "@/typings/server/sys_links";
interface SecurityUsersState {
  filter: {
    sortBy: number,
    descending: boolean,
    page: number,
    searchString: string,
    status: Array<any>,
    rowsNumber: number,
  },
  isLoading: boolean,
  rows: type_sys_users[],
  formData: {
    profileData: type_sys_profiles,
    profileLinks: type_sys_links[],
    usersData: type_sys_users[],
    allLinks: type_sys_links[],
  }
}

export const useSecurityUsersStore = defineStore({
  id: 'security-users-store',
  state: () : SecurityUsersState => {
    return {
      filter: {
        sortBy: 1,
        descending: false,
        page: 1,
        searchString: '',
        status: [],
        rowsNumber: 0,
      },
      isLoading: false,
      rows: [],
      formData: {
        profileData: {
          id: 0,
          name_es: '',
          is_active: false,
          created_at: '',
          updated_at: '',
          user_count: 0,
          row_count: 0,
        },
        profileLinks: [],
        usersData: [],
        allLinks: [],
      }
    }
  },
  getters: {
    filterLabel: (state) => {
      const hasTrue = state.filter.status.includes(true);
      const hasFalse = state.filter.status.includes(false);
      if ((!hasTrue && !hasFalse) || (hasTrue && hasFalse)) {
        return 'Todos los Usuarios'
      } else if (hasTrue) {
        return 'Usuarios Activos'
      } else {
        return 'Usuarios Inactivos'
      }
    }
  },
  /*actions: {
  },*/
})