import { OTP } from "../../../domain1/entities/OTP";

export interface OtpModelInter{
    create(otpDoc:OTP):Promise<void>;
    findByEmail(email:string):Promise<OTP | null>;
    updateStatus(email:string):Promise<void>;
}