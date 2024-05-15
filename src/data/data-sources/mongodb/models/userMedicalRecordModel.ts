import mongoose, { Schema, Document } from 'mongoose';

interface IMedicalRecord extends Document {
    mId:string,
    userId: mongoose.Types.ObjectId;
    fileUrl: string;
    title: string;
    description: string;
    createdAt: Date;
}

const MedicalRecordSchema: Schema = new Schema({
  mId:{ type: String,default: generateFancyId , unique: true },
 userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  fileUrl: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
},{
    timestamps:true
});

function generateFancyId(): string {
    const randomNumber = Math.floor(Math.random() * 10000);
    return `#MR-${randomNumber}`;
  }

const medicalRecordModel = mongoose.model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema);
export {medicalRecordModel}