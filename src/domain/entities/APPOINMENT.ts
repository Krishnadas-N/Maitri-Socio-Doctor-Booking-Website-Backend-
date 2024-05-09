import { objectId } from "../../models/users.model";

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
    _id?:string,
    consultationLink?:string
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
  }
}

interface Payment {
  // Define payment properties
}
