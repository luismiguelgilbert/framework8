import sequelize from '@/server/utils/db_sql';
import { QueryTypes } from 'sequelize';
import { traselec_prj_master_budgets } from '@/typings/server/traselec'

export default defineEventHandler( async (event) => {
  try{
    const budgetId = await readBody(event);
    const result = await sequelize.query(
      `WITH cte(Project_ID, Parent, levelCount, Code, Name, path) AS (
        select a.Project_ID, a.Parent, 1 as levelCount, a.Code, a.Name, cast(a.code as varchar(5000))
        from Prj_Master a
        where a.Parent = ${budgetId ?? 0}
      UNION ALL
        select b.Project_ID, b.Parent, 1 + cte.levelCount
        ,b.Code
        ,b.Name
        ,cast(concat(COALESCE(cte.Code,'') ,' -> ', COALESCE(b.Code,'')) as varchar(5000))
        from Prj_Master b
        inner join cte on cte.Project_ID = b.Parent
      )
      select 
      inv.Inventory_ID as inv_id
      ,Inv_Master.Internal_Code as inv_code
      ,invNames.Name as inv_name
      ,sum(inv.Quantity) as inv_budget_qty
      ,invUomNames.Name as inv_uom_name
      ,case 
          when sum(inv.Quantity) = 0 then 0
          else ABS(CHECKSUM(NewId())) % (COALESCE(sum(inv.Quantity),1))
      end inv_real_qty
      from cte
      left join Prj_Master_Inventory inv on cte.Project_ID = inv.Project_ID
      left join Inv_Master on inv.Inventory_ID = Inv_Master.Inventory_ID
      left join Inv_Master_Names invNames on Inv_Master.Inventory_ID = invNames.Inventory_ID and invNames.Language_ID = 'spanish'
      left join Inv_UoM_Names invUomNames on Inv_Master.UoM_ID = invUomNames.UoM_ID and invUomNames.Language_ID = 'spanish'
      where inv.Inventory_ID is not null
      group by
      inv.Inventory_ID
      ,Inv_Master.Internal_Code
      ,invNames.Name
      ,invUomNames.Name
      order by invNames.Name
      `, { type: QueryTypes.SELECT });

    // return traselec_prj_master_budgets.array().parse(result);
    return result;
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});