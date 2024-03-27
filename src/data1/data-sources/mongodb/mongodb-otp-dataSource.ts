import otpModel from "./models/otp-Model";
import { OtpModelInter } from "../../interfaces/data-sources/otp-data-source";
import { OTP } from "../../../domain1/entities/OTP";

export class MongoDbOtpDataSource implements OtpModelInter{
    constructor(){}
         async create(otpDoc: OTP): Promise<void> {
            try {
                console.log(otpDoc);
                const existingOTP = await otpModel.findOne({ email: otpDoc.email });
                if(existingOTP){
                    await otpModel.findOneAndUpdate({ email: otpDoc.email }, otpDoc);
                }
                const otp = new otpModel(otpDoc);
                await otp.save();
                return
            } catch (error) {
                console.error("Error saving OTP:", error);
                throw error;
            }
        }

        async findByEmail(email: string): Promise<OTP | null> {
            try {
                const otpDoc = await otpModel.findOne({ email }).exec();
                return otpDoc ? otpDoc.toObject() as OTP : null;
            } catch (error) {
                console.error("Error finding OTP by email:", error);
                throw error;
            }
        }
        async updateStatus(email:string):Promise<void>{
            try {
              await otpModel.updateOne({ email },{$set:{status:'USED'}});
            } catch (error) {
                console.error("Error finding OTP by email:", error);
                throw error;
            }
        }
    
}