import { z } from "zod"

export const sys_users = z.object({
  id: z.coerce.string(),
  user_name: z.coerce.string().optional().nullable(),
  user_lastname: z.string().optional().nullable(),
  avatar_url: z.coerce.string().optional().nullable(),
  website: z.coerce.string().optional().nullable(),
  email: z.coerce.string().nullable(),
  sys_profile_id: z.number().optional().nullable(),
  sys_profile_name: z.coerce.string().optional().nullable(),
  dark_enabled: z.coerce.boolean().optional().nullable().default(false),
  default_color: z.coerce.string().optional().nullable().default("indigo"),
  default_dark_color: z.coerce.string().optional().nullable().default("neutral"),
  created_at: z.coerce.string().optional().nullable().default(new Date().toISOString()),
  updated_at: z.coerce.string().optional().nullable().default(new Date().toISOString()),
  last_sign_in_at: z.coerce.string().optional().nullable().default(new Date().toISOString()),
  row_count: z.coerce.number().optional().nullable().default(0),
});
export type type_sys_users = z.infer<typeof sys_users>;

export const status_options = [
  { label: 'Todos los Usuarios', value: 1, sqlValue: 'true', icon: 'fas fa-filter', shortcuts: ['T'] },
];

export const sort_options = [
  { label: 'Ordenar por Apellidos', value: 1, sqlValue: 'b.user_lastname', icon: 'fas fa-arrow-up-short-wide', shortcuts: ['A'] },
  { label: 'Ordenar por Nombres', value: 2, sqlValue: 'b.user_name', icon: 'fas fa-arrow-up-short-wide', shortcuts: ['N'] },
  { label: 'Ordenar por Mail', value: 3, sqlValue: 'a.email', icon: 'fas fa-arrow-up-short-wide', shortcuts: ['M'] },
  { label: 'Ordenar por Perfil', value: 4, sqlValue: 'd.name_es', icon: 'fas fa-arrow-up-short-wide', shortcuts: ['P'] }
];

// statusOptions: [
//   { label: 'Todos los Usuarios', value: true, key: 1 },
// ],
// sortOptions: [
//   { label: 'Ordenar por Nombres', value: 1 },
//   { label: 'Ordenar por Apellidos', value: 2 },
//   { label: 'Ordenar por Mail', value: 3 },
//   { label: 'Ordenar por Perfil', value: 4 },
// ],
// columns: [
//   { key: 'avatar_url', name: 'avatar_url', field: 'avatar_url', label: 'Foto', sortable: false },
//   { key: 'user_name', name: 'user_name', field: 'user_name', label: 'Usuario', sortable: false },
//   { key: 'last_sign_in_at', name: 'last_sign_in_at', field: 'last_sign_in_at', label: 'Último ingreso', sortable: false },
//   //{ key: 'sys_profile_name', name: 'sys_profile_name', field: 'sys_profile_name', label: 'sys_profile_name', sortable: false },
//   //{ key: 'is_active', name: 'is_active', field: 'is_active', label: 'Estado', sortable: false },
// ]