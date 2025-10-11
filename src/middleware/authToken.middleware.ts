import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error('JWT_SECRET_KEY is not defined in environment variables');
}
// The role is represented by a boolean name Isadmin
export interface AuthenticatedRequest extends Request {
  user?: { 
    username: string;
    isAdmin: boolean;
  };
}
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  let token: string | undefined;

  if (req.cookies?.AuthToken) {
    token = req.cookies.AuthToken;
  } 
  if (!token) {
    res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    return;
  }
try {
  const decoded = jwt.verify(token, SECRET_KEY) as { username: string; isAdmin: boolean };
  req.user = {
    username: decoded.username,
    isAdmin: decoded.isAdmin,
  };
  return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ success: false, message: 'Invalid token format.' });
    } else {
      res.status(403).json({ success: false, message: 'Token verification failed.' });
    }
  }
};
