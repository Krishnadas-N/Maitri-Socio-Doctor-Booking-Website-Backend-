

import { Appointment } from "../domain/entities/APPOINMENT";

export interface makeAppoinmentReqModel{
    typeofConsultaion:'video'|'chat'|'clinic',
    bookingDate:Date,
    slotTime:string
}

export type PaymentModel='Credit Card' | 'Debit Card' | 'PayPal' | 'Stripe' | 'Razorpay'

export const allowedStatuses = ['Pending', 'Scheduled', 'Completed', 'Cancelled', 'Rejected'];

export interface userAppoinmentsResponseModel {
    appointments:Appointment[],
    page:number,
    pageSize:number,
    totalCount:number,
    totalPages:number,
}

export interface doctorAppoinmentsResponseModel {
    appointments:Appointment[],
    page:number,
    pageSize:number,
    totalCount:number,
    totalPages:number,
}


export interface findDoctorsQueryParams {
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
  
