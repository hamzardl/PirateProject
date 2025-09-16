// services/jwt.service.ts
import jwt from 'jsonwebtoken';
import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import { userDTO } from '../types/UserType.types'
dotenv.config();
export async function generateToken(user: userDTO): Promise<string> {
  const payload = {
    username: user.userName,
  };

  const secretKey = process.env.SECRET_KEY;

  if (!secretKey) {
    throw new Error('SECRET_KEY is not defined in environment variables');
  }

  return jwt.sign(payload, secretKey, { expiresIn: '7d' });
}
