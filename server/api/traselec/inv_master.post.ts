import SqlConnection from '@/server/utils/db_sql';
import { traselec, status_options, sort_options } from '@/typings/server/traselec'
import type { filter_payload } from '@/typings/server/filter_payload'

export default defineEventHandler( async (event) => {
  try{
    const filter = await readBody(event) as filter_payload;
    const sortById = Number(filter.sortBy);
    const filterById = Number(filter.status);
    const page: number = Number(filter.page);
    const rowsPerPage: number = Number(filter.rowsPerPage);
    const search_string = filter.searchString!.trim();
    const offset: number = rowsPerPage * (page - 1);
    const sortBy: string = sort_options.find(x => x.value === sortById)?.sqlValue!;
    const filterBy: string = status_options.find(x => x.value === filterById)?.sqlValue!;

    const result = await SqlConnection.connection.request().query(`
      select 
      a.Inventory_ID as id
      ,b.name
      ,a.internal_code
      ,a.estado as is_active
      ,count(*) OVER() AS row_count
      from Inv_Master A
      inner join Inv_Master_Names b on a.Inventory_ID = b.Inventory_ID
      where Company_ID = 1
      and a.estado = ${filterBy}
      ${search_string.trim().length > 0 ? "and b.name LIKE '%" + search_string + "%'" : ""}
      ORDER BY ${sortBy}
      OFFSET ${offset} ROWS
      FETCH NEXT ${rowsPerPage} ROWS ONLY
    `);

    return traselec.array().parse(result.recordset);

  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});