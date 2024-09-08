require('dotenv').config({ path: '../.env' }); 
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
});

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

const createTable = () => {
  db.query(dropTableQuery, (err, result) => {
    if (err) {
      console.error('Error dropping table:', err.message);
    } else {
      console.log('Table `collection_benefits` dropped.');
    }
  });

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table `collection_benefits` created or already exists.');
    }
    db.end(); 
  });
};

createTable();
