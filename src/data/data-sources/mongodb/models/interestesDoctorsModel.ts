import { Schema, model, Document, Types } from 'mongoose';


const interestedDoctorSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorIds: [{
    doctorId: {
      type: Types.ObjectId,
      ref: 'Doctor',
      required: true
    },
    dateAdded: {
      type: Date,
      default: Date.now
    }
  }],
},{
    timestamps:true
});

const  interestedDoctorModel = model('InterestedDoctor', interestedDoctorSchema);

export {interestedDoctorModel}
