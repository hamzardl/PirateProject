import { mysqlTable, varchar, boolean, timestamp, mysqlEnum, int, text } from 'drizzle-orm/mysql-core';

// On défini le schéma ici. C'est ce qui sera utilisé pour créer la table dans la base de données.
// On utilise les types de Drizzle pour définir les colonnes de la table.
// Chaque colonne est définie avec un type, une longueur (si applicable) et des contraintes
export const todos = mysqlTable('todos', {
  id: varchar('id', { length: 36 }).primaryKey(),
  text: varchar('text', { length: 500 }).notNull(),
  isCompleted: boolean('is_completed').default(false).notNull(),
  date: timestamp('date').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
export const users = mysqlTable("User", {
  id: varchar("Id", { length: 36 }).primaryKey().notNull(), // UUID
  userName: varchar("UserName", { length: 200 }).notNull(),
  password: varchar("Password", { length: 200 }).notNull(),
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

export const tokenTable = mysqlTable('tokens', {
  id: varchar('id', { length: 36 }).primaryKey(), // UUID du token ou ID unique
  username: varchar('username', { length: 255 }).notNull(), // Nom d'utilisateur (du token)
  token: text('token').notNull(), // Le JWT on amis texte parceq eu un otken eput arriver facilement a 200 et 600 lettre 
  issued_at: timestamp('issued_at').defaultNow().notNull(), // Date d’émission
  expires_at: timestamp('expires_at').notNull(), // Date d’expiration
  revoked: boolean('revoked').default(false).notNull(), // Si le token est révoqué
  created_at: timestamp('created_at').defaultNow().notNull(), // Création
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow().notNull(), // Mise à jour
});

//INSERT INTO User (id, userName, password)
//VALUES (UUID(), 'root', 'root'); dans la base de données pour créer un utilisateur par défaut
