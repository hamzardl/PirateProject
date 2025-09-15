import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import dotenv from 'dotenv';
//!! ca c'Est obligatoire pour qu'il lance la config 
dotenv.config();
const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'todo_api',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})
export const db = drizzle(connection, { schema, mode: 'default' });

export const testConnection = async (): Promise<{ success: boolean; error?: string }> => {
  try {
  //put the code after to check the connection
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    console.error('Database connection failed:', errorMessage);
    return { success: false, error: errorMessage };
  }
};