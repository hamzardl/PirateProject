import { Router } from 'express';
import { BoatController } from '../controllers/boat.controller';
import { authenticateToken } from '../middleware/authToken.middleware';
import { AuthController } from '../controllers/AuthController';
export const createBoatRoutes = (): Router => {
  
  const boatController  = new BoatController();
  const authController = new AuthController();

  const router = Router();
//exemple pour un autorize pour vérifier le token
// Ensuite, tu peux utiliser ce middleware dans tes routes comme ceci :
  router.get('/boats', boatController.getAllBoats);
  router.post('/boat', boatController.addBoat);
  router.delete('/boat/:id',boatController.deleteBoat);
  router.patch('/boat/:id', boatController.modifyBoat);
  router.post('/auth', authController.login);
  return router;
};