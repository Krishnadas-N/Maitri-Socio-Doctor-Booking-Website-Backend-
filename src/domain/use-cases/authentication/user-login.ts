import { CustomError } from "../../../../utils/CustomError";
import { PasswordUtil } from "../../../../utils/PasswordUtils";
import { generateToken } from "../../../../utils/tokenizeData-Helper";
import { User } from "../../entities/User";
import { UserRepository } from "../../interfaces/repositories/user-IRepository"; 
import { UserLogin } from "../../interfaces/use-cases/authentication/user-login"; 


export class userLogin implements UserLogin{
    userRepository: UserRepository;
    constructor(userRepo : UserRepository) {
        this.userRepository = userRepo;
    }
    
    async execute(email: string, password: string): Promise<string | null>  {   
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
        console.log(email,password);
        const token  = await generateToken({_id:user._id,role:'user'});
        return  token;
    }  
}