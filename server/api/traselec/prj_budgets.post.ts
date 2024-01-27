import sequelize from '@/server/utils/db_sql';
import { QueryTypes } from 'sequelize';
import { traselec_prj_master_budgets } from '@/typings/server/traselec'

export default defineEventHandler( async (event) => {
  try{
    const projectId = await readBody(event);
    const result = await sequelize.query(
      `WITH cte(Project_ID, Parent, levelCount, Code, Name, path) AS (
        select a.Project_ID, a.Parent, 1 as levelCount, a.Code, a.Name, cast(a.code as varchar(5000))
        from Prj_Master a
        where a.Parent = ${projectId ?? 0}
      UNION ALL
          select b.Project_ID, b.Parent, 1 + cte.levelCount
          ,b.Code
          ,b.Name
          ,cast(concat(COALESCE(cte.Code,'') ,' -> ', COALESCE(b.Code,'')) as varchar(5000))
          from Prj_Master b
          inner join cte on cte.Project_ID = b.Parent
      )
      select
       Project_ID as project_id
      ,Code as code
      ,Name as name
      ,path as path
      from cte
      where cte.levelCount = 1
      `, { type: QueryTypes.SELECT });

    return traselec_prj_master_budgets.array().parse(result);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});