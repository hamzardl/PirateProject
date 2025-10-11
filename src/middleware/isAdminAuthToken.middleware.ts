import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authToken.middleware'; 

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
