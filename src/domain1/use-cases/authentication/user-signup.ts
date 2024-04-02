import { CustomError } from "../../../../utils/CustomError";
import { generateToken } from "../../../../utils/tokenizeData-Helper";
import { User } from "../../entities/User";
import { OTPRepository } from "../../interfaces/repositories/OTP-Repository";
import { UserRepository } from "../../interfaces/repositories/user-Authentication"; 
import { UserSignup } from "../../interfaces/use-cases/authentication/user-sigup";

type UserWithoutId = Omit<User,'_id'>
export class userSignup implements UserSignup{
    constructor( private userRepository:UserRepository,private readonly otpRepository: OTPRepository){
    }
    
    async execute(user: UserWithoutId): Promise<string | null> {
        console.log("Log from use cases (userSignup)");
        const userIsExist = await this.userRepository.findByEmail(user.email);
        if (userIsExist && userIsExist.isVerified === true) {    
            throw new CustomError('User Already Exists',409);                    
        }else{
            if(!userIsExist){
                await this.userRepository.save(user);
            }
        const otp = this.otpRepository.generateOTP();
        console.log(otp);
        const otpId= await this.otpRepository.sendOTP(user.email,otp);
        const token  = await generateToken(otpId);
        console.log("Otp data Saved in datbase")
        return token
        }
    }
}
