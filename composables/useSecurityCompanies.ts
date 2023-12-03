import type { type_security_companies_schema } from "@/typings/client/securityCompanies";

export const useSecurityCompanies = () => useState<type_security_companies_schema>('securityCompanies', () => {
  return {
    isLoading: false,
    companyData: {
      id: '',
      company_number: '',
      name_es: '',
      name_es_short: '',
      billing_phone: '',
      billing_address: '',
      is_active: true,
      created_at: '',
      updated_at: '',
      row_count: 0,
    },
    usersData: [],
  }

});