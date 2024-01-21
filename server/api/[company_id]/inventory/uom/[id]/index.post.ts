import serverDB from '@/server/utils/db';
import { type type_uom_schema } from '@/typings/client/invUom';
import { PermissionsList } from '@/typings/client/permissionsEnum';

export default defineEventHandler( async (event) => {
  try{
    const payload: type_uom_schema = await readBody(event);
    const companyId = (event.context.params?.company_id);

    //Check Permissions
    const userId = event.context.user.id;
    const isUserAllowed = `select * 
      from sys_users a
      inner join sys_profiles_users b on a.id = b.user_id
      inner join sys_profiles c on c.id = b.sys_profile_id
      inner join sys_profiles_links d on d.sys_profile_id = c.id
      where a.id = '${userId}'
      and d.sys_link_id = '${PermissionsList.UOM_CREATE}'`;
    const isUserAllowedResult = (await serverDB.query(isUserAllowed)).rowCount;
    if (isUserAllowedResult === 0) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
      });
    }

    //MainData
    const name_es = payload.uomData.name_es ? `'${payload.uomData.name_es}'` : null;
    const name_es_short = payload.uomData.name_es_short ? `'${payload.uomData.name_es_short}'` : null;


    await serverDB.query('BEGIN');

    const sqlSysProfiles = `INSERT INTO inv_uom (sys_company_id, name_es, name_es_short, is_active, updated_by) 
    values ('${companyId}', ${name_es}, ${name_es_short}, ${payload.uomData.is_active}, '${userId}') 
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