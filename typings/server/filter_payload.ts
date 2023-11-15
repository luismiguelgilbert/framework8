import { z } from "zod"

export enum filter_keys_enum {
  PAGE = "page",
  ROWS = "rowsPerPage",
  SEARCH = "searchString",
  SORT = "sortBy",
  STATUS = "status",
  ID = "id",
}

export type filter_payload = Partial<Record<filter_keys_enum, string>>;

export const filter_payload_object = z.object({
  [filter_keys_enum.PAGE] : z.coerce.string().default('1'),
  [filter_keys_enum.ROWS]: z.coerce.string().default('10'),
  [filter_keys_enum.SEARCH]: z.coerce.string().default(''),
  [filter_keys_enum.SORT]: z.coerce.string().default('1'),
  [filter_keys_enum.STATUS]: z.coerce.string().default('1'),
  [filter_keys_enum.ID]: z.coerce.string(),
});