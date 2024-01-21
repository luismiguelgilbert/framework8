import { z } from "zod"

export const traselec = z.object({
  id: z.coerce.string(),
  name: z.string(),
  internal_code: z.string(),
  is_active: z.boolean().default(true),
  row_count: z.coerce.number().optional().nullable().default(0),
});
export type type_traselec = z.infer<typeof traselec>;

export const status_options = [
  { label: 'Items Activos', value: 1, sqlValue: 1, icon: 'fas fa-filter' },
  { label: 'Items Inactivos', value: 2, sqlValue: 0, icon: 'fas fa-filter' },
  { label: 'Todos los Items', value: 3, sqlValue: 'a.estado', icon: 'fas fa-filter' },
];

export const sort_options = [
  { label: 'Ordenar por Nombre', value: 1, sqlValue: 'b.name', icon: 'fas fa-arrow-up-short-wide' },
  { label: 'Ordenar por Cod int', value: 2, sqlValue: 'a.internal_code', icon: 'fas fa-arrow-up-short-wide' },
  { label: 'Ordenar por Código', value: 3, sqlValue: 'a.Inventory_ID', icon: 'fas fa-arrow-up-short-wide' }
];