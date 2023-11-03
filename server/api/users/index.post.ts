import serverDB from '@/server/utils/db';
import { sys_users, status_options, sort_options } from '@/typings/server/sys_users'
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
      select
      a.id,
      b.user_name,
      b.user_lastname,
      b.avatar_url,
      b.website,
      a.email,
      c.sys_profile_id,
      d.name_es as sys_profile_name,
      to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at,
      to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at,
      to_char (a.last_sign_in_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as last_sign_in_at,
      count(*) OVER() AS row_count
      from auth.users a
      left join sys_users b on a.id = b.id
      left join sys_profiles_users c on c.user_id = a.id
      left join sys_profiles d on c.sys_profile_id = d.id
      WHERE 1 = 1
        ${search_string.trim().length > 0 
          ? "and (b.user_name ILIKE '%" + search_string + "%' or b.user_lastname ILIKE '%" + search_string + "%' or a.email ILIKE '%" + search_string + "%')"
          : ""}
      ORDER BY ${sortBy}
      OFFSET ${offset}
      LIMIT ${rowsPerPage}
    `;
    const data = await serverDB.query(text);

    return sys_users.array().parse(data.rows);
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});