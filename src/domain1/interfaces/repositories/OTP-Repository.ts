import { OTP } from "../../entities/OTP";

export interface OTPRepository{
    findByOwnerAndCode(email:string,code:string):Promise<OTP | null>;
    save(otp:OTP):Promise<OTP>
    generateOTP():string;
    sendOTP(email:string,otp:string):Promise<void>;
    resendOtp(email:string):Promise<void>;
}