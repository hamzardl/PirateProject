import jwt from 'jsonwebtoken';
import { userDTO } from '../types/UserType.types';

export async function generateToken(user: userDTO): Promise<string> {
  // We build the payload with key user information (username and isAdmin) that we are using in the middleware as a verficationof token
  const payload = {
    username: user.userName,
    isAdmin:user.isAdmin
  };
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    throw new Error('JWT_SECRET_KEY is not defined in environment variables');
  }
  const token = jwt.sign(payload, secretKey, { expiresIn: '7d' });
  return token;
}