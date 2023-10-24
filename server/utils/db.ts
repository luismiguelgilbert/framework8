/*import * as postgres from 'postgres';
const client: any = postgres;
const serverDB = client.default(process.env.DATABASE_URL!);

export default serverDB;*/


// import { Pool } from 'pg'
// import { Pool } from 'pg'
//import { Client } from 'pg'
//import { Client } from 'pg'
import pg from 'pg';

/*const serverDB = new pg.Client({
  host: 'db.talzswrlxcdlbttmzrzh.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Titotito2011',
});*/

const serverDB = new pg.Pool({
  host: 'db.talzswrlxcdlbttmzrzh.supabase.co',
  port: 6543,
  database: 'postgres',
  user: 'postgres',
  password: 'Titotito2011',
}); 

/*serverDB.on('connect', (e) => {console.log('Database connected', e);});
serverDB.on('acquire', (e) => {console.log('acquire', e);});
serverDB.on('error', (e) => {console.log('error', e);});
serverDB.on('release', (e) => {console.log('release', e);});
serverDB.on('remove', (e) => {console.log('remove', e);});*/

// serverDB.connect();

export default serverDB;