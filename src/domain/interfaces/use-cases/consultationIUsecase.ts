import { PaymentModel, doctorAppoinmentsResponseModel, findDoctorsQueryParams, makeAppoinmentReqModel, userAppoinmentsResponseModel } from "../../../models/consultation.model";
import { doctorsResponseModel } from "../../../models/common.models";
import { Appointment } from "../../entities/APPOINMENT";


export interface IConsultationUsecase{
    makeDoctorAppoinment(userId:string,doctorId:string,appoinmentData:makeAppoinmentReqModel):Promise<string>;
    getAppoinmentDetails(appointmentId: string): Promise<Appointment>;
    createOrder(appointmentId: string,paymentMethod:PaymentModel): Promise<{responseId:string,keyId:string,amount:number}>;
    verifyWebhook(orderId: string, paymentId: string, razorpaySignature: string): Promise<string>;
    getUsersAppoinments(userId:string,page:number,pageSize:number):Promise<userAppoinmentsResponseModel>;
    getDoctorsAppoinments(doctorId:string,page:number,pageSize:number):Promise<doctorAppoinmentsResponseModel>;
    changeAppoinmentStatus(appoinmentId:string,status:string):Promise<Appointment>;
    getDoctorAvailableSlots(doctorId:string, date:Date):Promise<string[]>;
    getAllDoctors(queryData:findDoctorsQueryParams):Promise<doctorsResponseModel>;
    userAppoinmentCancellation(appoinmentId:string,status:string,userId:string):Promise<Appointment>;
}