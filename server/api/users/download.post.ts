import serverDB from '@/server/utils/db';
import Excel from 'exceljs';
import { sys_users, status_options, sort_options } from '@/typings/server/sys_users'
import type { filter_payload } from '@/typings/server/filter_payload'

export default defineEventHandler( async (event) => {
  try{
    const filter = await readBody(event) as filter_payload;
    const sortById = Number(filter.sortBy);
    const filterById = Number(filter.status);
    const search_string = filter.searchString!.trim();
    const sortBy: string = sort_options.find(x => x.value === sortById)?.sqlValue!;

    const text = `
      select
        a.id,
        b.user_name,
        b.user_lastname,
        b.avatar_url,
        b.website,
        a.email,
        c.sys_profile_id,
        d.name_es as sys_profile_name,
        to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at,
        to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at,
        to_char (a.last_sign_in_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as last_sign_in_at,
        count(*) OVER() AS row_count
        from auth.users a
        left join sys_users b on a.id = b.id
        left join sys_profiles_users c on c.user_id = a.id
        left join sys_profiles d on c.sys_profile_id = d.id
      WHERE 1 = 1
        ${search_string.trim().length > 0 
          ? "and (b.user_name ILIKE '%" + search_string + "%' or b.user_lastname ILIKE '%" + search_string + "%' or a.email ILIKE '%" + search_string + "%')"
          : ""}
      ORDER BY ${sortBy}
    `;
    const data = await serverDB.query(text);
    const workbook = new Excel.Workbook();
    const worksheet = await workbook.addWorksheet('Usuarios');
    const fileColumns = [
      { key: 'id', header: 'Código', width: 50  },
      { key: 'user_name', header: 'Nombres', width: 25 },
      { key: 'user_lastname', header: 'Apellidos', width: 25 },
      { key: 'email', header: 'email', width: 35 },
      { key: 'sys_profile_name', header: 'Perfil', width: 25 },
      { key: 'last_sign_in_at', header: 'Último_Ingreso', width: 25 },
      { key: 'created_at', header: 'Fecha_Creación', width: 25 },
      { key: 'updated_at', header: 'Fecha_Actualización', width: 25 },
    ];
    worksheet.columns = fileColumns;
    worksheet.getRow(1).font = { size: 16, bold: true };
    worksheet.views = [{state: 'frozen', ySplit: 1}];
    worksheet.addRows(sys_users.array().parse(data.rows));
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