import { CustomError } from "../../../../utils/CustomError";
import { PasswordUtil } from "../../../../utils/PasswordUtils";
import { generateToken, verifyToken } from "../../../../utils/tokenizeData-Helper";
import { LoginResponse } from "../../../models/docotr-authenticationModel";
import Doctor from "../../entities/Doctor";
import { IDoctorsRepository } from "../../interfaces/repositories/Doctor-Repository";
import { OTPRepository } from "../../interfaces/repositories/OTP-Repository";
import { DoctorService } from "../../interfaces/use-cases/Doctor-Service/authentication/doctor-authentication";



export class DoctorAuthUseCaseImpl implements DoctorService{
    constructor(private doctorRepository:IDoctorsRepository,private readonly otpRepository: OTPRepository){}
    
    async registerBasicInfoUseCase(doctorData: Partial<Doctor>): Promise<string> {
        try {
            const requiredFields:Array<keyof Partial<Doctor>> = ['firstName', 'lastName', 'email', 'phone', 'gender', 'dateOfBirth', 'password'];
            for (const field of requiredFields) {
                if (!doctorData[field]) {
                    throw new CustomError(`Missing ${field}`, 406);
                }
            }
        if(doctorData.email){
        const isDoctorExists = await this.doctorRepository.findDoctorByEmail(doctorData.email);
        if (isDoctorExists && isDoctorExists.isVerified === true) {
            throw new CustomError("This Email is already Exists, Please Login", 409);
        }else{
            if(!isDoctorExists){
                await this.doctorRepository.saveBasicInfo(doctorData);
            }
            const otp = this.otpRepository.generateOTP();
            console.log(otp);
           const otpId = await this.otpRepository.sendOTP(doctorData.email,otp);
            console.log("OTP sent successfully");
            console.log("Otp data Saved in datbase");
            const token  = await generateToken(otpId);
            return token;
        } 
        }else{
            throw new CustomError("Missing Email Field ",406)
        }
    } catch (error:any) {
        if (error instanceof CustomError) {
            throw error; 
        } else {
            console.error("An unexpected error occurred:", error);
            throw new CustomError(error.message||"An unexpected error occurred.", 500);
        }
    }
    }

    async registerProfessionalInfoUseCase(doctorData: Partial<Doctor>,token:string): Promise<Partial<Doctor> | null> {
        try {
            const data = await verifyToken(token);
            console.log(data)
            return await this.doctorRepository.saveProfessionalInfo(doctorData,data.data);
        }catch (error:any) {
                if (error instanceof CustomError) {
                    throw error; 
                } else {
                    console.error("An unexpected error occurred:", error);
                    throw new CustomError(error.message||"An unexpected error occurred.", 500);
                }
            }
        }
        

    async RegisterAdditionalInfoUseCase(doctorData: Partial<Doctor>,token:string): Promise<Partial<Doctor> | null> {
        try {
            const email = await verifyToken(token);
           return await this.doctorRepository.saveAdditionalInfo(doctorData,email);
        }catch (error:any) {
                if (error instanceof CustomError) {
                    throw error; 
                } else {
                    console.error("An unexpected error occurred:", error);
                    throw new CustomError(error.message||"An unexpected error occurred.", 500);
                }
            }
        
    }
   
    
    async login(email: string, password: string): Promise<LoginResponse | null> {
        try {
            const doctor=await this.doctorRepository.findDoctorByEmail(email);
            if(!doctor){
                throw new CustomError("Invalid Crenditials",404);
            }
            if(!doctor.isVerified){
                throw new CustomError("User is Not Verified",403)
            }
            const isValidPassword = await PasswordUtil.ComparePasswords(password, doctor.password);
            if (!isValidPassword) {
                throw new CustomError('Invalid password',409);          
            }
            console.log(email,password);
            const token  = await generateToken({_id:doctor._id,role:'doctor'});
            return {doctor,token};
        }catch (error:any) {
                if (error instanceof CustomError) {
                    throw error; 
                } else {
                    console.error("An unexpected error occurred:", error);
                    throw new CustomError(error.message||"An unexpected error occurred.", 500);
                }
            }
    }
    async forgotPassword(email: string): Promise<void> {
        try {
           if(!email){
               throw new CustomError('Email is Not Found',404)
           }
          return this.doctorRepository.setResetToken(email);
       } catch (error:any) {
           if (error instanceof CustomError) {
               throw error;
           }
           throw new CustomError(error.message || 'Error In forgotPassword', 500);
       }
       }
   
      async  setResetPassword(token: string, password: string): Promise<void> {
       try {
           if(!token || password){
               throw new CustomError('Token or Password  is not provided',400);
           }
           await this.doctorRepository.findResetTokenAndSavePassword(token,password);
       } catch (error:any) {
           if (error instanceof CustomError) {
               throw error;
           }
           throw new CustomError(error.message || 'Error In forgotPassword', 500);
       }
      }
   
}