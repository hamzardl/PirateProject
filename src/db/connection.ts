import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema'; 
import dotenv from 'dotenv';

dotenv.config();
const dbName = process.env.DB_NAME || 'boat_api';
const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT || '3306');
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || 'Patate123';
async function ensureDatabaseExists() {
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
  await connection.end();
}
(async () => {
  await ensureDatabaseExists();
})();
const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
export const db = drizzle(connection, { schema, mode: 'default' });
export const testConnection = async (): Promise<{ success: boolean; error?: string }> => {
  try {

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`✅ Database "${dbName}" is ready.`);

    await connection.query('SELECT 1');

    const [databases] = await connection.query('SHOW DATABASES LIKE ?', [dbName]);
    if (Array.isArray(databases) && databases.length === 0) {
      throw new Error(`Database ${dbName} does not exist`);
    }

    const [tables] = await connection.query('SHOW TABLES LIKE ?', ['boattable']);
    if (Array.isArray(tables) && tables.length === 0) {
      throw new Error('Table boattable does not exist in the database');
    }

    console.log('Database connection successful and boattable exists.');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    console.error('Database connection failed:', errorMessage);
    return { success: false, error: errorMessage };
  }
};
