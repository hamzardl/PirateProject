import { Boat, BoatRequestUpdate } from '../types/boat.types';
import { BoatRepository } from '../reporitories/boat.repository';
import { v4 as uuidv4 } from 'uuid';
const boatRepository = new BoatRepository();
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
  
}
