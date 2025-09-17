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
  router.get('/boats',authenticateToken, boatController.getAllBoats);
  router.post('/boat',authenticateToken, boatController.addBoat);
  router.delete('/boat/:id',authenticateToken,boatController.deleteBoat);
  router.patch('/boat/:id',authenticateToken, boatController.modifyBoat);
  router.post('/auth', authController.login);
  router.post('/navigateToAnotherPort/:destination', boatController.navigateToAnotherPort);
  router.get('/getAvailablePorts', boatController.getAvailablePorts);
  return router;
};