import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
// Charger les variables depuis le .env
dotenv.config();

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'boat_api',
  },
  dialect: 'mysql',
} satisfies Config;
