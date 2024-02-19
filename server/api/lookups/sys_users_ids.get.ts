import serverDB from '@/server/utils/db';
import { sys_users_ids } from '@/typings/server/sys_users_ids';
export default defineEventHandler( async (event) => {
  try{
    const text = `SELECT
     a.id
    ,a.email
    from auth.users a
    inner join sys_users b on a.id = b.id
    order by a.email
    `;
    let data = await serverDB.query(text);

    return sys_users_ids.array().parse(data.rows);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});