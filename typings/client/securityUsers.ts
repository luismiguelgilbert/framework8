import { z } from "zod"
// import { sys_profiles } from "@/typings/server/sys_profiles";
import { sys_users } from "@/typings/server/sys_users";
// import { sys_links } from "@/typings/server/sys_links";

// export const sys_links_array = z.array(sys_links)
//   .min(1, { message: "Debe seleccionar al menos 1 permiso." });

export const security_users_schema = z.object({
  isLoading: z.boolean().default(false),
  userData: sys_users,
  // profileLinks: sys_links_array,
  // usersData: sys_users.array(),
  // allLinks: sys_links.array(),
});

export type type_security_users_schema = z.infer<typeof security_users_schema>;