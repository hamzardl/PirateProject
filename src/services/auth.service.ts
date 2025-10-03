import { AuthRepository } from '../reporitories/auth.repository';
import { v4 as uuidv4 } from 'uuid';
import { User, userDTO } from '../types/UserType.types';

const userRepository = new AuthRepository();

export class AuthService {

  async login(username: string, password: string): Promise<userDTO | null> {
    const users= await userRepository.login(username, password);
    if (!users) {
      throw new Error('Invalid username or password');
    }
    return users;
}
async register(username: string, password: string): Promise<void> {
  const userExists = await this.VerifyExistingUser(username); 
  if (userExists) {
    throw new Error('user already exist');
  } else {
    await userRepository.register(username, password);
  }
}

async VerifyExistingUser(username: string):Promise<boolean>{
     const userExists = await userRepository.VerifyExistingUser(username);
     return userExists;
}

}

