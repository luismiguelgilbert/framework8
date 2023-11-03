import type { type_security_users_schema } from "@/typings/client/securityUsers";
import { security_users_schema } from "@/typings/client/securityUsers";

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
      sys_profile_name: 'tes',
      dark_enabled: false,
      default_color: 'indigo',
      default_dark_color: 'neutral',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_sign_in_at: null,
      row_count: 0,
    },
    // profileLinks: [],
    // usersData: [],
    // allLinks: [],
  }

});