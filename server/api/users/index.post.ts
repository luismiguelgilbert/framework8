import serverDB from '@/server/utils/db';
import { sys_users } from '@/typings/server/sys_users'

export default defineEventHandler( async (event) => {
  try {
    const filter = await readBody(event);
    const status: boolean[] = filter.status.length === 0 ? [true, false] : filter.status;
    const sortColumnValues = [
      { label: 'Ordenar por Nombres', column: 'b.user_name', value: 1 },
      { label: 'Ordenar por Apellidos', column: 'b.user_lastname', value: 2 },
      { label: 'Ordenar por Mail', column: 'a.email', value: 3 },
      { label: 'Ordenar por Perfil', column: 'd.name_es', value: 4 }
    ];
    const sortById = Number(filter.sortBy);
    const sortBy: string = sortColumnValues.find(x => x.value === sortById)?.column || 'b.user_lastname';
    const offset: number = filter.rowsPerPage * (filter.page - 1);
    const rowsPerPage: number = filter.rowsPerPage;
    const search_string: string = filter.searchString || null;

    const text = `select
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
      and (to_tsvector(coalesce(b.user_name,'')) @@ to_tsquery($1) OR $1 IS NULL)
      ORDER BY ${sortBy}
      OFFSET ${offset}
      LIMIT ${rowsPerPage}
    ;`;

    // WHERE 1 = 1
    // and a.is_active = ANY($1::boolean[])
    
    const values = [
      // status,
      search_string,
    ];
    const data = await serverDB.query(text, values);

    return sys_users.array().parse(data.rows);
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });

  }
});