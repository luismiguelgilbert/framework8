import serverDB from '@/server/utils/db';
import { sys_profiles } from '@/typings/server/sys_profiles'

export default defineEventHandler( async (event) => {
  try{
    const id = (event.context.params?.id);
    const text = `SELECT 
       a.id
      ,a.name_es
      ,a.is_active
      ,to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      ,to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
      ,0 as user_count
      ,1 AS row_count
      FROM sys_profiles a
      WHERE a.id = $1
    `;
    const values = [id];
    const data = await serverDB.query(text, values);

    return sys_profiles.array().parse(data.rows)[0];
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });

  }
});