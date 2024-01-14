import type { type_uom_schema } from "@/typings/client/invUom";

export const useUom = () => useState<type_uom_schema>('uom', () => {
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