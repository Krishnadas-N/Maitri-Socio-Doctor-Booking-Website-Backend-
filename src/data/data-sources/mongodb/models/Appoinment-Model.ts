import mongoose, { Schema, Document } from "mongoose";
import { Payment } from './Consulation-Model';

interface Appointment extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  typeOfAppointment: 'video' | 'chat' | 'clinic'; 
  date: Date; 
  slot: string;
  amount: number;
  duration: number; 
  status: 'Pending' | 'Scheduled' | 'Completed' | 'Cancelled'|'Rejected';
  createdAt: Date;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  payment:  {
    amount: number,
    method:'Credit Card' | 'Debit Card' | 'PayPal' | 'Stripe' | 'Razorpay';
    transactionId:string;
    status: 'Success'| 'Failed';
};
}

const appointmentSchema = new mongoose.Schema<Appointment>({
  patient:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor:{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  typeOfAppointment:{
    type: String,
    enum: ['video', 'chat', 'clinic'],
  },
  date:{ type: Date, required: true }, // Separate field for date
  slot:{ type: String, required: true },
  amount:{ type: Number, required: true },
  duration: { type: Number, required: true, default: 60 },
  status: { type: String, enum: ['Pending','Scheduled', 'Completed', 'Cancelled','Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' }, 
  payment: {
      amount: { type: Number },
      method: { type: String, enum: ['Credit Card', 'Debit Card', 'PayPal', 'Stripe','Razorpay'],},
      transactionId: { type: String },
      status: { type: String, enum: ['Success', 'Failed'], default: 'Success' },
  },
},{
  timestamps:true
});

export const AppointmentModel = mongoose.model<Appointment>("Appointment", appointmentSchema);
