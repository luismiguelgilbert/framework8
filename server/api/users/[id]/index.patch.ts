import serverDB from '@/server/utils/db';
import type { type_security_users_schema } from "@/typings/client/securityUsers";
import { PermissionsList } from '@/typings/client/permissionsEnum';

export default defineEventHandler( async (event) => {
  try{
    const payload: type_security_users_schema = await readBody(event);
    const id = (event.context.params?.id);
    const userCompanies = payload.userCompanies;

    //Check Permissions
    const userId = event.context.user.id;
    const isUserAllowed = `select * 
      from sys_users a
      inner join sys_profiles_users b on a.id = b.user_id
      inner join sys_profiles c on c.id = b.sys_profile_id
      inner join sys_profiles_links d on d.sys_profile_id = c.id
      where a.id = '${userId}'
      and d.sys_link_id = ${PermissionsList.USERS_EDIT}`;
    const isUserAllowedResult = (await serverDB.query(isUserAllowed)).rowCount;
    if (isUserAllowedResult === 0) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
      });
    }

    //UserData
    const user_name = payload.userData.user_name ? `'${payload.userData.user_name}'` : null;
    const user_lastname = payload.userData.user_lastname ? `'${payload.userData.user_lastname}'` : null;
    const avatar_url = payload.userData.avatar_url ? `'${payload.userData.avatar_url}'` : null;
    const website = payload.userData.website ? `'${payload.userData.website}'` : null;
    const sys_profile_id = payload.userData.sys_profile_id ? `${payload.userData.sys_profile_id}` : null;

    //Process
    await serverDB.query('BEGIN');
    
    let sqlUpdateUserData = `update sys_users set
       user_name = COALESCE(${user_name}, user_name)
      ,user_lastname = COALESCE(${user_lastname}, user_lastname)
      ,avatar_url = COALESCE(${avatar_url}, avatar_url)
      ,website = COALESCE(${website}, website)
      ,updated_at = now()
      ,updated_by = '${userId}'
      WHERE id = '${id}'`;
    await serverDB.query(sqlUpdateUserData);

    //Update Profiles
    const sqlProfilesDelete = `delete from sys_profiles_users WHERE user_id = '${id}'`;
    await serverDB.query(sqlProfilesDelete);

    let sqlProfileInsert = `insert into sys_profiles_users (sys_profile_id, user_id) values (${sys_profile_id}, '${id}')`;
    await serverDB.query(sqlProfileInsert);
    
    //Update Companies
    const sqlSysCompaniesDelete = `delete from sys_companies_users WHERE user_id = '${id}'`;
    await serverDB.query(sqlSysCompaniesDelete);

    let sqlCompaniesInsert = `insert into sys_companies_users (sys_company_id, user_id) values `;
    userCompanies.forEach((company) => {
      sqlCompaniesInsert += `('${company.id}', '${id}'),`;
    });
    sqlCompaniesInsert = sqlCompaniesInsert.replace(/\,$/, '');
    await serverDB.query(sqlCompaniesInsert);
    
    await serverDB.query('COMMIT');
    return { message: `Usuario ${id} actualizado correctamente` };
  }catch(err) {
    await serverDB.query('ROLLBACK');
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: `${err ?? 'Unhandled exception'}`,
    });
  }
});