import jwt from 'jsonwebtoken';
import { userDTO } from '../types/UserType.types';

export async function generateToken(user: userDTO): Promise<string> {
  const payload = {
    username: user.userName,
    isAdmin:user.isAdmin
  };
  console.log("voci playlaod ");
  console.log(user.isAdmin);
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    throw new Error('JWT_SECRET_KEY is not defined in environment variables');
  }
  const token = jwt.sign(payload, secretKey, { expiresIn: '7d' });
  return token;
}