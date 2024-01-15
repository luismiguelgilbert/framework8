import type { type_security_users_schema } from "@/typings/client/securityUsers";
import type { filter_payload } from "@/typings/server/filter_payload";
import type { type_sys_users } from '@/typings/server/sys_users';

export const useSecurityUsers = () => useState<type_security_users_schema>('securityUsers', () => {
  return {
    isLoading: false,
    userData: {
      id: '',
      user_name: '',
      user_lastname: '',
      avatar_url: '',
      website: '',
      email: '',
      sys_profile_id: 1,
      sys_profile_name: 'empty',
      dark_enabled: false,
      default_color: 'indigo',
      default_dark_color: 'neutral',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_sign_in_at: null,
      row_count: 0,
    },
    allProfiles:[],
    userCompanies: [],
    allCompanies: [],
  }

});

export const useSecurityUsersMainCard = () => useState('securityUsersMainCard', () => {
  return {
    payload: {
      isDefault: '1',
      status: '1',
      sortBy: '1',
      searchString: '',
      id: '',
      page: '1',
      rowsPerPage: '20',
    } as filter_payload,
    rows: [] as type_sys_users[],
  }
});