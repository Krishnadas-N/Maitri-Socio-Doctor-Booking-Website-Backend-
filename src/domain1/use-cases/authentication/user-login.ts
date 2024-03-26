import { CustomError } from "../../../../utils/CustomError";
import { PasswordUtil } from "../../../../utils/PasswordUtils";
import { User } from "../../entities/User";
import { UserRepository } from "../../interfaces/repositories/user-Authentication"; 
import { UserLogin } from "../../interfaces/use-cases/authentication/user-login"; 


export class userLogin implements UserLogin{
    userRepository: UserRepository;
    constructor(userRepo : UserRepository) {
        this.userRepository = userRepo;
    }
    
    async execute(email: string, password: string): Promise<User | null>  {   
        console.log("Log from use cases (userLogin)");     
        const user = await this.userRepository.findByEmail(email);
        console.log(user);  
        if (!user) {    
            throw new CustomError('No user Found',404);                    
        }
        if(!user.isVerified){
            throw new CustomError("User is Not Verified",403)
        }
        const isValidPassword = await PasswordUtil.ComparePasswords(password, user.password);
        if (!isValidPassword) {
            throw new CustomError('Invalid password',409);          
        }
        return  user;
    }  
}