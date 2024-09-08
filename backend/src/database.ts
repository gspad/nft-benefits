import mysql from 'mysql2';
import dotenv from 'dotenv';

// For local development
dotenv.config();

let db: any;

// Check if the app is running on Platform.sh
if (process.env.PLATFORM_RELATIONSHIPS) {
  const decodedRelationships = Buffer.from(process.env.PLATFORM_RELATIONSHIPS, 'base64').toString('utf-8');
  const database = JSON.parse(decodedRelationships);
  const dbConfig = database.mariadb[0];

  db = {
    host: dbConfig.host,
    user: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.path,
    port: dbConfig.port,
  };
} else {
  // Local development environment
  db = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  };
}

const connection = mysql.createConnection(db);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the MySQL database.');
  }
});

export default connection;
