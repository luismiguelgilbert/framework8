import serverDB from '@/server/utils/db';
import { sys_companies, status_options, sort_options } from '@/typings/server/sys_companies'
import type { filter_payload } from '@/typings/server/filter_payload'

export default defineEventHandler( async (event) => {
  try{
    const filter = await readBody(event) as filter_payload;
    const sortById = Number(filter.sortBy);
    const filterById = Number(filter.status);
    const page: number = Number(filter.page);
    const rowsPerPage: number = Number(filter.rowsPerPage);
    const search_string = filter.searchString!.trim();
    const offset: number = rowsPerPage * (page - 1);
    const sortBy: string = sort_options.find(x => x.value === sortById)?.sqlValue!;
    const filterBy: string = status_options.find(x => x.value === filterById)?.sqlValue!;

    const text = `
      SELECT 
          a.id
        , a.company_number
        , a.name_es
        , a.name_es_short
        , a.billing_phone
        , a.billing_address
        , a.is_active
        , to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
        , to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
        , count(*) OVER() AS row_count
      FROM sys_companies a
      WHERE 1 = 1
        and a.is_active = ${filterBy}
        ${search_string.trim().length > 0
          ? "and (a.company_number ILIKE '%" + search_string + "%' or a.name_es ILIKE '%" + search_string + "%' or a.name_es_short ILIKE '%" + search_string + "%')"
          : ""}
      ORDER BY ${sortBy}
      OFFSET ${offset}
      LIMIT ${rowsPerPage}
    `;
    const data = await serverDB.query(text);

    return sys_companies.array().parse(data.rows);
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});