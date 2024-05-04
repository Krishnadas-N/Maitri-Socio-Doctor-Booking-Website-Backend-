import { CustomError } from "../../utils/customError"; 
import { PaymentModel, allowedStatuses, doctorAppoinmentsResponseModel, findDoctorsQueryParams, makeAppoinmentReqModel, userAppoinmentsResponseModel } from "../../models/consultation.model";
import { doctorsResponseModel } from "../../models/common.models";
import { Appointment } from "../entities/APPOINMENT";
import { IConsultationRepository } from "../interfaces/repositoryInterfaces/consultationIRepository"; 
import { IConsultationUsecase } from "../interfaces/use-cases/consultationIUsecase";


export class ConsultationUseCaseImpl implements IConsultationUsecase{
    constructor(
        private  readonly consultationRepo:IConsultationRepository 
    ){}

   async makeDoctorAppoinment(userId: string, doctorId: string, appoinmentData: makeAppoinmentReqModel): Promise<string> {
        try{
            if(!userId || !doctorId){
                throw new CustomError('UserId or DoctorId is not Provided',403);
            }
            if (!appoinmentData.typeofConsultaion || !['video', 'chat', 'clinic'].includes(appoinmentData.typeofConsultaion)) {
                throw new CustomError('Invalid type of consultation', 400);
            }
            const parsedBookingDate = new Date(appoinmentData.bookingDate);
            if (isNaN(parsedBookingDate.getTime())) {
                throw new CustomError('Invalid booking date', 400);
            }
    
            if (!appoinmentData.slotTime || typeof appoinmentData.slotTime !== 'string' || appoinmentData.slotTime.trim() === '') {
                throw new CustomError('Invalid slot time', 400);
            }

            return this.consultationRepo.makeDoctorAppoinment(userId,doctorId,appoinmentData)
        }catch(err:any){
            if(err instanceof CustomError){
                throw err
            }else{
                throw new CustomError(err.message ||'Error while make an appoinment',500);
            }
        }
    }

   async getAppoinmentDetails(appointmentId: string): Promise<Appointment> {
        try{
            if(!appointmentId){
                throw new CustomError('No Appoinment Id is Provided',400)
            }
            return this.consultationRepo.getAppoinment(appointmentId);
        }catch(err:any){
            if(err instanceof CustomError){
                throw err
            }else{
                throw new CustomError(err.message ||'Error while make an appoinment',500);
            }
        }
    }

    async createOrder(appointmentId: string, paymentMethod: PaymentModel): Promise<{responseId:string,keyId:string,amount:number}> {
        try {
            if (!appointmentId) {
                throw new CustomError('No Appointment Id is Provided', 400);
            }
            return await this.consultationRepo.createBookingPayment(appointmentId, paymentMethod);
        } catch (err: any) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(err.message || 'Error while making an appointment', 500);
            }
        }
    }
    
    async verifyWebhook(orderId: string, paymentId: string, razorpaySignature: string): Promise<string> {
        try {
            if (!orderId || !paymentId || !razorpaySignature) {
                throw new CustomError('No Appointment Id, Payment Id, or Razorpay Signature is Provided', 400);
            }
           return await this.consultationRepo.verifyPayment(orderId, paymentId, razorpaySignature);
        } catch (err: any) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(err.message || 'Error while verifying webhook', 500);
            }
        }
    }
   async getUsersAppoinments(userId: string,page:number,pageSize:number): Promise<userAppoinmentsResponseModel> {
        try{
            if(!userId){
                throw new CustomError('User Id is Not Provided',400)
            }
            return this.consultationRepo.getAppoinmentsOfUsers(userId,page,pageSize)
        }catch(err:any){
                if(err instanceof CustomError){
                    throw err
                }else{
                    throw new CustomError(err.message ||'Error while make an appoinment',500);
                }
            }
    }

    async getDoctorsAppoinments(doctorId: string,page:number,pageSize:number): Promise<doctorAppoinmentsResponseModel> {
        try{
            if(!doctorId){
                throw new CustomError('Doctor Id is Not Provided',400)
            }
            return this.consultationRepo.getAppoinmentsOfDoctors(doctorId,page,pageSize);
        }catch(err:any){
             if(err instanceof CustomError){
                 throw err
             }else{
                 throw new CustomError(err.message ||'Error while make an appoinment',500);
             }
         }  
    }

   async  changeAppoinmentStatus(appoinmentId: string, status: string): Promise<Appointment> {
    try{
        if(!appoinmentId){
            throw new CustomError('Appoinment Id is Not Provided',400)
        }
        if (!allowedStatuses.includes(status)) {
            throw new CustomError('Invalid appointment status', 400);
        }
        return this.consultationRepo.changeAppoinmentStatus(appoinmentId,status);
    }catch(err:any){
         if(err instanceof CustomError){
             throw err
         }else{
             throw new CustomError(err.message ||'Error while make an appoinment',500);
         }
     }  
    }

   async getDoctorAvailableSlots(doctorId: string, date: Date): Promise<string[]> {
        try{
            if(!doctorId){
                throw new CustomError('Doctor Id is Not Provided',400)
            }
            if (!(date instanceof Date && !isNaN(date.getTime()))) {
                throw new CustomError('Invalid Date', 400);
            }
            return this.consultationRepo.getAvailableSlots(doctorId,date);
        }catch(err:any){
             if(err instanceof CustomError){
                 throw err
             }else{
                 throw new CustomError(err.message ||'Error while make an appoinment',500);
             }
         }  
    }


    async getAllDoctors(queryData:findDoctorsQueryParams): Promise<doctorsResponseModel> {
        try{
            return this.consultationRepo.getDoctors(queryData);
        }catch(err:any){
             if(err instanceof CustomError){
                 throw err
             }else{
                 throw new CustomError(err.message ||'Error while make an appoinment',500);
             }
         }  
    }

    async userAppoinmentCancellation(appoinmentId: string, status: string, userId: string): Promise<Appointment> {
        try{
            if(!appoinmentId || !status || !userId){
                throw new CustomError("Invalid arguments",400)
            }
            return this.consultationRepo.userAppoinmentCancellation(appoinmentId,status,userId)
        }catch(err:any){
             if(err instanceof CustomError){
                 throw err
             }else{
                 throw new CustomError(err.message ||'Error while make an appoinment',500);
             }
         }  
    }
    
}   

// export const consultationService = (