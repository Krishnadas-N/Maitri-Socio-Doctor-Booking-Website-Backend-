import { objectId } from "../../models/users.model";

interface CancellationRequest {
  status: 'Pending' | 'Accepted' | 'Rejected'; 
  reason: string;
  createdAt: Date;
}

export class Appointment {
  patient: objectId;
  doctor: objectId;
  typeOfAppointment: 'video' | 'chat' | 'clinic'; 
  date: Date; 
  slot: string;
  amount: number;
  duration: number; 
  status: 'Pending' | 'Scheduled' | 'Completed' | 'Cancelled';
  createdAt: Date;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  payment: Payment;
  _id?:string | objectId;
  consultationLink?:string;
  prescription?:{
    file:string,
    title:string
  };
cancellationRequests?: CancellationRequest; 
reserved:boolean;
reservationExpiry:Date | null

  constructor(
    patient: objectId,
    doctor: objectId,
    typeOfAppointment: 'video' | 'chat' | 'clinic',
    date: Date,
    slot: string,
    amount: number,
    duration: number,
    status: 'Pending' | 'Scheduled' | 'Completed' | 'Cancelled',
    createdAt: Date,
    paymentStatus: 'Pending' | 'Paid' | 'Refunded',
    payment: Payment,
    reserved:boolean,
    reservationExpiry:Date,
    _id?:string,
    consultationLink?:string,
    prescription?:{
      file:string,
      title:string
    },
    cancellationRequests?: CancellationRequest,
    
  ) {
    this.patient = patient;
    this.doctor = doctor;
    this.typeOfAppointment = typeOfAppointment;
    this.date = date;
    this.slot = slot;
    this.amount = amount;
    this.duration = duration;
    this.status = status;
    this.createdAt = createdAt;
    this.paymentStatus = paymentStatus;
    this.payment = payment;
    this._id =  _id;
    this.consultationLink =consultationLink;
    this.prescription = prescription,
    this.cancellationRequests =cancellationRequests,
    this.reserved = reserved,
    this.reservationExpiry=reservationExpiry
  }
}

interface Payment {
  // Define payment properties
}
