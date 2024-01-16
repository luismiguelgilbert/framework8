import { z } from "zod"
import { inv_types } from "@/typings/server/inv_types";

export const invTypes_schema = z.object({
  isLoading: z.boolean().default(false),
  invTypeData: inv_types,
  allTypes: z.array(inv_types).default([]),
});

export type type_invTypes_schema = z.infer<typeof invTypes_schema>;