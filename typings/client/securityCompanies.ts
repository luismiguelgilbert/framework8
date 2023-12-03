import { ZodObject, z } from "zod"
import { sys_companies, type type_sys_companies } from "@/typings/server/sys_companies";
import { sys_users } from "@/typings/server/sys_users";

export const security_companies_schema = z.object({
  id: z.string().optional().nullable(),
  isLoading: z.boolean().default(false),
  companyData: sys_companies,
  usersData: sys_users.array(),
});

export type type_security_companies_schema = z.infer<typeof security_companies_schema>;