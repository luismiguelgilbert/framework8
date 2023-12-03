import serverDB from '@/server/utils/db';
import { sys_links } from '@/typings/server/sys_links';

export default defineEventHandler( async (event) => {
  try{
    const text = `SELECT
     c.id
    ,c.parent
    ,c.position
    ,c.link
    ,c.name_es
    ,c.icon
    ,c.comment_es
    ,c.row_level
    ,to_char (c.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
    ,to_char (c.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
    FROM sys_links c
    order by 3
    `;
    let data = await serverDB.query(text);

    //Add path (root, level 1 and level 2)
    data.rows = data.rows.map(x => {
      let path = '';
      if (x.row_level === 0) { path = x.name_es }
      if (x.row_level === 1) { path = `${data.rows.find(p => p.id === x.parent)?.name_es} / ${x.name_es}` }
      if (x.row_level === 2) {
        const parent = data.rows.find(p => p.id === x.parent);
        const grandParent = data.rows.find(p => p.id === parent?.parent);
        path = `${grandParent?.name_es} / ${parent?.name_es} / ${x.name_es}`
      }
      return {
        ...x,
        path
      }
    })

    return sys_links.array().parse(data.rows);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});