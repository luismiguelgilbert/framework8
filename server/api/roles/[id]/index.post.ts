import serverDB from '@/server/utils/db';
import { type_sys_profiles } from '@/typings/server/sys_profiles';
import { type_sys_links } from '@/typings/server/sys_links';
import { type type_security_roles_schema } from '@/typings/client/securityRoles'

export default defineEventHandler( async (event) => {
  try{
    const payload: type_security_roles_schema = await readBody(event);
    const profile_data: type_sys_profiles = payload.profileData;
    const profile_links: type_sys_links[] = payload.profileLinks;

    await serverDB.query('BEGIN');

    const sqlSysProfiles = `INSERT INTO sys_profiles (created_at, name_es, is_active, updated_at) 
    values (now(), '${profile_data.name_es}', ${profile_data.is_active}, now()) 
    RETURNING id`;
    const { rows } = await serverDB.query(sqlSysProfiles);
    const id = rows[0].id;

    if (profile_links.length > 0) {
      let sqlSysProfilesInsert = `insert into sys_profiles_links (sys_profile_id, sys_link_id) values `;
      profile_links.forEach((link) => {
        sqlSysProfilesInsert += `(${Number(id)}, ${link.id}),`;
      });
      sqlSysProfilesInsert = sqlSysProfilesInsert.replace(/\,$/, '');
      await serverDB.query(sqlSysProfilesInsert);
    }

    await serverDB.query('COMMIT');
    //return { message: `Perfil ${id} actualizado correctamente`, data: { id } };
    return { id };
  }catch(err) {
    await serverDB.query('ROLLBACK');
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});