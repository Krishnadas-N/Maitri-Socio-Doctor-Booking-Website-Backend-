import { OTP } from "../../entities/OTP";

export interface OTPRepository{
    findByOwnerAndCode(email:string,code:string):Promise<OTP | null>;
    save(otp:OTP):Promise<OTP>
}