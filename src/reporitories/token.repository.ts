import { db } from '../db/connection';
import { tokenTable } from '../db/schema';
import { TokenRecord } from '../types/token.type';
import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

export class TokenRepository {
  async findByToken(token: string): Promise<TokenRecord | null> {
    const result = await db
      .select()
      .from(tokenTable)
      .where(eq(tokenTable.token, token))
    if (result.length === 0) return null;

    return result[0];
  }

  async insertToken(tokenData: TokenRecord): Promise<void> {
    await db.insert(tokenTable).values(tokenData);
  }

  async revokeToken(token: string): Promise<void> {
    await db
      .update(tokenTable)
      .set({ revoked: true })
      .where(eq(tokenTable.token, token))
  }
}
