import serverDB from '@/server/utils/db';
import type { type_security_users_schema } from "@/typings/client/securityUsers";
import { PermissionsList } from '@/typings/client/permissionsEnum';
import { serverSupabaseClient } from '#supabase/server'


export default defineEventHandler( async (event) => {
  try{
    const payload: type_security_users_schema = await readBody(event);
    const userData = payload.userData;
    const userCompanies = payload.userCompanies;
    const user_name = payload.userData.user_name ? `${payload.userData.user_name}` : null;
    const user_lastname = payload.userData.user_lastname ? `${payload.userData.user_lastname}` : null;
    const sys_profile_id = payload.userData.sys_profile_id ? `${payload.userData.sys_profile_id}` : null;

    //Check Permissions
    const userId = event.context.user.id;
    const isUserAllowed = `select * 
      from sys_users a
      inner join sys_profiles_users b on a.id = b.user_id
      inner join sys_profiles c on c.id = b.sys_profile_id
      inner join sys_profiles_links d on d.sys_profile_id = c.id
      where a.id = '${userId}'
      and d.sys_link_id = ${PermissionsList.USERS_CREATE}`;
    const isUserAllowedResult = (await serverDB.query(isUserAllowed)).rowCount;
    if (isUserAllowedResult === 0) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
      });
    }

    //Create User on Supabase
    const supabaseClient = await serverSupabaseClient(event);

    const { data, error } = await supabaseClient.auth.signUp({
      email: userData.email,
      password: process.env.NEWUSERSDEFAULTPWD!,
      options: {
        data: {
          // id: 'John',
          user_name: user_name,
          user_lastname: user_lastname,
          avatar_url: '',
        }
      }
    });
    const newUserId = data.user?.id;

    console.log({data});
    console.log({error});

    //Process
    await serverDB.query('BEGIN');

    //Update Profiles
    let sqlProfileInsert = `insert into sys_profiles_users (sys_profile_id, user_id) values (${sys_profile_id}, '${newUserId}')`;
    await serverDB.query(sqlProfileInsert);
    
    //Update Companies
    let sqlCompaniesInsert = `insert into sys_companies_users (sys_company_id, user_id) values `;
    userCompanies.forEach((company) => {
      sqlCompaniesInsert += `('${company.id}', '${newUserId}'),`;
    });
    sqlCompaniesInsert = sqlCompaniesInsert.replace(/\,$/, '');
    await serverDB.query(sqlCompaniesInsert);
    
    await serverDB.query('COMMIT');
    // return { message: `Usuario ${id} actualizado correctamente` };
    return newUserId;
  }catch(err) {
    await serverDB.query('ROLLBACK');
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: `${err ?? 'Unhandled exception'}`,
    });
  }
});