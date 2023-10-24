import type { security_roles } from "@/typings/client/securityRoles";

export const useSecurityRoles = () => useState<security_roles>('securityRoles', () => {
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