"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.db = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let poolConfig;
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
}
else {
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
const db = promise_1.default.createPool(poolConfig);
exports.db = db;
// Function to execute queries using the pool
const query = (sql, values) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield db.query(sql, values);
    return rows;
});
exports.query = query;
// Handle pool closing gracefully
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    yield db.end();
    console.log('Database connection pool closed.');
}));
