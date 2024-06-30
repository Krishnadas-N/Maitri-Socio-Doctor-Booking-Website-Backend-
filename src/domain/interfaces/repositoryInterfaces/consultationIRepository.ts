import { AggregatedAppointmentChangeStatus, PaymentModel, doctorAppoinmentsResponseModel, findDoctorsQueryParams, makeAppoinmentReqModel, userAppoinmentsResponseModel } from "../../../models/consultation.model";
import { doctorsResponseModel } from "../../../models/common.models";
import { Appointment } from "../../entities/APPOINMENT";


export interface IConsultationRepository{
    makeDoctorAppoinment(userId:string,doctorId:string,appoinmentData:makeAppoinmentReqModel):Promise<string>;
    getAppoinment(appointmentId: string): Promise<Appointment>;
    createBookingPayment(appointmentId: string,paymentMethod:PaymentModel, token?:any):Promise<{responseId:string,keyId:string,amount:number}> ;
    verifyPayment(orderId: string, paymentId: string, razorpaySignature: string): Promise<{appoinmentId:string,notificationId:string}>;
    getAppoinmentsOfUsers(userId:string,page:number,pageSize:number):Promise<userAppoinmentsResponseModel>;
    getAppoinmentsOfDoctors(doctorId:string,page:number,pageSize:number,searchQuery:string):Promise<doctorAppoinmentsResponseModel>;
    changeAppoinmentStatus(appoinmentId:string,status:string,userId:string,userType:string):Promise<{appointment:AggregatedAppointmentChangeStatus,notificationId:string}>;
    getAvailableSlots(doctorId:string, date:Date):Promise<string[]>;
    getDoctors(queryData:findDoctorsQueryParams):Promise<doctorsResponseModel>;
    userAppoinmentCancellation(appoinmentId:string,status:string,userId:string):Promise<Appointment>;
    savePrescriptionOfPatient(appoinmentId: string, prescriptionFile: string, title: string, doctorId: string): Promise<void>;
    requestToCancelAppoinment(appointmentId: string, userId: string, reason: string): Promise<{appointment:Appointment,notificationId:string}> 
    appoinmentCancellationRequestStatus(appoinmentId: string, status: string, doctorId:string): Promise<Appointment>;
    getAppointmentsWithPrescriptions(userId: string): Promise<Appointment[]> 
}