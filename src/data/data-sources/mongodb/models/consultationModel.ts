import mongoose, { Schema, Document } from "mongoose";


export interface Payment extends Document {
  amount: number;
  method: 'Credit Card' | 'Debit Card' | 'PayPal' | 'Stripe' | 'Razorpay'; // Add more payment methods as needed
  transactionId: string;
  status: 'Success' | 'Failed';
}


export interface Consultation extends Document {
    patient: mongoose.Types.ObjectId;
    doctor: mongoose.Types.ObjectId;
    date: Date;
    duration: number;
    consultationType: 'In-person' | 'Video' | 'Audio';
    prescription?: string;
    createdAt: Date;
    paymentStatus: 'Pending' | 'Paid' | 'Refunded'; // Payment status for the consultation
    payment: Payment;
  }

const consultationSchema = new mongoose.Schema<Consultation>({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true }, // Duration in minutes
    consultationType: { type: String, enum: ['In-person', 'Video', 'Audio'], required: true },
    prescription: { type: String },
    createdAt: { type: Date, default: Date.now },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' },
    payment: {
        type: {
          amount: { 
            type: Number, 
            required: true
         },
          method: {
             type: String,
              enum: ['Credit Card', 'Debit Card', 'PayPal', 'Stripe','Razorpay'], 
              required: true
             },
          transactionId: { 
            type: String, 
            required: true 
        },
          status: { 
            type: String, 
            enum: ['Success', 'Failed'],
             default: 'Success' 
            },
        },
        required: true,
      }, // Payment status for the consultation
  });
  
const consultationModel = mongoose.model<Consultation>("Consultation", consultationSchema);
 
export  {consultationModel};