import { Request, Response, NextFunction } from 'express';
import { BoatService } from '../services/boat.service';
import { Boat, BoatRequestUpdate } from '../types/boat.types';
import { AuthenticatedRequest } from '../middleware/authToken.middleware';

const boatService = new BoatService();

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
  // ✅ Méthode pour naviguer vers un port
  navigateToAnotherPort= async (req: Request, res: Response) => {
    try {
      const destination = req.params.destination;
      const boat = req.body;

      // Valider le port d’abord
      const isValid = await boatService.isValidDestination(destination);

      if (!isValid) {
        return res.status(400).json({ message: 'Port invalide.' });
      }

      // Appeler le broker
      const response = await boatService.sendBoatToDestination(destination, boat);

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: 'Erreur pendant la navigation du bateau.' });
    }
  }
  getAvailablePorts=async (req: Request, res: Response): Promise<void> => {
    try {
      const ports = await boatService.getAvailablePortsFromBroker();
      res.status(200).json({ ports });
    } catch (error) {
      console.error('Erreur lors de la récupération des ports disponibles :', error);
      res.status(500).json({ message: 'Erreur serveur : impossible de récupérer les ports disponibles.' });
    }
  }
 
async getBoatsOnPort(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const appToken = req.headers['app-token'];
      const clientId = req.headers['client-id'];

      // Vérification des headers
      if (!appToken || !clientId) {
         res.status(401).json({ message: 'App-Token ou Client-Id manquant.' });
      }

      // Vérification des credentials
      const expectedAppToken = process.env.BROKER_APP_TOKEN;
      const expectedClientId = process.env.BROKER_CLIENT_ID;

      if (appToken !== expectedAppToken || clientId !== expectedClientId) {
         res.status(403).json({ message: 'Accès interdit : token ou ID invalide.' });
      }

      // Vérifie la capacité du port
      const boats = await boatService.getAllBoats();
      if (boats.length >= 10) {
         res.status(400).json({ message: 'Port plein. Impossible de dock un nouveau bateau.' });
      }

      // Ajout du bateau
      const boat: Boat = req.body;
      const createdBoat = await boatService.addBoat(boat);

      res.status(201).json({ message: 'Bateau docké avec succès.', boat: createdBoat });
    } catch (error) {
      next(error);
    }
  }

}

