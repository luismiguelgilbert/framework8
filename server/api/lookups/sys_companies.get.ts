import serverDB from '@/server/utils/db';
import { sys_companies } from '@/typings/server/sys_companies';

export default defineEventHandler( async (event) => {
  try{
    const text = `SELECT
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
    order by 3
    `;
    let data = await serverDB.query(text);

    return sys_companies.array().parse(data.rows);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});