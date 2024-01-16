import serverDB from '@/server/utils/db';
import { inv_types } from '@/typings/server/inv_types'

export default defineEventHandler( async (event) => {
  try{
    const companyId = (event.context.params?.company_id);
    const id = (event.context.params?.id);
    const text = `SELECT
      a.id,
      a.parent,
      a.name_es,
      a.is_active,
      to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at,
      to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at,
      count(*) OVER() AS row_count
      from inv_types a
      WHERE a.sys_company_id = $1 and a.id = $2
    `;
    const values = [companyId, id];
    const data = await serverDB.query(text, values);

    return inv_types.array().parse(data.rows)[0];
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });

  }
});