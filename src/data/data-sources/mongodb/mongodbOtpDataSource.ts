import {otpModel} from "./models/otpModel";
import { OtpModelIDataSource } from "../../interfaces/data-sources/otpIDataSource";
import { OTP } from "../../../domain/entities/OTP";
import { CustomError } from "../../../utils/customError";

export class MongoDbOtpDataSource implements OtpModelIDataSource{
    constructor(){}
    async create(otpDoc: OTP): Promise<string> {
        try {
            console.log(otpDoc);
            const existingOTP = await otpModel.findOne({ email: otpDoc.email });
            if (existingOTP) {
                await otpModel.findOneAndUpdate({ email: otpDoc.email }, otpDoc);
                return existingOTP._id.toString(); // Return the ID of the existing OTP document
            } else {
                const otp = new otpModel(otpDoc);
                const savedOTP = await otp.save();
                return savedOTP._id.toString(); // Return the ID of the newly created OTP document
            }
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }
    

        async findByEmail(otp: string): Promise<OTP | null> {
            try {
                const otpDoc = await otpModel.findOne({ otp:otp }).exec();
                return otpDoc ? otpDoc.toObject() as OTP : null;
            } catch (error) {
                console.error("Error finding OTP by email:", error);
                throw error;
            }
        }
        async findById(id: string): Promise<OTP | null> {
            try {
                console.log(id);
                const otpDoc = await otpModel.findById(id).exec();
                console.log(otpDoc);
                return otpDoc ? otpDoc.toObject() as OTP : null;
            } catch (error:unknown) {
                if (error instanceof CustomError) {
                    throw error;
                } else {
                    const castedError = error as Error
              console.error('Unexpected error:', error);
              throw new CustomError(castedError.message || 'Internal server error',500);
                }
            }
        }
        
        async updateStatus(email:string):Promise<void>{
            try {
              await otpModel.updateOne({ email },{$set:{status:'USED'}});
            }catch (error:unknown) {
                if (error instanceof CustomError) {
                    throw error;
                } else {
                    const castedError = error as Error
              console.error('Unexpected error:', error);
              throw new CustomError(castedError.message || 'Internal server error',500);
                }
            }
        }
    
}