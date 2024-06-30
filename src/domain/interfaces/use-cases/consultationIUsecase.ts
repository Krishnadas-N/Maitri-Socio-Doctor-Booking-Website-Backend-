import { PaymentModel, doctorAppoinmentsResponseModel, findDoctorsQueryParams, makeAppoinmentReqModel, userAppoinmentsResponseModel } from "../../../models/consultation.model";
import { doctorsResponseModel } from "../../../models/common.models";
import { Appointment } from "../../entities/APPOINMENT";


export interface IConsultationUsecase{
    makeDoctorAppoinment(userId:string,doctorId:string,appoinmentData:makeAppoinmentReqModel):Promise<string>;
    getAppoinmentDetails(appointmentId: string): Promise<Appointment>;
    createOrder(appointmentId: string,paymentMethod:PaymentModel,token?:any,): Promise<{responseId:string,keyId:string,amount:number}>;
    verifyWebhook(orderId: string, paymentId: string, razorpaySignature: string): Promise<{appoinmentId:string,notificationId:string}>;
    getUsersAppoinments(userId:string,page:number,pageSize:number):Promise<userAppoinmentsResponseModel>;
    getDoctorsAppoinments(doctorId:string,page:number,pageSize:number,searchQuery:string):Promise<doctorAppoinmentsResponseModel>;
    changeAppoinmentStatus(appoinmentId:string,status:string,userId:string,userType:string):Promise<{appointment:Appointment,notificationId:string}>;
    getDoctorAvailableSlots(doctorId:string, date:Date):Promise<string[]>;
    getAllDoctors(queryData:findDoctorsQueryParams):Promise<doctorsResponseModel>;
    userAppoinmentCancellation(appoinmentId:string,status:string,userId:string):Promise<Appointment>;
    savePrescriptionOfPatient(appoinmentId: string, prescriptionFile: string, title: string, doctorId: string): Promise<void> ;
    userRequestToCancelAppoinment(appointmentId: string, userId: string, reason: string): Promise<{appointment:Appointment,notificationId:string}>;
    ChangeStatusOfappoinmentCancellationRequest(appoinmentId: string, status: string, doctorId:string): Promise<{ appointment: Appointment; adminNotificationId: string; userNotificationId: string }> ;
    getAppointmentsWithPrescriptions(userId: string): Promise<Appointment[]> 
}