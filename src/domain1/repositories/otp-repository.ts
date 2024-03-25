import { CustomError } from "../../../utils/CustomError";
import { OtpModelInter } from "../../data1/interfaces/data-sources/otp-data-source";
import { OTP } from "../entities/OTP";
import { OTPRepository } from "../interfaces/repositories/OTP-Repository";


export class OTPRepsositoryImpl implements OTPRepository{
    constructor(private otpDataSource:OtpModelInter){}

    async findByOwnerAndCode(email: string, code: string): Promise<OTP | null> {
            const otpDoc = await this.otpDataSource.findByEmail(email);
            if (!otpDoc) {
                throw new CustomError('OTP does not exist or has expired', 404);
            }  
            if (otpDoc.otp !== code) {
                throw new CustomError('Incorrect OTP', 409);
            }
            return otpDoc;

    }

    async save(otp: OTP): Promise<OTP> {
        return await this.save(otp)
    }
}