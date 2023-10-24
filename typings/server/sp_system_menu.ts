import { z } from "zod"

export const sp_system_menu = z.object({
  id: z.coerce.number().nullable(),
  parent: z.coerce.number().nullable(),
  position_num: z.number(),
  link: z.string().nullable(),
  name_es: z.string(),
  icon: z.string().nullable(),
  comment_es: z.string().nullable(),
});
export type type_sp_system_menu = z.infer<typeof sp_system_menu>;