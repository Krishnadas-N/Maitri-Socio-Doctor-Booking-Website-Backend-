import { CustomError } from "../../../utils/CustomError";
import { OtpModelInter } from "../../data/interfaces/data-sources/otp-data-source";
import { OTP } from "../entities/OTP";
import { OTPRepository } from "../interfaces/repositories/OTP-Repository";
import verifyEmailTemplate from '../../../templates/verifyEmailTamplate'
import MailService from "../../../config/node-mailer";

export class OTPRepsositoryImpl implements OTPRepository{
    constructor(private otpDataSource:OtpModelInter){}

    async findByOwnerAndCode( code: string): Promise<OTP | null> {
            const otpDoc = await this.otpDataSource.findByEmail(code);
            if (!otpDoc) {
                throw new CustomError('OTP does not exist or has expired', 404);
            }  
            if (otpDoc.otp !== code) {
                throw new CustomError('Incorrect OTP', 409);
            }
            return otpDoc;

    }

    async save(otp: OTP): Promise<string> {
        
        const otpId =  await this.otpDataSource.create(otp);
        console.log(otpId)
        return otpId;
    }

    generateOTP(): string {
        let otp = Math.floor(100000 + Math.random() * 900000).toString();
        if (otp.length < 6) {
            otp = otp.padStart(6, '0');
        }
        return otp;
    }

    async sendOTP(email:string,otp:string):Promise<string>{
        
        try {
            await this.sendOtpTOMail(email,otp);
            console.log("otp Send SuccessFully");
            
            const otpDocument: OTP = {
                email: email,
                otp: otp,
                status: 'NOTUSED',
                validFor:60,
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 60 * 1000), 
            };
           const otpId =  await this.save(otpDocument);
            return otpId;
        } catch (error) {
            console.error('Error sending OTP:', error);
            throw new CustomError('Error sending OTP', 500); 
        }
    }
    async resendOtp(otpId: string): Promise<void> {
        const newOTP = this.generateOTP();
        console.log("\nNew Resend Otp generated",newOTP);
        try {
            const existingOTP = await this.otpDataSource.findById(otpId);
            console.log(existingOTP,"\nexistingOTP")
            if(!existingOTP){
                throw new CustomError('Invalid token or Otp Expires Please Register again',423);
            }
            if (existingOTP) {
                
                existingOTP.otp = newOTP;
                existingOTP.validFor=60;
                existingOTP.createdAt = new Date();
                existingOTP.expiresAt = new Date(Date.now() + 60 * 60 * 1000);  // Add extra 2 minutes to the Expiry time for any retry of OTP
                await this.save(existingOTP);
                await this.sendOtpTOMail(existingOTP.email,newOTP);
            } 
            
        } catch (error) {
            console.error('Error resending OTP:', error);
            throw new CustomError('Error resending OTP', 500); 
        }
    }

    private async sendOtpTOMail(email:string, newOTP:string):Promise<void>{
        const emailTemplate = verifyEmailTemplate(newOTP);
        const mailService = MailService.getInstance();
        try{
            await mailService.createConnection();
            await mailService.sendMail('X-Request-Id-Value', { 
                to: email,
                subject: 'Verify OTP',
                html: emailTemplate.html,
            });
        }catch(error){
            console.error('Error resending OTP:', error);
            throw new CustomError('Error resending OTP', 500); 
        }
    }
    async markAsUsed(email: string): Promise<void> {
        try{
      await this.otpDataSource.updateStatus(email)
    }catch(error:any){
        console.error('Error in Update the status OTP:', error);
        throw new CustomError(error.message || 'Error updating OTP status', 500);
    }
    }
}