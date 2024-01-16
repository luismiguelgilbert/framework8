import type { type_brands_schema } from "@/typings/client/invBrands";
import type { filter_payload } from "@/typings/server/filter_payload";
import type { type_inv_brands } from '@/typings/server/inv_brands';

export const useBrands = () => useState<type_brands_schema>('uom', () => {
  return {
    isLoading: false,
    brandData: {
      id: '',
      name_es: '',
      is_active: true,
      created_at: '',
      updated_at: '',
      row_count: 0,
    },
  }
});

export const useBrandsMainCard = () => useState('brandsMainCard', () => {
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
    rows: [] as type_inv_brands[],
  }
});