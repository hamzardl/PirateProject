import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';  // ton fichier qui exporte boatTable etc
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'boat_api', // ici ta base boat_api
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(connection, { schema, mode: 'default' });

export const testConnection = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Test a simple connection
    await connection.query('SELECT 1');

  //Verify if the database exists
    const [databases] = await connection.query('SHOW DATABASES LIKE ?', ['boat_api']);
    if (Array.isArray(databases) && databases.length === 0) {
      throw new Error('Database boat_api does not exist');
    }

    // Verifiy if the table boattable exist at the database boat_api
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
