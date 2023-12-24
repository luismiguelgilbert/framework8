import serverDB from '@/server/utils/db';
import { type type_security_companies_schema } from '@/typings/client/securityCompanies';
import { PermissionsList } from '@/typings/client/permissionsEnum';
export default defineEventHandler( async (event) => {
  try{
    const payload: type_security_companies_schema = await readBody(event);
    const id = (event.context.params?.id);
    const company_data = payload.companyData;

    //Check Permissions
    const userId = event.context.user.id;
    const isUserAllowed = `select * 
      from sys_users a
      inner join sys_profiles_users b on a.id = b.user_id
      inner join sys_profiles c on c.id = b.sys_profile_id
      inner join sys_profiles_links d on d.sys_profile_id = c.id
      where a.id = '${userId}'
      and d.sys_link_id = ${PermissionsList.COMPANIES_EDIT}`;
    const isUserAllowedResult = (await serverDB.query(isUserAllowed)).rowCount;
    if (isUserAllowedResult === 0) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
      });
    }

    //Process
    await serverDB.query('BEGIN');
    const sqlSysProfiles = `update sys_companies set
       company_number = '${company_data.company_number}'
      ,name_es = '${company_data.name_es}'
      ,name_es_short = '${company_data.name_es_short}'
      ,billing_phone = '${company_data.billing_phone}'
      ,billing_address = '${company_data.billing_address}'
      ,is_active = ${company_data.is_active}
      ,updated_at = now()
      WHERE id = '${id}'`;
    await serverDB.query(sqlSysProfiles);
    
    await serverDB.query('COMMIT');
    return { message: `Compañía ${id} actualizada correctamente` };
  }catch(err) {
    await serverDB.query('ROLLBACK');
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: `${err ?? 'Unhandled exception'}`,
    });
  }
});