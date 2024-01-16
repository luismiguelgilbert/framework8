import serverDB from '@/server/utils/db';
import { inv_types } from '@/typings/server/inv_types'

export default defineEventHandler( async (event) => {
  try{
    const companyId = String(event.context.params?.company_id ?? '');
    const userId = event.context.user.id;
    
    //Check Company Permissions
    const isUserCompanyAllowed = `select * from sys_companies_users a where a.sys_company_id = '${companyId}' and a.user_id = '${userId}'`;
    const isUserAllowedResult = (await serverDB.query(isUserCompanyAllowed)).rowCount;
    if (isUserAllowedResult === 0) { throw createError({ statusCode: 403, statusMessage: 'Forbidden' })};

    const text = `
      WITH RECURSIVE cte(sys_company_id, id, parent, name_es, is_active, created_at, updated_at) AS (
          SELECT a.sys_company_id, a.id, a.parent, a.name_es, a.is_active, a.created_at, a.updated_at
          FROM inv_types a
          WHERE a.sys_company_id = '${companyId}'
          and a.parent is null
        UNION ALL
          SELECT b.sys_company_id, b.id, b.parent
          ,concat(COALESCE(cte.name_es,'') ,' / ', COALESCE(b.name_es,''))
          ,b.is_active, b.created_at, b.updated_at
          from inv_types b
          inner join cte on cte.id = b.parent
          WHERE b.sys_company_id = '${companyId}'
      )
      SELECT 
        a.id
        ,a.name_es
        ,a.is_active
        ,count(*) OVER() AS row_count
      FROM cte a
      WHERE a.sys_company_id = '${companyId}'
      ORDER BY a.name_es
    `;
    const data = await serverDB.query(text);

    return inv_types.array().parse(data.rows);
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});