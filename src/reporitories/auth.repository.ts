import { and, eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { todos, users } from '../db/schema';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/connection';
import { User, userDTO } from '../types/UserType.types'
export class AuthRepository {

async login(username: string, password: string): Promise<userDTO | null> {
console.log("Valeurs reçues dans login : ", username, password);
  const result = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.userName, username), 
        eq(users.password, password)  
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}
}