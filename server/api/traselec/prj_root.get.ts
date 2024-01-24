// import SqlConnection  from '@/server/utils/db_sql';
import { sqlPool }  from '@/server/utils/db_sql';
import { traselec_prj_master } from '@/typings/server/traselec'
// import { traselec_prj_master, status_options, sort_options } from '@/typings/server/traselec'
// import type { filter_payload } from '@/typings/server/filter_payload'

export default defineEventHandler( async (event) => {
  try{
    // const filter = await readBody(event) as filter_payload;
    // const sortById = Number(filter.sortBy);
    // const filterById = Number(filter.status);
    // const page: number = Number(filter.page);
    // const rowsPerPage: number = Number(filter.rowsPerPage);
    // const search_string = filter.searchString!.trim();
    // const offset: number = rowsPerPage * (page - 1);
    // const sortBy: string = sort_options.find(x => x.value === sortById)?.sqlValue!;
    // const filterBy: string = status_options.find(x => x.value === filterById)?.sqlValue!;
    //,CONCAT(c.partner_name, ' (',c.partner_name,')') as partner_name

    // const result = await SqlConnection.connection.request().query(`
    const conn = await sqlPool();
    console.log('conexion', conn);
    
    const result = await conn?.pool?.request().query(`
      select 
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
    `);

    return traselec_prj_master.array().parse(result?.recordset);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});