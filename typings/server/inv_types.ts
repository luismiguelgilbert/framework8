import { z } from "zod"

export const inv_types = z.object({
  id: z.coerce.string(),
  parent: z.coerce.string().nullable(),
  name_es: z.string()
    .min(2, { message: "Nombre debe incluir 2 o más caracteres." })
    .default(''),
  full_path: z.string().optional().nullable().default(''),
  is_active: z.boolean().default(true),
  created_at: z.coerce.string().optional().nullable().default(new Date().toISOString()),
  updated_at: z.coerce.string().optional().nullable().default(new Date().toISOString()),
  row_count: z.coerce.number().optional().nullable().default(0),
});
export type type_inv_types = z.infer<typeof inv_types>;

export const status_options = [
  { label: 'Tipos Activos', value: 1, sqlValue: 'true', icon: 'fas fa-filter' },
  { label: 'Tipos Inactivos', value: 2, sqlValue: 'false', icon: 'fas fa-filter' },
  { label: 'Todos los Tipos', value: 3, sqlValue: 'a.is_active', icon: 'fas fa-filter' },
];

export const sort_options = [
  { label: 'Ordenar por Nombre', value: 1, sqlValue: 'a.name_es', icon: 'fas fa-arrow-up-short-wide' },
  { label: 'Ordenar por Código', value: 2, sqlValue: 'a.id', icon: 'fas fa-arrow-up-short-wide' }
];