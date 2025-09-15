import { mysqlTable, varchar, boolean, timestamp, mysqlEnum, int } from 'drizzle-orm/mysql-core';

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
  id: varchar('id', { length: 36 }).primaryKey(), // ID unique (UUID en string)
  name: varchar('name', { length: 100 }).notNull(), // Nom du bateau
  goldCargo: int('goldCargo').notNull(), // Quantité d'or à bord (0 à 1M)
  created_at : timestamp('created_at').defaultNow().notNull(), // Date de création
  captain: varchar('captain', { length: 50 }).notNull(), // Nom du capitaine
  status: mysqlEnum('status', ['docked', 'sailing', 'lookingForAFight']).notNull(), // État du bateau
  crewSize: int('crewSize').notNull(), // Taille de l'équipage (1 à 500)
  created_by : varchar('created_by', { length: 36 }).notNull(), // Créateur du bateau (UUID user)
  last_modified: timestamp('last_modified').defaultNow().onUpdateNow().notNull(), // Dernière modif
},
(table) => ({
  // Contraintes CHECK en SQL pur, reconnues par Drizzle
  goldCargoCheck: {
    constraint: 'CHECK (goldCargo BETWEEN 0 AND 1000000)',
  },
  crewSizeCheck: {
    constraint: 'CHECK (crew_size BETWEEN 1 AND 500)',
  },
}));

//INSERT INTO User (id, userName, password)
//VALUES (UUID(), 'root', 'root'); dans la base de données pour créer un utilisateur par défaut
