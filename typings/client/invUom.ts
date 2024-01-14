import { z } from "zod"
import { inv_uom } from "@/typings/server/inv_uom";

export const uom_schema = z.object({
  isLoading: z.boolean().default(false),
  uomData: inv_uom,
});

export type type_uom_schema = z.infer<typeof uom_schema>;