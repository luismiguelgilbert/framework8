import type { type_invTypes_schema } from "@/typings/client/invTypes";
import type { filter_payload } from "@/typings/server/filter_payload";
import type { type_inv_types } from '@/typings/server/inv_types';

export const useInvTypes = () => useState<type_invTypes_schema>('uom', () => {
  return {
    isLoading: false,
    invTypeData: {
      id: '',
      parent: null,
      name_es: '',
      is_active: true,
      created_at: '',
      updated_at: '',
      row_count: 0,
    },
  }

});

export const useInvTypesMainCard = () => useState('invTypesMainCard', () => {
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
    rows: [] as type_inv_types[],
  }
});