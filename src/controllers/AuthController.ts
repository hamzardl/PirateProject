import { Request, Response, NextFunction } from 'express';
import { User } from '../types/UserType.types'
import { userDTO } from '../types/UserType.types'
import { AuthService } from '../services/auth.service';
import { generateToken } from '../services/JWT.service';

const authService = new AuthService();

export class AuthController {
 login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log("Je suis dans le login");  // Affiche un message pour indiquer que la fonction est appelée
      const { username, password } = req.body;
     console.log("Valeurs reçues dans login : ", username, password);
      // Essaye de trouver l'utilisateur
      const user: userDTO | null = await authService.login(username, password);
      console.log(user);  // Affiche l'utilisateur trouvé ou null

      if (!user) {
        // Si l'utilisateur n'est pas trouvé, retourne un message d'erreur et false
        res.status(401).json({ success: false, error: 'User not found or invalid credentials' });
        return;
      }

      console.log("Je génère le token");  // Affiche la génération du token

      // Génération du token JWT
      const token = await generateToken(user);
console.log(token);
      // Configuration des cookies avec le token
      res.cookie('AuthToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
      });

      // Si la connexion est réussie, retourne true avec un code 200
      res.status(200).json({ success: true, message: "Login successful" });

    } catch (error) {
      next(error);  // Passe l'erreur à la gestion des erreurs
    }
  };
}
