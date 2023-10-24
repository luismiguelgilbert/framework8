import serverDB from '@/server/utils/db';
import { type_sys_profiles } from '@/typings/server/sys_profiles';
import { type_sys_links } from '@/typings/server/sys_links';

export default defineEventHandler( async (event) => {
  try{
    const payload = await readBody(event);
    const id = (event.context.params?.id);
    const profile_data: type_sys_profiles = payload.profile_data;
    const profile_links: type_sys_links[] = payload.profile_links;

    await serverDB.query('BEGIN');

    const sqlSysProfiles = `update sys_profiles set
      name_es = '${profile_data.name_es}'
      ,is_active = ${profile_data.is_active}
      ,updated_at = now()
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
      statusMessage: 'Unhandled exception',
    });
  }
});