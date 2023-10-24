import serverDB from '@/server/utils/db';
import { sys_links } from '@/typings/server/sys_links';

export default defineEventHandler( async (event) => {
  try{
    const id = (event.context.params?.id);
    const text = `SELECT
     c.id
    ,c.parent
    ,c.position
    ,c.link
    ,c.name_es
    ,c.icon
    ,c.comment_es
    ,to_char (c.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
    ,to_char (c.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
    FROM sys_profiles a
    INNER JOIN sys_profiles_links b on a.id = b.sys_profile_id
    INNER JOIN sys_links c on b.sys_link_id = c.id
    WHERE a.id = $1
    `;
    const values = [id];
    const data = await serverDB.query(text, values);

    return sys_links.array().parse(data.rows);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});