import { CustomError } from "../../utils/customError"; 
import { IConsultationModelIDataSource } from "../../data/interfaces/data-sources/consultationIDataSources"; 
import { PaymentModel, doctorAppoinmentsResponseModel, findDoctorsQueryParams, makeAppoinmentReqModel, userAppoinmentsResponseModel } from "../../models/consultation.model";
import { Appointment } from "../entities/APPOINMENT";
import { IConsultationRepository } from "../interfaces/repositoryInterfaces/consultationIRepository"; 
import dotenv from 'dotenv';
dotenv.config();
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { doctorsResponseModel } from "../../models/common.models";
import { stripeClient } from "../../config/stripeConfig";


export class ConsultationRepoImpl implements IConsultationRepository{
    constructor(
        private consultationDataSource:IConsultationModelIDataSource
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

   async createBookingPayment(appointmentId: string, paymentMethod: PaymentModel,token?:any): Promise<{responseId:string,keyId:string,amount:number}> {
      try{
             const appoinment = await this.consultationDataSource.findAppoinmentById(appointmentId);
            if(paymentMethod==='Razorpay'){
            const razorpay = this.makeInstance();

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
       
             }else if(paymentMethod==='Stripe'){
                if(!token){
                    throw new CustomError("Token is Missing",400)
                }

                const customer = await stripeClient.customers.create({
                    email: "test@email.com",
                    source: token.id
                  });
                  console.log("customer===>",customer);
                  const charge = await stripeClient.charges.create({
                    amount: appoinment.amount, // Amount in cents
                    description: "Test Purchase using express and Node",
                    currency: "INR",
                    customer: customer.id,
                  });

                  console.log("charge====>",charge)
                  await this.consultationDataSource.savePaymentDetails(appointmentId, appoinment.amount, paymentMethod, charge.id);

                  return {responseId:charge.id,keyId:process.env.RAZORPAY_KEY_ID as string,amount:appoinment.amount};
             }
             throw new Error('Method not implemented')
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

    async verifyPayment(orderId: string, paymentId: string, razorpaySignature: string): Promise<{appoinmentId:string,notificationId:string}> {
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

   async  getAppoinmentsOfDoctors(doctorId: string,page:number,pageSize:number): Promise<doctorAppoinmentsResponseModel> {
      return this.consultationDataSource.getAppoinmentsOfDoctors(doctorId,page,pageSize);
    }
    
   async  getAppoinmentsOfUsers(userId: string,page:number,pageSize:number): Promise<userAppoinmentsResponseModel> {
    return this.consultationDataSource.getAppoinmentsOfUsers(userId,page,pageSize);
    }
    async changeAppoinmentStatus(appoinmentId: string, status: string,userId:string,userType:string): Promise<{appointment:Appointment,notificationId:string}> {
        return  await this.consultationDataSource.changeAppoinmentStatus(appoinmentId,status,userId,userType);
    }


   async getAvailableSlots(doctorId: string, date: Date): Promise<string[]> {
        return await this.consultationDataSource.getAvailableSlots(doctorId,date);
    }

    async getDoctors(queryData:findDoctorsQueryParams): Promise<doctorsResponseModel> {
        return await this.consultationDataSource.getAllDoctors(queryData)
    }

    async userAppoinmentCancellation(appoinmentId: string, status: string, userId: string): Promise<Appointment> {
        return await this.consultationDataSource.appoinmentCancellation(appoinmentId,status,userId)
    }

   async savePrescriptionOfPatient(appoinmentId: string, prescriptionFile: string, title: string, doctorId: string): Promise<void> {
     await this.consultationDataSource.savePrescriptionOfPatient(appoinmentId,prescriptionFile,title,doctorId)
    }

    async requestToCancelAppoinment(appointmentId: string, userId: string, reason: string): Promise<{ appointment: Appointment; notificationId: string; }> {
        return await this.consultationDataSource.requestToCancelAppoinment(appointmentId,userId,reason);
    }

    async appoinmentCancellationRequestStatus(appoinmentId: string, status: string, doctorId: string, ): Promise<Appointment> {
        return await this.consultationDataSource.appoinmentCancellationRequestStatus(appoinmentId,status,doctorId,);
    }

   async getAppointmentsWithPrescriptions(userId: string): Promise<Appointment[]> {
        return await this.consultationDataSource.getAppointmentsWithPrescriptions(userId);
    }
}