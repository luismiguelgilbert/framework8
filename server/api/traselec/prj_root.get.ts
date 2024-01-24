import sequelize from '@/server/utils/db_sql';
import { QueryTypes } from 'sequelize';
import { traselec_prj_master } from '@/typings/server/traselec'

export default defineEventHandler( async (event) => {
  try{
    const result = await sequelize.query(
      `select
        a.project_id
      ,a.name as project_name
      ,case when len(c.partner_name2) > 1 then c.partner_name2 else c.partner_name end partner_name
      ,a.code
      ,a.comments
      from prj_master a
      inner join partner_master b on a.partner_id = b.partner_id
      inner join partner_master_names c on b.partner_id = c.partner_id
      where a.company_id = 1
      and a.parent is null
      and a.prj_master_status = 1
      order by a.name
      `, { type: QueryTypes.SELECT });

    return traselec_prj_master.array().parse(result);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});