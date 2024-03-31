import { OTP } from "../../../domain1/entities/OTP";

export interface OtpModelInter{
    create(otpDoc:OTP):Promise<string>;
    findByEmail(code:string):Promise<OTP | null>;
    updateStatus(email:string):Promise<void>;
    findById(id: string) : Promise <OTP | null> ; 
}