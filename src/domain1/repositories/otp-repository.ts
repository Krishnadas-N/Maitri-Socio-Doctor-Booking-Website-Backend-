import { CustomError } from "../../../utils/CustomError";
import { OtpModelInter } from "../../data1/interfaces/data-sources/otp-data-source";
import { OTP } from "../entities/OTP";
import { OTPRepository } from "../interfaces/repositories/OTP-Repository";
import verifyEmailTemplate from '../../../templates/verifyEmailTamplate'
import MailService from "../../../config/node-mailer";

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

    generateOTP(): string {
        return Math.floor(10000+Math.random() * 900000).toString();
    }

    async sendOTP(email:string,otp:string):Promise<void>{
        
        try {
            await this.sendOtpTOMail(email,otp);
            const otpDocument: OTP = {
                email: email,
                otp: otp,
                status: 'NOTUSED',
                validFor:60,
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 60 * 1000), 
            };
            await this.save(otpDocument);
        } catch (error) {
            console.error('Error sending OTP:', error);
            throw new CustomError('Error sending OTP', 500); 
        }
    }
    async resendOtp(email: string): Promise<void> {
        const newOTP = this.generateOTP();
        try {
            const existingOTP = await this.otpDataSource.findByEmail(email);
            if (existingOTP) {
                existingOTP.otp = newOTP;
                await this.save(existingOTP);
            } else {
                // If no existing OTP, create a new one
                const otpDocument: OTP = {
                    email: email,
                    otp: newOTP,
                    status: 'NOTUSED',
                    createdAt: new Date(),
                    validFor:60,
                    expiresAt: new Date(Date.now() + 60 * 1000),
                };
                await this.save(otpDocument);
            }
            await this.sendOtpTOMail(email,newOTP);
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
}