import { z } from "zod"

export const sys_users_ids = z.object({
  id: z.coerce.string(),
  user_name: z.coerce.string()
    .min(3, { message: "Nombres del Usuario debe incluir 3 o más caracteres." }),
  user_lastname: z.coerce.string()
    .min(3, { message: "Apellidos del Usuario debe incluir 3 o más caracteres." }),
  website: z.coerce.string().optional().nullable(),
  email: z.coerce.string()
    .email({ message: "Email debe ser válido." })
    .default('my@domain.com'),
});
export type type_sys_users_ids = z.infer<typeof sys_users_ids>;