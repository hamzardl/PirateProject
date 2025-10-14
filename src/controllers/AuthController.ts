import { Request, Response, NextFunction } from 'express';
import { User } from '../types/UserType.types'
import { userDTO } from '../types/UserType.types'
import { AuthService } from '../services/auth.service';
import { generateToken } from '../services/JWT.service';
import { AuthenticatedRequest } from '../middleware/authToken.middleware';
const authService = new AuthService();
export class AuthController {
 login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username, password } = req.body;
      const user: userDTO | null = await authService.login(username, password);
      if (!user) {
        res.status(401).json({ success: false, error: 'User not found or invalid credentials' });
        return;
      }
      const token = await generateToken(user);
      res.cookie('AuthToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 30 * 60 * 1000) //expiration date is 30 minutes
      });
      res.status(200).json({ success: true, message: "Login successful" });
    } catch (error) {
      next(error); 
    }
  };

  register= async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
      const { username, password } = req.body;
        await authService.register(username, password);
            res.status(200).json({ success: true, message: "Successful creation" });
    } catch (error) {
      next(error); 
    }
  };

  getUserConnected = async (req: AuthenticatedRequest, res: Response) => {
    console.log("voici mon utilisateur connecté");
    if (!req.user) {
      return res.status(401).json({ message: 'Utilisateur non connecté' });
    }
    console.log(req.user?.username);
    return res.status(200).json({ username: req.user.username });
  };

}
