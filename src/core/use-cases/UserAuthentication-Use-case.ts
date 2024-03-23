import { CustomError } from "../../../utils/CustomError";
import { PasswordUtil } from "../../../utils/PasswordUtils";
import { User } from "../entities/User";
import { UserRepository } from './user-repository'; 


export class UserAuthentication{
    constructor(private readonly userRepository : UserRepository) {}

    async signup(email: string, password: string): Promise<User> {
        const existingUser  = await this.userRepository.findByEmail(email);
        if(existingUser){
            throw new CustomError('Username already exists',409);
        }
        const hashedPassword = await PasswordUtil.HashPassword(password)

        const newUser = new User(null,email,hashedPassword);
        return await this.userRepository.save(newUser);
    }

    async login(email: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findByEmail(email);
        
        if(!user) {
           throw new CustomError('No user Found',404);
        }
        const isValidPassword = await PasswordUtil.ComparePasswords(password, user.password);
        if (!isValidPassword) {
            return null; // Invalid Password
        }
        return user;

    }
}