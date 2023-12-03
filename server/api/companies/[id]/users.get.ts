import serverDB from '@/server/utils/db';
import { sys_users } from '@/typings/server/sys_users';

export default defineEventHandler( async (event) => {
  try{
    const id = (event.context.params?.id);
    const text = `SELECT
      c.id
      ,d.user_name
      ,d.user_lastname
      ,d.avatar_url
      ,d.website
      ,c.email
      ,b.sys_company_id
      ,a.name_es as sys_company_name
      ,d.dark_enabled
      ,d.default_color
      ,to_char (c.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      ,to_char (c.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
      ,to_char (c.last_sign_in_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as last_sign_in_at
      ,1 as row_count
      FROM sys_companies a
      INNER JOIN sys_companies_users b on a.id = b.sys_company_id
      INNER JOIN auth.users c on b.user_id = c.id
      INNER JOIN sys_users d on c.id = d.id
      WHERE a.id = $1
    `;
    const values = [id];
    const data = await serverDB.query(text, values);

    return sys_users.array().parse(data.rows);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});