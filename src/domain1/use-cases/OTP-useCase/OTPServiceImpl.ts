import { OTPService } from "../../interfaces/use-cases/OTP-SERVICE/OTPService";
import { OTPRepository } from "../../interfaces/repositories/OTP-Repository";
import { OTP } from "../../entities/OTP";
import { CustomError } from "../../../../utils/CustomError";



export class OTPServiceImpl implements OTPService{
    constructor( private readonly otpRepository:OTPRepository) {}
 
    async verifyOTP(email: string, code: string): Promise<boolean> {
        const otp = await this.otpRepository.findByOwnerAndCode(email, code);
        console.log("Log from use case VerifyOtp");
        console.log(otp);
        if(!otp){
            throw new CustomError('Invalid Email',404)
        }
        const currentTime = new Date().getTime();
        const createdAtTime = otp.createdAt.getTime()
        const elapsedTime = currentTime - createdAtTime; 
        const validForMs = otp.validFor * 1000; 
        if (elapsedTime > validForMs) {
            throw new CustomError('OTP has expired', 400);
        }
        return otp.otp === code;
    }
    async resendOtp(email: string): Promise<void> {
        console.log("Log from use case resend otp");
        console.log(email);
        this.otpRepository.resendOtp(email);
    }


}