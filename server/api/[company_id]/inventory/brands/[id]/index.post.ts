import serverDB from '@/server/utils/db';
import { type type_brands_schema } from '@/typings/client/invBrands';
import { PermissionsList } from '@/typings/client/permissionsEnum';

export default defineEventHandler( async (event) => {
  try{
    const payload: type_brands_schema = await readBody(event);
    const companyId = (event.context.params?.company_id);

    //Check Permissions
    const userId = event.context.user.id;
    const isUserAllowed = `select * 
      from sys_users a
      inner join sys_profiles_users b on a.id = b.user_id
      inner join sys_profiles c on c.id = b.sys_profile_id
      inner join sys_profiles_links d on d.sys_profile_id = c.id
      where a.id = '${userId}'
      and d.sys_link_id = '${PermissionsList.BRANDS_CREATE}'`;
    const isUserAllowedResult = (await serverDB.query(isUserAllowed)).rowCount;
    if (isUserAllowedResult === 0) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
      });
    }

    //MainData
    const name_es = payload.brandData.name_es ? `'${payload.brandData.name_es}'` : null;


    await serverDB.query('BEGIN');

    const sqlSysProfiles = `INSERT INTO inv_brands (sys_company_id, name_es, is_active, updated_by) 
    values ('${companyId}', ${name_es}, ${payload.brandData.is_active}, '${userId}') 
    RETURNING id`;
    const { rows } = await serverDB.query(sqlSysProfiles);
    const id = rows[0].id;

    await serverDB.query('COMMIT');
    return { id };
  }catch(err) {
    await serverDB.query('ROLLBACK');
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: `${err ?? 'Unhandled exception'}`,
    });
  }
});