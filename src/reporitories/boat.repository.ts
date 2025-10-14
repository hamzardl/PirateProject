import { eq } from 'drizzle-orm';
import { boatTable } from '../db/schema';
import { Boat, BoatRequestUpdate } from '../types/boat.types';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/connection';

export class BoatRepository {
  async getAllBoats(): Promise<Boat[]> {
    const result = await db.select().from(boatTable);
    return result.map(this.mapToBoat);
  }

  async findById(id: string): Promise<Boat | null> {
    const result = await db.select().from(boatTable).where(eq(boatTable.id, id)).limit(1);
    return result.length > 0 ? this.mapToBoat(result[0]) : null;
  }

  async addBoat(boat: Boat): Promise<Boat> {
    await db.insert(boatTable).values({
    id: boat.id,
    name: boat.name,
    goldCargo: boat.goldCargo,
    createdAt: new Date(boat.createdAt), 
    captain: boat.captain,
    status: boat.status,
    crewSize: boat.crewSize,
    createdBy: boat.createdBy,
    lastModified: new Date(boat.lastModified),
   });
   const result = await this.findById(boat.id);
   if (!result) {
    throw new Error('Failed to create boat');
   }
   return result;
  }
  async deleteBoat(id: string): Promise<void> {
    await db.delete(boatTable).where(eq(boatTable.id, id));
  }
async modifyBoat(updatedBoat: BoatRequestUpdate, id: string): Promise<BoatRequestUpdate | null> {
  await db.update(boatTable)
    .set({
      name:updatedBoat.name,
      goldCargo: updatedBoat.goldCargo,
      captain: updatedBoat.captain,
      status: updatedBoat.status,
      crewSize: updatedBoat.crewSize,
    })
    .where(eq(boatTable.id, id));
  const result = await this.findById(id);
  return result ? this.mapToBoat(result) : null;
}
      private mapToBoat(row: Boat): Boat {
        return {
          id: row.id,            
          name: row.name,         
          goldCargo: row.goldCargo, 
          createdAt: row.createdAt,     
          captain: row.captain,      
          status: row.status as 'docked' | 'sailing' | 'lookingForAFight', 
          crewSize: row.crewSize,      
          createdBy: row.createdBy,   
          lastModified: row.lastModified,  
        };
      }
}