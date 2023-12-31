import serverDB from '@/server/utils/db';
export default defineEventHandler( async (event) => {
  try{
    const payload = await readBody(event);
    const id = (event.context.params?.id);
    const dark_enabled = payload.dark_enabled ?? null;
    const default_color = payload.default_color ? `'${payload.default_color}'` : null;
    const default_dark_color = payload.default_dark_color ? `'${payload.default_dark_color}'` : null;
    const avatar_url = payload.avatar_url ? `'${payload.avatar_url}'` : null;
    const prefered_company = payload.prefered_company ? payload.prefered_company : null;

    //Process
    await serverDB.query('BEGIN');
    
    let sqlUpdateUserData = `update sys_users set
       dark_enabled = COALESCE(${dark_enabled}, dark_enabled)
      ,default_color = COALESCE(${default_color}, default_color)
      ,default_dark_color = COALESCE(${default_dark_color}, default_dark_color)
      ,avatar_url = COALESCE(${avatar_url}, avatar_url)
      WHERE id = '${id}'`;
    await serverDB.query(sqlUpdateUserData);

    if (prefered_company) {
      let sqlUpdateUserCompanyReset = `update sys_companies_users set is_default = false where user_id = '${id}'`;
      let sqlUpdateUserCompany = `update sys_companies_users set is_default = true where user_id = '${id}' and sys_company_id = '${prefered_company}'`;
      await serverDB.query(sqlUpdateUserCompanyReset);
      await serverDB.query(sqlUpdateUserCompany);
    }
    
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