import { Request, Response, NextFunction } from 'express';
import { BoatService } from '../services/boat.service';
import { Boat, BoatRequest, BoatRequestUpdate } from '../types/boat.types';
import { AuthenticatedRequest } from '../middleware/authToken.middleware';
import axios from 'axios';

const boatService = new BoatService();
const headers = JSON.parse(process.env.HEADERS!);
export class BoatController {
    getAllBoats = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const boats = await boatService.getAllBoats();
      res.status(200).json(boats);
    } catch (error) {
      next(error);
    }
  };

  addBoat = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const boat: BoatRequest = req.body;
    try {
      const createdBoat = await boatService.addBoat(boat); 
      res.status(201).json(createdBoat);
    } catch (error) {
      next(error);
    }
  };
     deleteBoat = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    try {
      await boatService.deleteBoat(id);
      res.status(200).json({ message: `Boat ${id} deleted.` });
    } catch (error) {
      next(error);
    }
  };

  modifyBoat = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
     const { id } = req.params;
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
 
  navigateToAnotherPort= async (req: Request, res: Response) => {
    try {
      const destination = req.params.destination;
      const boat = req.body;
      const response = await boatService.sendBoatToDestination(destination, boat);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: 'Error whiling sailing' });
    }
  }
  getAvailablePorts=async (req: Request, res: Response): Promise<void> => {
    try {
      const ports = await boatService.getAvailablePortsFromBroker();
      res.status(200).json({ ports });
    } catch (error) {
      res.status(500).json({ message: 'Error server : impossible to get the ports availables' });
    }
  }
 
async getBoatsOnPort(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const clientId = req.headers['x-client-id'];
    const appTokens = req.headers['authorization'];
    const boat: BoatRequest = req.body;
    console.log(boat);
    if (!appTokens || !clientId) {
      return res.status(401).json({ message: 'App-Token ou Client-Id missed.' });
    }
    const token = appTokens.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token mal formé.' });
    }
    if (clientId !== headers['x-client-id'] || appTokens !== headers['authorization']) {
      return res.status(403).json({ message: 'Forbidden access : token ou ID invalid.' });
    }
    const boats = await boatService.getAllBoats();
    if (boats.length >= 8) {
      return res.status(400).json({ message: 'full ports.impossible the boat dock.' });
    }
    const createdBoat = await boatService.addBoat(boat);
    return res.status(201).json({ message: 'Boat successfully docked..', boat: createdBoat });
  } catch (error) {
    next(error);
  }
}



}

