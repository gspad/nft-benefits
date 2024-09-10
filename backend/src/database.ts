import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let poolConfig: any;

// Check if the app is running on Platform.sh
if (process.env.PLATFORM_RELATIONSHIPS) {
  const decodedRelationships = Buffer.from(process.env.PLATFORM_RELATIONSHIPS, 'base64').toString('utf-8');
  const database = JSON.parse(decodedRelationships);
  const dbConfig = database.mariadb[0];

  poolConfig = {
    host: dbConfig.host,
    user: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.path,
    port: dbConfig.port,
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0       
  };
} else {
  // Local development environment
  poolConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0       
  };
}

const db = mysql.createPool(poolConfig);

// Function to execute queries using the pool
const query = async (sql: string, values?: any) => {
  const [rows] = await db.query(sql, values);
  return rows;
};

// Handle pool closing gracefully
process.on('SIGTERM', async () => {
  await db.end();
  console.log('Database connection pool closed.');
});

export { db, query };
