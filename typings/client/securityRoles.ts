import { z } from "zod"
import { sys_profiles } from "@/typings/server/sys_profiles";
import { sys_users } from "@/typings/server/sys_users";
import { sys_links } from "@/typings/server/sys_links";

export const sys_links_array = z.array(sys_links).min(1);

export const security_roles_schema = z.object({
  isLoading: z.boolean().default(false),
  profileData: sys_profiles,
  profileLinks: sys_links_array,
  usersData: sys_users.array(),
  allLinks: sys_links.array(),
});

export type type_security_roles_schema = z.infer<typeof security_roles_schema>;