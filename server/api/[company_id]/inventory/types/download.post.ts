import serverDB from '@/server/utils/db';
import Excel from 'exceljs';
import { inv_types, status_options, sort_options } from '@/typings/server/inv_types'
import type { filter_payload } from '@/typings/server/filter_payload'

export default defineEventHandler( async (event) => {
  try{
    const companyId = String(event.context.params?.company_id ?? '');
    const filter = await readBody(event) as filter_payload;
    const sortById = Number(filter.sortBy);
    const filterById = Number(filter.status);
    const search_string = filter.searchString!.trim();
    const sortBy: string = sort_options.find(x => x.value === sortById)?.sqlValue!;
    const filterBy: string = status_options.find(x => x.value === filterById)?.sqlValue!;

    const text = `
      WITH RECURSIVE cte(sys_company_id, id, parent, name_es, is_active, created_at, updated_at) AS (
        SELECT a.sys_company_id, a.id, a.parent, a.name_es, a.is_active, a.created_at, a.updated_at
        FROM inv_types a
        WHERE a.sys_company_id = '${companyId}'
        and a.parent is null
      UNION ALL
        SELECT b.sys_company_id, b.id, b.parent
        ,concat(COALESCE(cte.name_es,'') ,' > ', COALESCE(b.name_es,''))
        ,b.is_active, b.created_at, b.updated_at
        from inv_types b
        inner join cte on cte.id = b.parent
        WHERE b.sys_company_id = '${companyId}'
      )
      SELECT 
        a.id
        ,a.name_es
        ,a.is_active
        ,to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
        ,to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
        ,count(*) OVER() AS row_count
      FROM cte a
      WHERE a.sys_company_id = '${companyId}'
        and a.is_active = ${filterBy}
        ${search_string.trim().length > 0 
          ? "and (a.name_es ILIKE '%" + search_string + "%')"
          : ""}
      ORDER BY ${sortBy}
    `;
    const data = await serverDB.query(text);
    const workbook = new Excel.Workbook();
    const worksheet = await workbook.addWorksheet('Tipos');
    const rolesColumns = [
      { key: 'id', header: 'Código', width: 50 },
      { key: 'name_es', header: 'Tipo', width: 30 },
      { key: 'is_active', header: 'Activo?', width: 15 },
      { key: 'created_at', header: 'Fecha_Creación', width: 25 },
      { key: 'updated_at', header: 'Fecha_Actualización', width: 25 },
    ];
    worksheet.columns = rolesColumns;
    worksheet.getRow(1).font = { size: 16, bold: true };
    worksheet.views = [{state: 'frozen', ySplit: 1}];
    worksheet.addRows(inv_types.array().parse(data.rows));
    const filedata = workbook.xlsx.writeBuffer();
    return filedata;
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});