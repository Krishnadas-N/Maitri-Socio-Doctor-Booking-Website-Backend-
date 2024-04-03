import { User } from "../../entities/User";

export interface UserRepository {
    findByEmail(email:string):Promise <User | null>;
    save(user:User): Promise<User> ;
    getUser(userId:string):Promise<User>;
    markAsVerified(email:string):Promise<void>;
    setResetToken(email: string): Promise<void>;
    findResetTokenAndSavePassword(token: string, password: string): Promise<void>;
}