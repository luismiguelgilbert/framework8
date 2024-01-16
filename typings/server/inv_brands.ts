import { z } from "zod"

export const inv_brands = z.object({
  id: z.coerce.string(),
  name_es: z.string()
    .min(2, { message: "Nombre debe incluir 2 o más caracteres." })
    .default(''),
  is_active: z.boolean().default(true),
  created_at: z.coerce.string().optional().nullable().default(new Date().toISOString()),
  updated_at: z.coerce.string().optional().nullable().default(new Date().toISOString()),
  row_count: z.coerce.number().optional().nullable().default(0),
});
export type type_inv_brands = z.infer<typeof inv_brands>;

export const status_options = [
  { label: 'Marcas Activas', value: 1, sqlValue: 'true', icon: 'fas fa-filter' },
  { label: 'Marcas Inactivas', value: 2, sqlValue: 'false', icon: 'fas fa-filter' },
  { label: 'Todas los Marcas', value: 3, sqlValue: 'a.is_active', icon: 'fas fa-filter' },
];

export const sort_options = [
  { label: 'Ordenar por Nombre', value: 1, sqlValue: 'a.name_es', icon: 'fas fa-arrow-up-short-wide' },
  { label: 'Ordenar por Código', value: 2, sqlValue: 'a.id', icon: 'fas fa-arrow-up-short-wide' }
];