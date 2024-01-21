import serverDB from '@/server/utils/db';
import { sys_links } from '@/typings/server/sys_links';

export default defineEventHandler( async (event) => {
  try{
    const text = `
    WITH RECURSIVE cte(id, parent, name_es, position, row_level, icon, link, comment_es, created_at, updated_at, requires_company, path) AS (
      SELECT a.id, a.parent, a.name_es, a.position, a.row_level, a.icon, a.link, a.comment_es, a.created_at, a.updated_at, a.requires_company, a.name_es
      FROM sys_links a
      where a.parent is null
    UNION ALL
      SELECT b.id, b.parent, b.name_es, b.position, b.row_level, b.icon, b.link, b.comment_es, b.created_at, b.updated_at, b.requires_company
      ,concat(COALESCE(cte.path,'') ,' -> ', COALESCE(b.name_es,''))
      from sys_links b
      inner join cte on cte.id = b.parent
    )
    SELECT 
    a.id
    ,a.parent
    ,a.position
    ,a.link
    ,a.name_es
    ,a.icon
    ,a.comment_es
    ,a.row_level
    ,a.created_at
    ,a.updated_at
    ,a.requires_company
    ,a.path
    FROM cte a
    order by cast(a.id as varchar)
    `;
    let data = await serverDB.query(text);

    return sys_links.array().parse(data.rows);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});