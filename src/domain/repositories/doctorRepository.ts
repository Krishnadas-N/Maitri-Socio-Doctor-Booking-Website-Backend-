import MailService from "../../config/node-mailer"; 
import resetPasswordLink from "../../templates/changePasswordTemplate"; 
import confrimationEmailTemplate from "../../templates/confimrationEmailTemplate"; 
import { CustomError } from "../../utils/customError"; 
import { generateRandomToken } from "../../utils/tokenizeDataHelper"; 
import { IDoctorModelIDataSource } from "../../data/interfaces/data-sources/doctorIDataSources";
import Doctor, { Follower, Review } from "../entities/Doctor";
import { IDoctorRepository } from "../interfaces/repositoryInterfaces/doctorIRepository"; 
import { DashBoardDataResponse } from "../../models/doctors.model";

export class IDoctorRepositoryImpl  implements IDoctorRepository {

    constructor(private  doctorDataSource:IDoctorModelIDataSource){}

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

    async findDoctorByEmail(email: string): Promise<Doctor | null> {
        try {
            const result = await this.doctorDataSource.findByEmail(email);
            return result ? result : null;
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
    

    async findDoctorById(id: string): Promise<Doctor | null> {
        try{
            if(!id){
                throw new CustomError('Invalid Id',400);
            }
           const doctor = await this.doctorDataSource.findById(id);
           return  doctor?doctor:null;
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

    async saveBasicInfo(doctor: Partial<Doctor>): Promise<string> {
        try{
            const doctorId = await this.doctorDataSource.DbsaveBasicInfo(doctor);
            return doctorId
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

    async saveAdditionalInfo(doctor: Partial<Doctor>, doctorId: string): Promise<Partial<Doctor> | null> {
        try{
         return  await this.doctorDataSource.DbsaveAdditionalInfo(doctor, doctorId);
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

    async saveProfessionalInfo(doctor: Partial<Doctor>, doctorId: string): Promise<Partial<Doctor> | null> {
        try{
            console.log(doctorId,doctor,"comsole from reposootory profrssional info")
            return await this.doctorDataSource.DbsaveProfessionalInfo(doctor, doctorId);
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

  

    async changeProfilePic(doctorId:string,image:string):Promise<void>{
        try {
            await this.doctorDataSource.changeProfilePic(doctorId,image);
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

    async saveSelectedSlots(doctorId: string, selectedSlots: { date: Date; slots: string[]; }[]): Promise<Doctor> {
        try {
            return await this.doctorDataSource.saveSelectedSlots(doctorId, selectedSlots);
        } catch (error) {
            // Handle error
            console.error("Error in saving selected slots:", error);
            throw error;
        }
    }

    // async getBookedSlots(date: Date): Promise<string[]> {
    //     return await this.doctorDataSource.getBookedSlots(date);
    // }




 
    async getSimilarProfiles(specializationId: string): Promise<Doctor[]> {
        return await this.doctorDataSource.getSimilarProfiles(specializationId);
    }

   async followOrUnfollowDoctors(doctorId: string, userId: string, userType: "Doctor" | "User"): Promise<Follower[]> {
        return await this.doctorDataSource.followOrUnfollowDoctors(doctorId,userId,userType)
    }

    async addReview(appoinmentId: string, userId: string, rating: number, comment: string): Promise<Review> {
        return await this.doctorDataSource.addReview(appoinmentId,userId,rating,comment)
    }

   async getDoctorDashboardDetails(doctorId: string): Promise<DashBoardDataResponse> {
        return await this.doctorDataSource.getDoctorDashboardDetails(doctorId)
    }

   async getReviewsOfDoctor(doctorId: string): Promise<Review[]> {
        return await this.doctorDataSource.getReviewsOfDoctor(doctorId)
    }

    async editDoctorData(doctorId: string, doctor: Partial<Doctor>): Promise<Doctor> {
        return await this.doctorDataSource.editDoctorData(doctorId,doctor)
    }
}