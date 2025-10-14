import { and, eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import {  users } from '../db/schema';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/connection';
import { User, userDTO } from '../types/UserType.types';
import bcrypt from 'bcrypt';

export class AuthRepository {

async login(username: string, passwordHashed: string): Promise<userDTO | null> {
  const result = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.userName, username),
        eq(users.password, passwordHashed)
      )
    )
    .limit(1);

  if (!result[0]) {
    return null;
  }

  return result[0];
}

async getUserByUsername(username: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.userName, username))
    .limit(1);
  
  if (!result[0]) {
    return null; 
  }
  return result[0];
}

async register(username: string, passwordHashed: string): Promise<void>  {
  await db.insert(users).values({
  userName: username,
  password: passwordHashed
  });
}
}