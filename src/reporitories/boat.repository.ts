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
    createdAt: new Date(boat.createdAt), // nom SQL avec underscore + conversion en Date
    captain: boat.captain,
    status: boat.status,
    crewSize: boat.crewSize,
    createdBy: boat.createdBy,
    lastModified: new Date(boat.lastModified), // pareil
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
  async deleteBoat(id: string): Promise<void> {
    await db.delete(boatTable).where(eq(boatTable.id, id));
  }
 async modifyBoat(updatedBoat: BoatRequestUpdate, id: string): Promise<BoatRequestUpdate | null> {
  console.log("voci repository modify");
    const existing = await db.select().from(boatTable).where(eq(boatTable.id, id)).limit(1);
    console.log(existing);
    if (existing.length === 0) return null;

    await db.update(boatTable)
      .set({
        goldCargo: updatedBoat.goldCargo,
        captain: updatedBoat.captain,
        status: updatedBoat.status,
        crewSize: updatedBoat.crewSize,
        lastModified: new Date(updatedBoat.lastModified), 
      })
      .where(eq(boatTable.id, id));

    const result = await db.select().from(boatTable).where(eq(boatTable.id, id)).limit(1);
    return result.length > 0 ? this.mapToBoat(result[0]) : null;
  }
      private mapToBoat(row: any): Boat {
        return {
          id: row.id,            // varchar(36) UUID
          name: row.name,          // varchar(100)
          goldCargo: row.goldCargo,     // int
          createdAt: row.createdAt,     // timestamp (ISO string)
          captain: row.captain,       // varchar(50)
          status: row.status as 'docked' | 'sailing' | 'lookingForAFight', // enum
          crewSize: row.crewSize,      // int
          createdBy: row.createdBy,     // varchar(36) UUID
          lastModified: row.lastModified,  // timestamp (ISO string)
        };
      }
}