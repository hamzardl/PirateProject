import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { TokenRepository } from '../reporitories/token.repository';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'Une_cle_secrete_tres_longue_et_aleatoire_pour_le_projet';
const tokenRepository = new TokenRepository();

export interface AuthenticatedRequest extends Request {
  user?: { username: string };
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;
  if (req.cookies?.AuthToken) {
    token = req.cookies.AuthToken;
  } else if (req.headers['authorization']) {
    token = req.headers['authorization'].split(' ')[1];
  } else if (req.headers['x-access-token']) {
    token = req.headers['x-access-token'] as string;
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { username: string };

    const tokenRecord = await tokenRepository.findByToken(token);
    if (!tokenRecord) {
      res.status(403).json({ success: false, message: 'Token not found.' });
      return;
    }

    if (tokenRecord.revoked) {
      res.status(403).json({ success: false, message: 'Token revoked.' });
      return;
    }

    const expiresAt = new Date(tokenRecord.expires_at);
    if (expiresAt < new Date()) {
      res.status(401).json({ success: false, message: 'Token expired.' });
      return;
    }

    req.user = { username: decoded.username };
    next();
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
