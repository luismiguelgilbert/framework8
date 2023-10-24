import serverDB from '@/server/utils/db';
import { sp_system_menu } from '@/typings/server/sp_system_menu';

export default defineEventHandler( async (event) => {
  try{
    const text = `select
    d.id, d.parent, d.position as position_num, d.link, d.name_es, d.icon, d.comment_es
    from sys_profiles_users a
    inner join sys_profiles b on a.sys_profile_id = b.id
    inner join sys_profiles_links c on c.sys_profile_id = b.id
    inner join sys_links d on c.sys_link_id = d.id
    where a.user_id = $1
    UNION
    Select 0 as id, NULL as parent, 0 as position, null as link, 'Inicio' as name_es, 'fas fa-home' as icon, 'Dashboard inicial' as comment_es
    UNION
    Select -1 as id, 0 as parent, 0 as position, '/' as link, 'Inicio' as name_es, 'fas fa-home' as icon, 'Dashboard inicial' as comment_es
    order by 3`;
    const values = [event.context.user.id];
    const menu_data = await serverDB.query(text, values);
 
    return sp_system_menu.array().parse(menu_data.rows);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});
