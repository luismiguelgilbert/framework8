import sql from 'mssql';

const sqlConfig = {
  user: process.env.SQL_DATABASE_USR!,
  password: process.env.SQL_DATABASE_PWD!,
  database: process.env.SQL_DATABASE_NAME!,
  server: process.env.SQL_DATABASE_URL!,
  connectionTimeout: 30000,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
};

class SqlConnection {
  public connection: sql.ConnectionPool;
  constructor() {
    this.connection = new sql.ConnectionPool(sqlConfig);
    this.connectToSql();
  }
  async connectToSql() {
    try {
      console.log('Connecting to SQL Server...');
      await this.connection.connect();
      console.log('Connected to SQL Server');
    } catch (err) {
      console.log('Error connecting to SQL Server');
      console.log(err);
    }
  }
}

export default new SqlConnection();