import { z } from "zod"
import { inv_brands } from "@/typings/server/inv_brands";

export const brands_schema = z.object({
  isLoading: z.boolean().default(false),
  brandData: inv_brands,
});

export type type_brands_schema = z.infer<typeof brands_schema>;