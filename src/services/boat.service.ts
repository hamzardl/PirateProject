import { Boat, BoatRequestUpdate } from '../types/boat.types';
import { BoatRepository } from '../reporitories/boat.repository';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
const boatRepository = new BoatRepository();
const BROKER_BASE_URL = 'https://pwa-broker-pirates-2bc1349418b0.herokuapp.com/api';
export class BoatService {
    async getAllBoats(): Promise<Boat[]> {
    // Appel au repository (à implémenter)
    return await boatRepository.getAllBoats();
  }
   
  async addBoat(boat: Boat): Promise<Boat> {
    console.log(boat);
    console.log("hello arrive service ");
    const newBoat = { ...boat, id: uuidv4(), createdAt: new Date().toISOString(), lastModified: new Date().toISOString() };
    // Appel au repository (à implémenter)
     console.log(newBoat);
       console.log("hello envoie repository ");
    await boatRepository.addBoat(newBoat);
    return newBoat;
  }
  async deleteBoat(id: string): Promise<void> {
    // Appel au repository (à implémenter)
    await boatRepository.deleteBoat(id);
  }
  async modifyBoat(updatedBoat: BoatRequestUpdate, id: string): Promise<BoatRequestUpdate | null> {
    console.log("hello arrive service modify ");
    // Appel au repository (à implémenter)
     console.log(updatedBoat);
       console.log("hello envoie repository modify ");
    return await boatRepository.modifyBoat(updatedBoat,id);
  }
   async isValidDestination (destination: string): Promise<boolean>  {
    try {
      const { data: users } = await axios.get(`${BROKER_BASE_URL}/users`);
      return users.some((user: any) => user.portName === destination);
    } catch (error) {
      console.error('Erreur lors de la récupération des ports:', error);
      return false;
    }
  }
   async sendBoatToDestination (destination: string, boat: any): Promise<any>  {
    try {
      const headers = {
        'Client-Id':"", // Adapté selon ton auth
        'App-T':"" ,
      };
      const { data } = await axios.post(
        `${BROKER_BASE_URL}/ship/sail/${destination}`,
        boat,
        { headers }
      );
      return data;
    } catch (error: any) {
      console.error('Erreur lors de l’envoi du bateau :', error.response?.data || error.message);
      throw new Error("Échec de la navigation.");
    }
  }
}
