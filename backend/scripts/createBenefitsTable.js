require('dotenv').config({ path: '../.env' }); 

const mysql = require('mysql2/promise');

const getDbConnection = async () => {
  let dbConfig;

  if (process.env.PLATFORM_RELATIONSHIPS) {
    const decodedRelationships = Buffer.from(process.env.PLATFORM_RELATIONSHIPS, 'base64').toString('utf-8');
    const database = JSON.parse(decodedRelationships);
    const dbJSON = database.mariadb[0];

    dbConfig = {
      host: dbJSON.host,
      user: dbJSON.username,
      password: dbJSON.password,
      database: dbJSON.path,
      port: dbJSON.port,
    };
  } else {
    dbConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    };
  }

  return mysql.createConnection(dbConfig);
};

const dropTableQuery = `
  DROP TABLE IF EXISTS collection_benefits;
`;

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS collection_benefits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contract_address VARCHAR(255) NOT NULL,
    token_id VARCHAR(255) NOT NULL,
    short_title VARCHAR(255) NOT NULL,
    long_title VARCHAR(255),
    short_description TEXT,
    long_description TEXT,
    thumbnail VARCHAR(255),
    valid_from DATETIME,
    valid_to DATETIME,
    url VARCHAR(255),
    action_date DATETIME
  );
`;

const createTable = async () => {
  let dbConn;
  try {
    dbConn = await getDbConnection();

    await dbConn.query(dropTableQuery);
    console.log('Table `collection_benefits` dropped.');

    await dbConn.query(createTableQuery);
    console.log('Table `collection_benefits` created.');
  } catch (err) {
    console.error('Error executing query:', err.message);
  } finally {
    if (dbConn) {
      await dbConn.end();
    }
  }
};

createTable();