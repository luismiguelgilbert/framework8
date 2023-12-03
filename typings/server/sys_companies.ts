import { z } from "zod"

export const sys_companies = z.object({
  id: z.coerce.string(),
  company_number: z.string()
    .min(3, { message: "RUC debe incluir 3 o más caracteres." })
    .max(13, { message: "RUC debe incluir máximo 13 caracteres." })
    .default(''),
  name_es: z.string()
    .min(3, { message: "Razón Social debe incluir 3 o más caracteres." })
    .default(''),
  name_es_short: z.string()
    .min(3, { message: "Nombre debe incluir 3 o más caracteres." })
    .default(''),
  billing_phone: z.string().optional().default(''),
  billing_address: z.string().optional().default(''),
  is_active: z.boolean().default(true),
  created_at: z.coerce.string().optional().nullable().default(new Date().toISOString()),
  updated_at: z.coerce.string().optional().nullable().default(new Date().toISOString()),
  row_count: z.coerce.number().optional().nullable().default(0),
});
export type type_sys_companies = z.infer<typeof sys_companies>;

export const status_options = [
  { label: 'Compañías Activas', value: 1, sqlValue: 'true', icon: 'fas fa-filter' },
  { label: 'Compañías Inactivas', value: 2, sqlValue: 'false', icon: 'fas fa-filter' },
  { label: 'Todas los Compañías', value: 3, sqlValue: 'a.is_active', icon: 'fas fa-filter' },
];

export const sort_options = [
  { label: 'Ordenar por Nombre', value: 1, sqlValue: 'a.name_es', icon: 'fas fa-arrow-up-short-wide' },
  { label: 'Ordenar por Razón Social', value: 2, sqlValue: 'a.is_active', icon: 'fas fa-arrow-up-short-wide' },
  { label: 'Ordenar por Código', value: 3, sqlValue: 'a.id', icon: 'fas fa-arrow-up-short-wide' }
];