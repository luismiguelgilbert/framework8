import type { type_uom_schema } from "@/typings/client/invUom";
import type { filter_payload } from "@/typings/server/filter_payload";
import type { type_traselec } from '@/typings/server/traselec';

export const useTraselec = () => useState<type_uom_schema>('uom', () => {
  return {
    isLoading: false,
    uomData: {
      id: '',
      name_es: '',
      name_es_short: '',
      is_active: true,
      created_at: '',
      updated_at: '',
      row_count: 0,
    },
  }

});

export const useTraselecMainCard = () => useState('traselecMainCard', () => {
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
    rows: [] as type_traselec[],
  }
});