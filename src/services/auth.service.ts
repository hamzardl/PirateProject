import { AuthRepository } from '../reporitories/auth.repository';
import { v4 as uuidv4 } from 'uuid';
import { User, userDTO } from '../types/UserType.types';

const userRepository = new AuthRepository();

export class AuthService {

  async login(username: string, password: string): Promise<userDTO | null> {
    console.log("je suis dans le service");
    console.log(username,password);
    const users= await userRepository.login(username, password);
    if (!users) {
      throw new Error('Invalid username or password');
    }
    return users;
}
}

