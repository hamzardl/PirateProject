import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authToken.middleware'; 
/* with req.user?.isAdmin, we check if the user (attached to req.user) 
has the isAdmin property set to true */
  export const isAdminRequired = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user?.isAdmin) {
      res.status(403).json({ message: 'Access only for admins' });
    }
    next();
  };
