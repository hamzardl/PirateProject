import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error('JWT_SECRET_KEY is not defined in environment variables');
}

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
  /* moi j'utilsie que un cookies donc pas de header 
  else {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.headers['x-access-token']) {
      token = req.headers['x-access-token'] as string;
    }
  }
*/
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
