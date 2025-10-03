import { and, eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { todos, users } from '../db/schema';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/connection';
import { User, userDTO } from '../types/UserType.types';
import bcrypt from 'bcrypt';

export class AuthRepository {

async login(username: string, password: string): Promise<userDTO | null> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.userName, username)) 
    .limit(1);
  if (result.length === 0) {
    return null;
  }
  const user = result[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null; 
  }
  return result[0];
}
async VerifyExistingUser(userName: string): Promise<boolean> {
    const result = await db
    .select()
    .from(users)
    .where(eq(users.userName, userName))
    .limit(1);
    console.log("voici result ");
  return result.length > 0;
}

async register(username: string, password: string): Promise<void>  {
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);
await db.insert(users).values({
  userName: username,
  password: hashedPassword
});
}
}