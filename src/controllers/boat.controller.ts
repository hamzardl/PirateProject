import { Request, Response, NextFunction } from 'express';
import { BoatService } from '../services/boat.service';
import { Boat, BoatRequestUpdate } from '../types/boat.types';
import { AuthenticatedRequest } from '../middleware/authToken.middleware';
import axios from 'axios';

const boatService = new BoatService();
const BROKER_BASE_URL = 'https://pwa-broker-pirates-2bc1349418b0.herokuapp.com/api';
export class BoatController {
    getAllBoats = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
       console.log(`📋 Getting todos for user: `);
      const boats = await boatService.getAllBoats();
      res.status(200).json(boats);
    } catch (error) {
      next(error);
    }
  };

  addBoat = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
     console.log(`salut `);
    const boat: Boat = req.body;
  console.log(`📋 Getting todos for user: `);
  console.log(boat);
    try {
      const createdBoat = await boatService.addBoat(boat); 
      res.status(201).json(createdBoat);
    } catch (error) {
      next(error);
    }
  };
     deleteBoat = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    console.log(`📋 Deleting boat with id: ${id}`);
    try {
      await boatService.deleteBoat(id);
      res.status(200).json({ message: `Boat ${id} deleted.` });
    } catch (error) {
      next(error);
    }
  };

  modifyBoat = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
     const { id } = req.params;
     console.log(`Modifying boat with id: ${id}`);
    const updatedBoat: BoatRequestUpdate = req.body;
    try {
      const result = await boatService.modifyBoat(updatedBoat, id);
      res.status(200).json({
        message: 'Boat updated successfully',
        boat: result
      });
    } catch (error) {
      next(error);
    }
  };
    validateDestinationPort=async (req: Request, res: Response) => {
    try {
      const destination = req.params.destination;

      const isValid = await boatService.isValidDestination(destination);

      if (!isValid) {
        return res.status(400).json({ message: 'Port invalide.' });
      }

      res.status(200).json({ message: 'Port valide.' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  };
  //  Méthode pour naviguer vers un port
  navigateToAnotherPort= async (req: Request, res: Response) => {
    try {
      const headers = {
      'x-client-id': 'app_601cfdad36d9f568188548de2cb108f7',
      'authorization': 'Bearer 8b882c88b918942817d32a0469bd731f7383a356bf993edac44884e995f8b1ad',
    };
    const responseUsers = await axios.get(`${BROKER_BASE_URL}/users`, { headers });
    const users = responseUsers.data;
    console.log("j'ai récupéré le users");
      const destination = req.params.destination;
      const boat = req.body;
      // Valider le port d’abord
      const isValid = await boatService.isValidDestination(destination);
      console.log(isValid);
      if (!isValid) {
        return res.status(400).json({ message: 'Port invalide.' });
      }

      // Appeler le broker
      console.log("je vais l'Appeler");
      //  !!!!statusMessage: 'Le statut du bateau doit être: sailing',message: 'Le statut du bateau doit être: sailing'
      // !!!!REverifier les dats sont pas valides
      //!!! mettre une liste déroulante
      const response = await boatService.sendBoatToDestination(destination, boat);
      console.log(response);
//CreatedAT commec a 
      res.status(200).json(response);
    } catch (error) {

      res.status(500).json({ message: 'Erreur pendant la navigation du bateau.' });
    }
  }
  getAvailablePorts=async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("dedededede");
      const ports = await boatService.getAvailablePortsFromBroker();
      res.status(200).json({ ports });
    } catch (error) {
      console.error('Erreur lors de la récupération des ports disponibles :', error);
      res.status(500).json({ message: 'Erreur serveur : impossible de récupérer les ports disponibles.' });
    }
  }
 
async getBoatsOnPort(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const clientId = req.headers['x-client-id'];
    const appTokens = req.headers['authorization'];

    if (!appTokens || !clientId) {
      return res.status(401).json({ message: 'App-Token ou Client-Id manquant.' });
    }

    const VALID_CLIENT_ID = 'app_601cfdad36d9f568188548de2cb108f7';
    const VALID_BEARER_TOKEN = '8b882c88b918942817d32a0469bd731f7383a356bf993edac44884e995f8b1ad';

    const token = appTokens.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token mal formé.' });
    }

    if (clientId !== VALID_CLIENT_ID || token !== VALID_BEARER_TOKEN) {
      return res.status(403).json({ message: 'Accès interdit : token ou ID invalide.' });
    }

    const boats = await boatService.getAllBoats();
    if (boats.length >= 8) {
      return res.status(400).json({ message: 'Port plein. Impossible de dock un nouveau bateau.' });
    }

    const boat: Boat = req.body;
    const createdBoat = await boatService.addBoat(boat);

    return res.status(201).json({ message: 'Bateau docké avec succès.', boat: createdBoat });
  } catch (error) {
    next(error);
  }
}



}

