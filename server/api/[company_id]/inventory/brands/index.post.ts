import serverDB from '@/server/utils/db';
import { inv_brands, status_options, sort_options } from '@/typings/server/inv_brands'
import type { filter_payload } from '@/typings/server/filter_payload'

export default defineEventHandler( async (event) => {
  try{
    const companyId = String(event.context.params?.company_id ?? '');
    const userId = event.context.user.id;
    //Payload
    const filter: filter_payload = await readBody(event);
    const sortById = Number(filter.sortBy);
    const filterById = Number(filter.status);
    const page: number = Number(filter.page);
    const rowsPerPage: number = Number(filter.rowsPerPage);
    const search_string = filter.searchString!.trim();
    const offset: number = rowsPerPage * (page - 1);
    const sortBy: string = sort_options.find(x => x.value === sortById)?.sqlValue!;
    const filterBy: string = status_options.find(x => x.value === filterById)?.sqlValue!;

    //Check Company Permissions
    const isUserCompanyAllowed = `select * from sys_companies_users a where a.sys_company_id = '${companyId}' and a.user_id = '${userId}'`;
    const isUserAllowedResult = (await serverDB.query(isUserCompanyAllowed)).rowCount;
    if (isUserAllowedResult === 0) { throw createError({ statusCode: 403, statusMessage: 'Forbidden' })};

    const text = `
      SELECT 
        a.id
        ,a.name_es
        ,a.is_active
        ,to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
        ,to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
        ,count(*) OVER() AS row_count
      FROM inv_brands a
      WHERE 1 = 1
        and a.is_active = ${filterBy}
        ${search_string.trim().length > 0 
          ? "and (a.name_es ILIKE '%" + search_string + "%')"
          : ""}
      ORDER BY ${sortBy}
      OFFSET ${offset}
      LIMIT ${rowsPerPage}
    `;
    const data = await serverDB.query(text);

    return inv_brands.array().parse(data.rows);
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});