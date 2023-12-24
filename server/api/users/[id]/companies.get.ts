import serverDB from '@/server/utils/db';
import { sys_companies } from '@/typings/server/sys_companies';

export default defineEventHandler( async (event) => {
  try{
    const id = (event.context.params?.id);
    const text = `SELECT
      b.id
      , b.company_number
      , b.name_es
      , b.name_es_short
      , b.billing_phone
      , b.billing_address
      , b.is_active
      , to_char (b.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      , to_char (b.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
      ,1 as row_count
      FROM sys_companies_users a
      INNER JOIN sys_companies b on a.sys_company_id = b.id
      WHERE a.user_id = $1
    `;
    const values = [id];
    const data = await serverDB.query(text, values);

    return sys_companies.array().parse(data.rows);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});