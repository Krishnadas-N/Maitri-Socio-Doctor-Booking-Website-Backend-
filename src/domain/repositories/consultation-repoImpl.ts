import { CustomError } from "../../../utils/CustomError";
import { IConsultationModel } from "../../data/interfaces/data-sources/consultation-data-source";
import { PaymentModel, doctorAppoinmentsResponseModel, findDoctorsQueryParams, makeAppoinmentReqModel, userAppoinmentsResponseModel } from "../../models/Consultation.model";
import { Appointment } from "../entities/APPOINMENT";
import { IConsultationRepo } from "../interfaces/repositories/consultation-Repository";
import dotenv from 'dotenv';
dotenv.config();
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Doctor from "../entities/Doctor";
import { doctorsResponseModel } from "../../models/common-models";

export class ConsultationRepoImpl implements IConsultationRepo{
    constructor(
        private consultationDataSource:IConsultationModel
    ){}

    private makeInstance() {
        const instance = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID as string,
          key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        return instance;
      }
  

   async makeDoctorAppoinment(userId: string, doctorId: string, appoinmentData: makeAppoinmentReqModel): Promise<string> {
      return  await this.consultationDataSource.makeAppoinment(userId,doctorId,appoinmentData)
    }

    async getAppoinment(appointmentId: string): Promise<Appointment> {
        return this.consultationDataSource.getAppoinment(appointmentId);
    }

   async createBookingPayment(appointmentId: string, paymentMethod: PaymentModel): Promise<{responseId:string,keyId:string,amount:number}> {
        try{
            const razorpay = this.makeInstance();
            const appoinment = await this.consultationDataSource.findAppoinmentById(appointmentId);
            if(!appoinment){
                throw new CustomError("Appointment not found",404);
            }
            
            const options = {
                amount: appoinment.amount * 100,
                currency: 'INR', 
                receipt: `booking_${appointmentId}`,
                payment_capture: 1 // Auto capture
              };
            const response = await razorpay.orders.create(options);
           await this.consultationDataSource.savePaymentDetails(appointmentId,appoinment.amount,paymentMethod,response.id)
            return {responseId:response.id,keyId:process.env.RAZORPAY_KEY_ID as string,amount:appoinment.amount};
        }catch(err:any){
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(err.message || 'Error while making an appointment', 500);
            } 
        }
    }

    async verifyPayment(orderId: string, paymentId: string, razorpaySignature: string): Promise<string> {
        try {
            console.log('razorpay',orderId,paymentId,razorpaySignature);
            const body = orderId + '|' + paymentId;
    
            const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
                .update(body)
                .digest('hex');
    
            if (expectedSignature !== razorpaySignature) {
                throw new CustomError( "Invalid Signature", 403);
                
            }
           return await this.consultationDataSource.updatePaymentToSuccess(orderId)
        } catch(err:any){
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(err.message || 'Error while making an appointment', 500);
            } 
        }
    }

   async  getAppoinmentsOfDoctors(doctorId: string,page:number,pageSize:number): Promise<doctorAppoinmentsResponseModel> {
      return this.consultationDataSource.getAppoinmentsOfDoctors(doctorId,page,pageSize);
    }
    
   async  getAppoinmentsOfUsers(userId: string,page:number,pageSize:number): Promise<userAppoinmentsResponseModel> {
    return this.consultationDataSource.getAppoinmentsOfUsers(userId,page,pageSize);
    }
    async changeAppoinmentStatus(appoinmentId: string, status: string): Promise<Appointment> {
        return  await this.consultationDataSource.changeAppoinmentStatus(appoinmentId,status);
    }


   async getAvailableSlots(doctorId: string, date: Date): Promise<string[]> {
        return await this.consultationDataSource.getAvailableSlots(doctorId,date);
    }

    async getDoctors(queryData:findDoctorsQueryParams): Promise<doctorsResponseModel> {
        return await this.consultationDataSource.getAllDoctors(queryData)
    }

}