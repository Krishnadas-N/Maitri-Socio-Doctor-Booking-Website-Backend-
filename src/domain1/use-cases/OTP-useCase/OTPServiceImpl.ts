import { OTPService } from "../../interfaces/use-cases/OTP-SERVICE/OTPService";
import { OTPRepository } from "../../interfaces/repositories/OTP-Repository";
import { OTP } from "../../entities/OTP";
import { CustomError } from "../../../../utils/CustomError";



export class OTPServiceImpl implements OTPService{
    constructor( private readonly otpRepository:OTPRepository) {}
    generateOTP(): string {
        return Math.floor(10000+Math.random() * 900000).toString();
    }

    async sendOTP(email:string,otp:string):Promise<void>{

        const otpDocument:OTP={
            email:email,
            otp:otp,
            status:'NOTUSED',
            createdAt:new Date(),
            expiresAt: new Date(Date.now()*60*1000)
        }
        await this.otpRepository.save(otpDocument)
    }
    async verifyOTP(email: string, code: string): Promise<boolean> {
        const otp = await this.otpRepository.findByOwnerAndCode(email, code);
        if(!otp){
            throw new CustomError('Invalid Email',404)
        }
        return otp.otp===code;
    }

}