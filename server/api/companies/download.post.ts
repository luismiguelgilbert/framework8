import serverDB from '@/server/utils/db';
import Excel from 'exceljs';
import { sys_companies, status_options, sort_options } from '@/typings/server/sys_companies'
import type { filter_payload } from '@/typings/server/filter_payload'

export default defineEventHandler( async (event) => {
  try{
    const filter = await readBody(event) as filter_payload;
    const sortById = Number(filter.sortBy);
    const filterById = Number(filter.status);
    const search_string = filter.searchString!.trim();
    const sortBy: string = sort_options.find(x => x.value === sortById)?.sqlValue!;
    const filterBy: string = status_options.find(x => x.value === filterById)?.sqlValue!;

    const text = `SELECT
          a.id
        , a.company_number
        , a.name_es
        , a.name_es_short
        , a.billing_phone
        , a.billing_address
        , a.is_active
        , to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
        , to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
      FROM sys_companies a
      WHERE 1 = 1
        and a.is_active = ${filterBy}
        ${search_string.trim().length > 0
          ? "and (a.company_number ILIKE '%" + search_string + "%' or a.name_es ILIKE '%" + search_string + "%' or a.name_es_short ILIKE '%" + search_string + "%')"
          : ""}
      ORDER BY ${sortBy}
    `;
    const data = await serverDB.query(text);
    const workbook = new Excel.Workbook();
    const worksheet = await workbook.addWorksheet('Perfiles');
    const rolesColumns = [
      { key: 'id', header: 'Código' },
      { key: 'company_number', header: 'RUC', width: 50 },
      { key: 'name_es_short', header: 'Nombre', width: 50 },
      { key: 'name_es', header: 'Razón Social', width: 50 },
      { key: 'billing_phone', header: 'Teléfono', width: 50 },
      { key: 'billing_address', header: 'Dirección', width: 50 },
      { key: 'is_active', header: 'Activo?', width: 15 },
      { key: 'created_at', header: 'Fecha_Creación', width: 25 },
      { key: 'updated_at', header: 'Fecha_Actualización', width: 25 },
    ];
    worksheet.columns = rolesColumns;
    worksheet.getRow(1).font = { size: 16, bold: true };
    worksheet.views = [{state: 'frozen', ySplit: 1}];
    worksheet.addRows(sys_companies.array().parse(data.rows));
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