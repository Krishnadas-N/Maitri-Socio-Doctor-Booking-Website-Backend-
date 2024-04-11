import { CustomError } from "../../../../utils/CustomError";
import { PasswordUtil } from "../../../../utils/PasswordUtils";
import { issueJWT } from "../../../../utils/passportUtils";
import { UserLoginResponse } from "../../../models/users.model";
import { User } from "../../entities/User";
import { UserRepository } from "../../interfaces/repositories/user-IRepository"; 
import { UserLogin } from "../../interfaces/use-cases/authentication/user-login"; 


export class userLogin implements UserLogin{
    userRepository: UserRepository;
    constructor(userRepo : UserRepository) {
        this.userRepository = userRepo;
    }
    
    async execute(email: string, password: string): Promise<UserLoginResponse | null>  {   
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
        if (user && user._id) {
            console.log(email,password);
            const tokenData = issueJWT({_id:user._id.toString(),roles: user.roles || []});
            console.log(tokenData);
            return { user, token:tokenData.token };
          }else{
            throw new CustomError('Id is not found in User',404)
          }
    }  
}