

import { Appointment } from "../domain/entities/APPOINMENT";

interface makeAppoinmentReqModel{
    typeofConsultaion:'video'|'chat'|'clinic',
    bookingDate:Date,
    slotTime:string
}

type PaymentModel='Credit Card' | 'Debit Card' | 'PayPal' | 'Stripe' | 'Razorpay'

const allowedStatuses = ['Pending', 'Scheduled', 'Completed', 'Cancelled', 'Rejected'];

interface userAppoinmentsResponseModel {
    appointments:Appointment[],
    page:number,
    pageSize:number,
    totalCount:number,
    totalPages:number,
}

interface doctorAppoinmentsResponseModel {
    appointments:Appointment[],
    page:number,
    pageSize:number,
    totalCount:number,
    totalPages:number,
}


interface findDoctorsQueryParams {
    searchQuery: string;
    currentPage: string;
    pageSize: string;
    sortOption: string;
    gender: string;
    availability: string;
    speciality: string;
    experience: string;
    consultation: string;
    rating: string;
    languages: string;
  }
  

export {findDoctorsQueryParams,doctorAppoinmentsResponseModel,userAppoinmentsResponseModel,PaymentModel,makeAppoinmentReqModel,allowedStatuses}