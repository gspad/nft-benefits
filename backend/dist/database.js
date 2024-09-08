"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
// For local development
dotenv_1.default.config();
let dbConfig;
// Check if the app is running on Platform.sh
if (process.env.PLATFORM_RELATIONSHIPS) {
    const relationships = JSON.parse(process.env.PLATFORM_RELATIONSHIPS);
    const relationship = relationships.database[0]; // 'database' matches the relationship name in .platform.app.yaml
    dbConfig = {
        host: relationship.host,
        user: relationship.username,
        password: relationship.password,
        database: relationship.path,
        port: relationship.port,
    };
}
else {
    // Local development environment
    dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    };
}
const db = mysql2_1.default.createConnection(dbConfig);
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    }
    else {
        console.log('Connected to the MySQL database.');
    }
});
exports.default = db;
