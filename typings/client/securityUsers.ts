import { z } from "zod"
import { sys_users } from "@/typings/server/sys_users";
import { sys_profiles } from "@/typings/server/sys_profiles";
import { sys_companies } from "@/typings/server/sys_companies";

export const sys_companies_array = z.array(sys_companies)
  .min(1, { message: "Debe seleccionar al menos 1 compañía." });

export const security_users_schema = z.object({
  isLoading: z.boolean().default(false),
  userData: sys_users,
  userCompanies: sys_companies_array,
  allProfiles: sys_profiles.array(),
  allCompanies: sys_companies.array(),
  // profileLinks: sys_links_array,
  // usersData: sys_users.array(),
});

export type type_security_users_schema = z.infer<typeof security_users_schema>;