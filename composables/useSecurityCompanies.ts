import type { type_security_companies_schema } from "@/typings/client/securityCompanies";
import type { filter_payload } from "@/typings/server/filter_payload";
import type { type_sys_companies } from '@/typings/server/sys_companies';
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

export const useSecurityCompaniesMainCard = () => useState('securityCompaniesMainCard', () => {
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
    rows: [] as type_sys_companies[],
  }
});