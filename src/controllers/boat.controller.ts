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
}

