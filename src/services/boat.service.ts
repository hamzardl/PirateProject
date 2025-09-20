import { Boat, BoatRequest, BoatRequestUpdate } from '../types/boat.types';
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
   const newBoat = {
  ...boat,
  id: uuidv4(),
  createdAt: new Date(),
  lastModified: new Date()
};
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
async isValidDestination(destination: string): Promise<boolean> {
  try {
    const headers = {
      'x-client-id': 'app_601cfdad36d9f568188548de2cb108f7',
      'authorization': 'Bearer 8b882c88b918942817d32a0469bd731f7383a356bf993edac44884e995f8b1ad',
    };
    const response = await axios.get(`${BROKER_BASE_URL}/users`, { headers });
    // Accès correct à la liste des utilisateurs
    const users = response.data.users;
    // Log facultatif pour debug
    console.log("Liste des ports disponibles :", users);
    // Vérifie si destination est bien dans la liste
    return users.includes(destination);
    
  } catch (error) {
    console.error('Erreur lors de la récupération des ports:', error);
    return false;
  }
}


async sendBoatToDestination(destination: string, boat: BoatRequest): Promise<any> {
  try {
    const headers = {
      'x-client-id': 'app_601cfdad36d9f568188548de2cb108f7',
      'authorization': 'Bearer 8b882c88b918942817d32a0469bd731f7383a356bf993edac44884e995f8b1ad',
    };

    console.log("Je suis là avant POST");

    const { data } = await axios.post(
      `${BROKER_BASE_URL}/ship/sail/${destination}`,
      boat,
      { headers }
    );

    console.log("J'ai passé le POST");
    console.log(data);

    return data;
  } catch (error: any) {
    console.log(error);
    console.error('Erreur lors de l’envoie du bateau :', error.response?.data || error.message);
    throw new Error("Échec de la navigation.");
  }
}

   async getAvailablePortsFromBroker  (): Promise<string[]> {
    try {
     const headers = {
      'x-client-id': 'app_601cfdad36d9f568188548de2cb108f7',
      'authorization': 'Bearer 8b882c88b918942817d32a0469bd731f7383a356bf993edac44884e995f8b1ad',
    };
    const response = await axios.get(`${BROKER_BASE_URL}/users`, { headers });
    // Accès correct à la liste des utilisateurs
    const ports = response.data.users;
      return ports;
    } catch (error) {
      console.error('Erreur de communication avec le broker :', error);
      throw new Error("Erreur lors de la récupération des ports.");
    }
  }
}
