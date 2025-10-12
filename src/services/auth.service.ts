import { AuthRepository } from '../reporitories/auth.repository';
import { v4 as uuidv4 } from 'uuid';
import { User, userDTO } from '../types/UserType.types';
import bcrypt from 'bcrypt';
const userRepository = new AuthRepository();

export class AuthService {

async login(username: string, password: string): Promise<userDTO | null> {
  const user = await userRepository.getUserByUsername(username);
  if (user == null) {
    throw new Error('Invalid username');
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }
  const usersucces=await userRepository.login(username,password);
  return user;
}
async register(username: string, password: string): Promise<void> {
  const userExists = await userRepository.getUserByUsername(username); 
  if (userExists) {
    throw new Error('user already exist');
  } else {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await userRepository.register(username, hashedPassword);
  }
}
}

