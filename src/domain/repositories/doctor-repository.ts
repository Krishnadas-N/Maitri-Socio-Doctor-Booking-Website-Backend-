import MailService from "../../../config/node-mailer";
import resetPasswordLink from "../../../templates/changePasswordTemplate";
import confrimationEmailTemplate from "../../../templates/confimrationEmailTemplate";
import { CustomError } from "../../../utils/CustomError";
import { generateRandomToken } from "../../../utils/tokenizeData-Helper";
import { DoctorModelInter } from "../../data/interfaces/data-sources/doctor-data-source";
import Doctor from "../entities/Doctor";
import { IDoctorsRepository } from "../interfaces/repositories/Doctor-Repository";

export class IDoctorRepositoryImpl  implements IDoctorsRepository {

    constructor(private  doctorDataSource:DoctorModelInter){}

    async findDoctorByEmail(email: string): Promise<Doctor | null> {
        try {
            const result = await this.doctorDataSource.findByEmail(email);
            return result ? result : null;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error; 
            } else {
                console.error("An unexpected error occurred:", error);
                throw new CustomError(error.message || "An unexpected error occurred.", 500);
            }
        }
    }
    

    async findDoctorById(id: string): Promise<Doctor | null> {
        try{
            console.log("Entry COmess in frist ........................");
            if(!id){
                throw new CustomError('Invalid Id',400);
            }
            console.log("LOG from  doctorBY id    ",id);
           const doctor = await this.doctorDataSource.findById(id);
           return  doctor?doctor:null;
        }catch(error:any){
            if (error instanceof CustomError) {
                throw error; 
            } else {
                console.error("An unexpected error occurred:", error);
                throw new CustomError(error.message||"An unexpected error occurred.", 500);
            }   
        
    }
    }

    async saveBasicInfo(doctor: Partial<Doctor>): Promise<string> {
        try{
            const doctorId = await this.doctorDataSource.DbsaveBasicInfo(doctor);
            return doctorId
        }catch(error:any){
            if (error instanceof CustomError) {
                throw error; 
            } else {
                console.error("An unexpected error occurred:", error);
                throw new CustomError(error.message||"An unexpected error occurred.", 500);
            }   
        }
    }

    async saveAdditionalInfo(doctor: Partial<Doctor>, doctorId: string): Promise<Partial<Doctor> | null> {
        try{
         return  await this.doctorDataSource.DbsaveAdditionalInfo(doctor, doctorId);
        }catch(error:any){
        if (error instanceof CustomError) {
            throw error; 
        } else {
            console.error("An unexpected error occurred:", error);
            throw new CustomError(error.message||"An unexpected error occurred.", 500);
        }   
    }
    }

    async saveProfessionalInfo(doctor: Partial<Doctor>, doctorId: string): Promise<Partial<Doctor> | null> {
        try{
            console.log(doctorId,doctor,"comsole from reposootory profrssional info")
            return await this.doctorDataSource.DbsaveProfessionalInfo(doctor, doctorId);
            }catch(error:any){
            if (error instanceof CustomError) {
                throw error; 
            } else {
                console.error("An unexpected error occurred:", error);
                throw new CustomError(error.message||"An unexpected error occurred.", 500);
            }   
        }
    }
    async markAsVerified(email: string): Promise<void> {
        await this.doctorDataSource.verifyDoctor(email);
    }
    async setResetToken(email: string): Promise<void> {
        const user = await this.doctorDataSource.findByEmail(email);
        if (!user) {
            throw new CustomError('User is Not Found', 404);
        }
        const resetToken = await generateRandomToken();
        await this.doctorDataSource.saveResetToken(email, resetToken);
        const resetPasswordLink = `${process.env.DoctorResetPasswordLink}${resetToken}`;
        await this.sendResetPasswordLinkEmail(email, resetPasswordLink); // Updated function name
    }
    
    async findResetTokenAndSavePassword(token: string, password: string): Promise<void> {
        await this.doctorDataSource.findResetTokenAndSavePassword(token, password); 
    }

    async AcceptDoctorProfile(id: string): Promise<Doctor> {
    const doctor = await this.doctorDataSource.AcceptprofileComplete(id);
    await this.sendConfrimationEmailToDoctor(doctor.email);
    return doctor
    }
    
   async  GetDoctors(page?: number, searchQuery?: string,itemsPerPage?:number): Promise<Doctor[]> {
      return  await this.doctorDataSource.findDoctors(page,searchQuery,itemsPerPage)
    }

    async changeStatusofDoctor(id: string): Promise<Doctor> {
        return  await this.doctorDataSource.changeStatusofDoctor(id)
    }





    private async sendResetPasswordLinkEmail(email: string, resetLink: string): Promise<void> { // Updated function name
        const emailTemplate = resetPasswordLink(resetLink);
        const mailService = MailService.getInstance();
        try {
            await mailService.createConnection();
            await mailService.sendMail('X-Request-Id-Value', { 
                to: email,
                subject: 'Reset Password',
                html: emailTemplate.html,
            });
        } catch (error) {
            console.error('Error sending reset password link:', error);
            throw new CustomError('Error sending reset password link', 500); 
        }
    }

    private async sendConfrimationEmailToDoctor(email: string): Promise<void> { // Updated function name
        const emailTemplate =confrimationEmailTemplate('http://localhost:4200/doctor/login')
        const mailService = MailService.getInstance();
        try {
            await mailService.createConnection();
            await mailService.sendMail('X-Request-Id-Value', { 
                to: email,
                subject: 'Confrimation Email',
                html: emailTemplate.html,
            });
        } catch (error) {
            console.error('Error sending Confrimation Emai:', error);
            throw new CustomError('Error sending Confrimation Emai', 500); 
        }
    }

 
  


}