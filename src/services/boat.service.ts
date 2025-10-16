import { Boat, BoatRequest, BoatRequestUpdate, BoatShipDock } from '../types/boat.types';
import { BoatRepository } from '../reporitories/boat.repository';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { AuthenticatedRequest } from '../middleware/authToken.middleware';
const boatRepository = new BoatRepository();
const headers = JSON.parse(process.env.HEADERS!);
export class BoatService {
async getAllBoats(): Promise<Boat[]> {
    return await boatRepository.getAllBoats();
}
async addBoat(req: AuthenticatedRequest,boat: BoatRequest): Promise<BoatRequest> {
    try {
      this.validateBoat(boat);
      const newBoat: Boat = {
        ...boat,
        id: uuidv4(),
        createdBy:req.user!.username,
        createdAt: new Date(),
        lastModified: new Date()
      };
    const listBoats = await this.getAllBoats();
    if (listBoats.length < 8) {
        await boatRepository.addBoat(newBoat);
    } else {
        throw new Error("Cannot add more than 8 boats. Limit reached.");
    }
      return newBoat;
    } catch (error) {
      throw new Error((error as Error).message || 'Failed to add boat');
    }
}
async addBoatFromShipDock(boat:BoatShipDock): Promise<BoatShipDock> {
  console.log("je susi arrive ici ");
    try {
      const newBoat: Boat = {
        ...boat,
        id: uuidv4(),
        lastModified: new Date()
      };
    const listBoats = await this.getAllBoats();
    if (listBoats.length < 8) {
        await boatRepository.addBoat(newBoat);
    } else {
        throw new Error("Cannot add more than 8 boats. Limit reached.");
    }
      return newBoat;
    } catch (error) {
      throw new Error((error as Error).message || 'Failed to add boat');
    }
}
async deleteBoat(id: string): Promise<void> {
   try {
    if (id == null) {
      throw new Error("id must not be null");
    }
    await boatRepository.deleteBoat(id);
    } catch (error) {
    throw new Error((error as Error).message || "Failed to delete boat");
    }
}
  /* I added an additional validation here besides the method validation,  
   so I chose to validate only the minimum required parameters not all the parametre like the methode validateBoat. */
async modifyBoat(updatedBoat: BoatRequestUpdate, id: string): Promise<BoatRequestUpdate | null> {
  try {
    if (updatedBoat.goldCargo < 0 || updatedBoat.goldCargo > 1_000_000) {
      throw new Error('Gold cargo must be between 0 and 1,000,000.');
    }
    if (updatedBoat.captain.length < 2 || updatedBoat.captain.length > 50) {
      throw new Error('Captain name must be between 2 and 50 characters.');
    }
    if (updatedBoat.crewSize < 1 || updatedBoat.crewSize > 500) {
      throw new Error('Crew size must be between 1 and 500.');
    }
      const existingBoat = await boatRepository.findById(id);
      if (!existingBoat) {return null};
      return await boatRepository.modifyBoat(updatedBoat, id);
    } catch (error) {
    throw new Error((error as Error).message || 'Failed to modify boat');
    }
}
async isValidDestination(destination: string): Promise<boolean> {
  try {
   const response:String[]= await this.getAvailablePortsFromBroker();
    return response.includes(destination);
  } catch (error) {
    console.error('Error while retrieving ports.', error);
    return false;
  }
}
async sendBoatToDestination(destination: string, idShip: string): Promise<any> {
  try {
    const boatship: Boat | null = await boatRepository.findById(idShip);
    if (!boatship) {
      throw new Error(`Bateau avec l'ID ${idShip} introuvable`);
    }
    console.log("vociice que j'Ai recu par un findbyid");
    console.log(boatship);
  const boat: BoatShipDock = {
  name: boatship.name,
  goldCargo: boatship.goldCargo,
  createdAt: boatship.createdAt,
  captain: boatship.captain,
  status: boatship.status,
  crewSize: boatship.crewSize,
  createdBy: boatship.createdBy,
  };
    this.validateBoat(boat);
      const isValid = await this.isValidDestination(destination);
      if (!isValid) {
            throw new Error("Invalid ports");
      }
    const { data } = await axios.post(
      `${process.env.BROKER_BASE_URL}/ship/sail/${destination}`,
      boat,
      { headers }
    );
    if (data.statusCode && data.statusCode !== 200) {
      throw new Error(data.statusMessage || "Unknown error occurred during navigation.");
    }
    this.deleteBoat(idShip);
    return data;
    } catch (error: any) {
    throw new Error("Navigation Failure");
  }
}
/*
async sendBoatToDestination(destination: string, boat: BoatShipDock): Promise<any> {
  try {
  
    console.log("voic mon boat qui arrive de swagger ");
    console.log(boat);
    this.validateBoat(boat);
      const isValid = await this.isValidDestination(destination);
      if (!isValid) {
            throw new Error("Invalid ports");
      }
    const { data } = await axios.post(
      `${process.env.BROKER_BASE_URL}/ship/sail/${destination}`,
      boat,
      { headers }
    );
    if (data.statusCode && data.statusCode !== 200) {
      throw new Error(data.statusMessage || "Unknown error occurred during navigation.");
    }
    return data;
    } catch (error: any) {
    throw new Error("Navigation Failure");
  }
}*/
 validateBoat(boat: Boat | BoatRequest): void {
  if (boat.name.length < 2 || boat.name.length > 100) {
    throw new Error('Name must be between 2 and 100 characters.');
  }

  if (boat.goldCargo < 0 || boat.goldCargo > 1_000_000) {
    throw new Error('Gold cargo must be between 0 and 1,000,000.');
  }

  if (boat.captain.length < 2 || boat.captain.length > 50) {
    throw new Error('Captain name must be between 2 and 50 characters.');
  }

  if (boat.crewSize < 1 || boat.crewSize > 500) {
    throw new Error('Crew size must be between 1 and 500.');
  }
  if (
    boat.status !== 'docked' &&
    boat.status !== 'sailing' &&
    boat.status !== 'lookingForAFight'
  ) {
    throw new Error('Status must be one of: docked, sailing, lookingForAFight.');
  }
}
async getAvailablePortsFromBroker  (): Promise<string[]> {
    try {
    const response = await axios.get(`${process.env.BROKER_BASE_URL}/users`, { headers });
    const ports = response.data.users;
      return ports;
    } catch (error) {
      console.error('Communication error with the broker:', error);
      throw new Error("Error while retrieving ports.");
    }
  }
}
