import type { type_security_roles_schema } from "@/typings/client/securityRoles";

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