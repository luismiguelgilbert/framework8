import serverDB from '@/server/utils/db';
import { type type_security_roles_schema } from '@/typings/client/securityRoles';
import { PermissionsList } from '@/typings/client/permissionsEnum';
export default defineEventHandler( async (event) => {
  try{
    const payload: type_security_roles_schema = await readBody(event);
    const id = (event.context.params?.id);
    const profile_data = payload.profileData;
    const profile_links = payload.profileLinks;

    //Check Permissions
    const userId = event.context.user.id;
    const isUserAllowed = `select * 
      from sys_users a
      inner join sys_profiles_users b on a.id = b.user_id
      inner join sys_profiles c on c.id = b.sys_profile_id
      inner join sys_profiles_links d on d.sys_profile_id = c.id
      where a.id = '${userId}'
      and d.sys_link_id = ${PermissionsList.ROLES_EDIT}`;
    const isUserAllowedResult = (await serverDB.query(isUserAllowed)).rowCount;
    if (isUserAllowedResult === 0) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
      });
    }

    //Process
    await serverDB.query('BEGIN');

    const sqlSysProfiles = `update sys_profiles set
      name_es = '${profile_data.name_es}'
      ,is_active = ${profile_data.is_active}
      ,updated_at = now()
      ,updated_by = '${userId}'
      WHERE id = ${id}`;
    await serverDB.query(sqlSysProfiles);

    const sqlSysProfilesDelete = `delete from sys_profiles_links WHERE sys_profile_id = ${id}`;
    await serverDB.query(sqlSysProfilesDelete);

    let sqlSysProfilesInsert = `insert into sys_profiles_links (sys_profile_id, sys_link_id) values `;
    profile_links.forEach((link) => {
      sqlSysProfilesInsert += `(${Number(id)}, ${link.id}),`;
    });
    sqlSysProfilesInsert = sqlSysProfilesInsert.replace(/\,$/, '');
    await serverDB.query(sqlSysProfilesInsert);
    
    await serverDB.query('COMMIT');
    return { message: `Perfil ${id} actualizado correctamente` };
  }catch(err) {
    await serverDB.query('ROLLBACK');
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: `${err ?? 'Unhandled exception'}`,
    });
  }
});