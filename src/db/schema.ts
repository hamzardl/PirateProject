import { mysqlTable, varchar, boolean, timestamp, mysqlEnum, int, text } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const users = mysqlTable("User", {
  id: varchar("Id", { length: 36 }).primaryKey().notNull().default(sql`UUID()`),
  userName: varchar("UserName", { length: 200 }).notNull(),
  password: varchar("Password", { length: 200 }).notNull(),
  isAdmin: boolean("IsAdmin").notNull().default(false),
});

export const boatTable = mysqlTable('boattable', {
  id: varchar('id', { length: 36 }).primaryKey(), 
  name: varchar('name', { length: 100 }).notNull(), 
  goldCargo: int('goldCargo').notNull(),
  createdAt : timestamp('createdAt').defaultNow().notNull(), 
  captain: varchar('captain', { length: 50 }).notNull(),
  status: mysqlEnum('status', ['docked', 'sailing', 'lookingForAFight']).notNull(),
  crewSize: int('crewSize').notNull(), 
  createdBy : varchar('createdBy', { length: 36 }).notNull(), 
  lastModified: timestamp('lastModified').defaultNow().onUpdateNow().notNull(), 
},
(table) => ({
  goldCargoCheck: {
    constraint: 'CHECK (goldCargo BETWEEN 0 AND 1000000)',
  },
  crewSizeCheck: {
    constraint: 'CHECK (crew_size BETWEEN 1 AND 500)',
  },
}));
