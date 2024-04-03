import mongoose, { Schema, Document } from 'mongoose';

export interface OTP extends Document {
    email: string;
    otp: string;
    status: 'USED' | 'NOTUSED';
    createdAt: Date;
    validFor:Date;
    expiresAt: Date;
}
const otpSchema = new Schema({
    email: { type: String, required: true },
    otp:{
        type:String,
        required:true,
        minlength:6,
        maxlength:6,
        unique: true,
    },
    status:{
        type:String,
        enum:['USED','NOTUSED'],
        default:'NOTUSED'
    },
    createdAt: {
        type: Date,
        default: Date.now, 
      },
      validFor: {
        type: Number,
        required: true,
        default: 60 // Default to 60 seconds
    },
      expiresAt: {
        type: Date,
        expires:60,
        default:()=>(Date.now()+60*60 * 1000)
      },
})

const otpModel =  mongoose.model<OTP>('OtpModel',otpSchema)

export default otpModel