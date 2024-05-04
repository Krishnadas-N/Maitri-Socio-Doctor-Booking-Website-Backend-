import { PaymentModel, doctorAppoinmentsResponseModel, findDoctorsQueryParams, makeAppoinmentReqModel, userAppoinmentsResponseModel } from "../../../models/consultation.model";
import { doctorsResponseModel } from "../../../models/common.models";
import { Appointment } from "../../entities/APPOINMENT";


export interface IConsultationRepository {
    makeDoctorAppoinment(userId:string,doctorId:string,appoinmentData:makeAppoinmentReqModel):Promise<string>;
    getAppoinment(appointmentId: string): Promise<Appointment>;
    createBookingPayment(appointmentId: string,paymentMethod:PaymentModel):Promise<{responseId:string,keyId:string,amount:number}> ;
    verifyPayment(orderId: string, paymentId: string, razorpaySignature: string): Promise<string>;
    getAppoinmentsOfUsers(userId:string,page:number,pageSize:number):Promise<userAppoinmentsResponseModel>;
    getAppoinmentsOfDoctors(doctorId:string,page:number,pageSize:number):Promise<doctorAppoinmentsResponseModel>;
    changeAppoinmentStatus(appoinmentId:string,status:string):Promise<Appointment>;
    getAvailableSlots(doctorId:string, date:Date):Promise<string[]>;
    getDoctors(queryData:findDoctorsQueryParams):Promise<doctorsResponseModel>;
    userAppoinmentCancellation(appoinmentId:string,status:string,userId:string):Promise<Appointment>;
}