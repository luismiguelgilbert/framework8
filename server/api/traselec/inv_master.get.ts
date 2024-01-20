import SqlConnection from '@/server/utils/db_sql';

export default defineEventHandler( async (event) => {
  try{
    const result = await SqlConnection.connection.request().query(`
      select 
      a.Inventory_ID
      ,b.Name
      ,a.Internal_Code
      from Inv_Master A
      inner join Inv_Master_Names b on a.Inventory_ID = b.Inventory_ID
      where Company_ID = 1
      order by 2
    `);
    return result.recordset;

  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});