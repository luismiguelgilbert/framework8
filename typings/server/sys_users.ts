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