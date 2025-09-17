import { eq } from 'drizzle-orm';
import { boatTable } from '../db/schema';
import { Boat, BoatRequestUpdate } from '../types/boat.types';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/connection';

export class BoatRepository {
  async getAllBoats(): Promise<Boat[]> {
    const result = await db.select().from(boatTable);
    console.log(result);
    return result.map(this.mapToBoat);
  }

async addBoat(boat: Boat): Promise<Boat> {
  await db.insert(boatTable).values({
    id: boat.id,
    name: boat.name,
    goldCargo: boat.goldCargo,
    created_at: new Date(boat.created_at), // nom SQL avec underscore + conversion en Date
    captain: boat.captain,
    status: boat.status,
    crewSize: boat.crewSize,
    created_by: boat.created_by,
    last_modified: new Date(boat.last_modified), // pareil
  });

  const result = await this.findById(boat.id);
  if (!result) {
    throw new Error('Failed to create boat');
  }
  return result;
}

  async findById(id: string): Promise<Boat | null> {
    const result = await db.select().from(boatTable).where(eq(boatTable.id, id)).limit(1);
    return result.length > 0 ? this.mapToBoat(result[0]) : null;
  }
      private mapToBoat(row: any): Boat {
        return {
          id: row.id,            // varchar(36) UUID
          name: row.name,          // varchar(100)
          goldCargo: row.goldCargo,     // int
          created_at: row.created_at,     // timestamp (ISO string)
          captain: row.captain,       // varchar(50)
          status: row.status as 'docked' | 'sailing' | 'lookingForAFight', // enum
          crewSize: row.crewSize,      // int
          created_by: row.created_by,     // varchar(36) UUID
          last_modified: row.last_modified,  // timestamp (ISO string)
        };
      }
}