import { OTP } from "../../entities/OTP";

export interface OTPRepository{
    findByOwnerAndCode(code:string):Promise<OTP | null>;
    save(otp:OTP):Promise<string | null>
    generateOTP():string;
    sendOTP(email:string,otp:string):Promise<string | null>;
    resendOtp(token:string):Promise<void>;
    markAsUsed(email:string):Promise<void>;
}