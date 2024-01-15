import type { type_security_roles_schema } from "@/typings/client/securityRoles";
import type { filter_payload } from "@/typings/server/filter_payload";
import type { type_sys_profiles } from '@/typings/server/sys_profiles';
export const useSecurityRoles = () => useState<type_security_roles_schema>('securityRoles', () => {
  return {
    isLoading: false,
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
});

export const useSecurityRolesMainCard = () => useState('securityRolesMainCard', () => {
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
    rows: [] as type_sys_profiles[],
  }
});