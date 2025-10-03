import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authToken.middleware'; 

export const isAdminRequired = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  console.log("voici isAdmin");
  console.log(!req.user?.isAdmin);
  if (!req.user?.isAdmin) {
     res.status(403).json({ message: 'Access only for admins' });
  }
  next();
};
