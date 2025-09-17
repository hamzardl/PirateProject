import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { TokenRecord } from '../types/token.type'; // adapte aussi si besoin
import { userDTO } from '../types/UserType.types'; // adapte
import { TokenRepository } from '../reporitories/token.repository';
const tokenRepository = new TokenRepository();
export async function generateToken(user: userDTO): Promise<string> {
  const payload = {
    username: user.userName,
  };

  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    throw new Error('SECRET_KEY is not defined in environment variables');
  }

  // Générer le token JWT
  const token = jwt.sign(payload, secretKey, { expiresIn: '7d' });

  // Définir les dates
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 jours

  // Créer le TokenRecord
  const tokenData: TokenRecord = {
    id: uuidv4(),
    username: user.userName,
    token: token,
    issued_at: now,
    expires_at: expiresAt,
    revoked: false,
    created_at: now,
    updated_at: now,
  };

  // Insérer dans la base de données
  await tokenRepository.insertToken(tokenData);

  console.log("Token généré et stocké en base");

  return token;
}
