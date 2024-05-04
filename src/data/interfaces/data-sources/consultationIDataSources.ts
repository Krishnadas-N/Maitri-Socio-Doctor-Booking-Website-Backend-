import { Appointment } from '../../../domain/entities/APPOINMENT';
import {doctorAppoinmentsResponseModel, findDoctorsQueryParams, makeAppoinmentReqModel, userAppoinmentsResponseModel} from '../../../models/consultation.model'
import { doctorsResponseModel } from '../../../models/common.models';

export interface IConsultationModelIDataSource{
    makeAppoinment(userId:string,doctorId:string,appoinmentData:makeAppoinmentReqModel):Promise<string>;
    getAppoinment(appointmentId: string): Promise<Appointment>;
    findAppoinmentById(id: string): Promise<Appointment> ; 
    savePaymentDetails(appointmentId:string,appoinmentAmount:number,paymentMethod:'Credit Card' | 'Debit Card' | 'PayPal' | 'Stripe' | 'Razorpay',responseId:string): Promise<void>;
    updatePaymentToSuccess(orderId:string):Promise<string>;
    getAppoinmentsOfUsers(userId:string,page:number,pageSize:number):Promise<userAppoinmentsResponseModel>;
    getAppoinmentsOfDoctors(doctorId:string,page:number,pageSize:number):Promise<doctorAppoinmentsResponseModel>;
    changeAppoinmentStatus(appoinmentId:string,status:string):Promise<Appointment>;
    getAvailableSlots(doctorId:string, date:Date):Promise<string[]>;
    getAllDoctors(filters:findDoctorsQueryParams):Promise<doctorsResponseModel>;
    appoinmentCancellation(appoinmentId:string,status:string,userId:string):Promise<Appointment>;
}