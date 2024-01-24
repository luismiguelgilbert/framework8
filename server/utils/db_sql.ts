import { Sequelize } from 'sequelize';
import * as tedious from 'tedious';

const sequelize = new Sequelize(process.env.SQL_DATABASE_NAME!, process.env.SQL_DATABASE_USR!, process.env.SQL_DATABASE_PWD!, {
  host: process.env.SQL_DATABASE_URL!,
  dialect: 'mssql',
  dialectModule: tedious,
  dialectOptions: {
    options: {
      // Your tedious options here
      useUTC: false,
      dateFirst: 1
    }
  },
  logging: false,
});

export default sequelize;