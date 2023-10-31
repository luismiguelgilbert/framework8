import serverDB from '@/server/utils/db';
import Excel from 'exceljs';
import { sys_profiles, status_options, sort_options } from '@/typings/server/sys_profiles'
import type { filter_payload } from '@/typings/server/filter_payload'

export default defineEventHandler( async (event) => {
  try{
    const filter = await readBody(event) as filter_payload;
    const sortById = Number(filter.sortBy);
    const filterById = Number(filter.status);
    const search_string = filter.searchString!.trim();
    const sortBy: string = sort_options.find(x => x.value === sortById)?.sqlValue!;
    const filterBy: string = status_options.find(x => x.value === filterById)?.sqlValue!;

    const text = `WITH users_by_profile AS (
        select
        int1.sys_profile_id
        , count(int1.user_id) as user_count
        from sys_profiles_users int1
        group by int1.sys_profile_id
      )
      SELECT 
          a.id
        , a.name_es
        , a.is_active
        , COALESCE(b.user_count,0) as user_count
        , to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
        , to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
      FROM sys_profiles a
      LEFT JOIN users_by_profile b on a.id = b.sys_profile_id
      WHERE 1 = 1
        and a.is_active = ${filterBy}
        ${search_string.trim().length > 0 ? "and a.name_es ILIKE '%" + search_string + "%'" : ""}
      ORDER BY ${sortBy}
    `;
    const data = await serverDB.query(text);
    const workbook = new Excel.Workbook();
    const worksheet = await workbook.addWorksheet('Perfiles');
    const rolesColumns = [
      { key: 'id', header: 'Código' },
      { key: 'name_es', header: 'Perfil', width: 50 },
      { key: 'is_active', header: 'Activo?', width: 15 },
      { key: 'user_count', header: '# Usuarios', width: 15 },
      { key: 'created_at', header: 'Fecha_Creación', width: 25 },
      { key: 'updated_at', header: 'Fecha_Actualización', width: 25 },
    ];
    worksheet.columns = rolesColumns;
    worksheet.getRow(1).font = { size: 16, bold: true };
    worksheet.views = [{state: 'frozen', ySplit: 1}];
    console.log('starting to generate buffer');
    worksheet.addRows(sys_profiles.array().parse(data.rows));
    // await workbook.xlsx.writeFile('Perfiles.xlsx');
    console.log('buffer data generated');
    const filedata = workbook.xlsx.writeBuffer();
    console.log('buffer data generated 2');
    return filedata;
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});