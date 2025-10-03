import { Boat, BoatRequest, BoatRequestUpdate } from '../types/boat.types';
import { BoatRepository } from '../reporitories/boat.repository';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
const boatRepository = new BoatRepository();
const headers = JSON.parse(process.env.HEADERS!);
export class BoatService {
    async getAllBoats(): Promise<Boat[]> {
    return await boatRepository.getAllBoats();
  }
  async addBoat(boat: Boat): Promise<Boat> {
   const newBoat = {
      ...boat,
      id: uuidv4(),
      createdAt: new Date(),
     lastModified: new Date()
    };
    await boatRepository.addBoat(newBoat);
    return newBoat;
  }
  async deleteBoat(id: string): Promise<void> {
    await boatRepository.deleteBoat(id);
  }
  async modifyBoat(updatedBoat: BoatRequestUpdate, id: string): Promise<BoatRequestUpdate | null> {
    return await boatRepository.modifyBoat(updatedBoat,id);
  }
async isValidDestination(destination: string): Promise<boolean> {
  try {
    const response = await axios.get(`${process.env.BROKER_BASE_URL}/users`, { headers });
    const users = response.data.users;
    return users.includes(destination);
  } catch (error) {
    console.error('Error while retrieving ports.', error);
    return false;
  }
}
async sendBoatToDestination(destination: string, boat: BoatRequest): Promise<any> {
  try {
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
    console.error('Erreur lors de l’envoie du bateau :', error.response?.data || error.message);
    throw new Error("Navigation Failure");
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
