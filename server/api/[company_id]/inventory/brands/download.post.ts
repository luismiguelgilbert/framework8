import serverDB from '@/server/utils/db';
import Excel from 'exceljs';
import { inv_brands, status_options, sort_options } from '@/typings/server/inv_brands'
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
      SELECT 
        a.id
        ,a.name_es
        ,a.is_active
        ,to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
        ,to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
        ,count(*) OVER() AS row_count
      FROM inv_brands a
      WHERE a.sys_company_id = '${companyId}'
        and a.is_active = ${filterBy}
        ${search_string.trim().length > 0 
          ? "and (a.name_es ILIKE '%" + search_string + "%' or a.name_es_short ILIKE '%" + search_string + "%')"
          : ""}
      ORDER BY ${sortBy}
    `;
    const data = await serverDB.query(text);
    const workbook = new Excel.Workbook();
    const worksheet = await workbook.addWorksheet('Marcas');
    const rolesColumns = [
      { key: 'id', header: 'Código', width: 50 },
      { key: 'name_es', header: 'Marca', width: 30 },
      { key: 'is_active', header: 'Activo?', width: 15 },
      { key: 'created_at', header: 'Fecha_Creación', width: 25 },
      { key: 'updated_at', header: 'Fecha_Actualización', width: 25 },
    ];
    worksheet.columns = rolesColumns;
    worksheet.getRow(1).font = { size: 16, bold: true };
    worksheet.views = [{state: 'frozen', ySplit: 1}];
    worksheet.addRows(inv_brands.array().parse(data.rows));
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