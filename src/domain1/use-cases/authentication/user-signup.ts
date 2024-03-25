import { CustomError } from "../../../../utils/CustomError";
import { User } from "../../entities/User";
import { UserRepository } from "../../interfaces/repositories/user-Authentication"; 
import { OTPService } from "../../interfaces/use-cases/OTP-SERVICE/OTPService";
import { UserSignup } from "../../interfaces/use-cases/authentication/user-sigup";

type UserWithoutId = Omit<User,'_id'>
export class userSignup implements UserSignup{
    constructor( private userRepository:UserRepository,private readonly otpService: OTPService){
    }
    
    async execute(user: UserWithoutId): Promise<string | null> {
        console.log("Log from use cases (userSignup)");
        const userIsExist = await this.userRepository.findByEmail(user.email);
        if (userIsExist) {    
            throw new CustomError('User Already Exists',409);                    
        }else{
        const savedUser =  await this.userRepository.save(user);
        const otp = this.otpService.generateOTP();
        await this.otpService.sendOTP(savedUser.email,otp);
        return otp
        }
    }
}