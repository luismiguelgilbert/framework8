import serverDB from '@/server/utils/db';
import { sys_profiles, status_options, sort_options } from '@/typings/server/sys_profiles'
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

    const text = `WITH users_by_profile AS (
        select
        int1.sys_profile_id
        , count(int1.user_id) as user_count
        from sys_profiles_users int1
        group by int1.sys_profile_id
      )
      SELECT 
          a.id
        , a.name_es
        , a.is_active
        , to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
        , COALESCE(b.user_count,0) as user_count
        ,count(*) OVER() AS row_count
      FROM sys_profiles a
      LEFT JOIN users_by_profile b on a.id = b.sys_profile_id
      WHERE 1 = 1
        and a.is_active = ${filterBy}
        ${search_string.trim().length > 0 ? "and a.name_es ILIKE '%" + search_string + "%'" : ""}
      ORDER BY ${sortBy}
      OFFSET ${offset}
      LIMIT ${rowsPerPage}
    `;
    const data = await serverDB.query(text);

    return sys_profiles.array().parse(data.rows);
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});