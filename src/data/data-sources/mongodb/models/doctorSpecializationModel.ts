import mongoose from 'mongoose';
import { DoctorSpecializtion } from '../../../../domain/entities/Specialization'; 

const DoctorCategorySchema = new mongoose.Schema<DoctorSpecializtion>({
  name: {
     type: String,
      required: true
     },
  description: String,
  isBlocked:{
    type:Boolean,
    default:false
  }
});

const doctorCategoryModel = mongoose.model<DoctorSpecializtion>('DoctorCategory', DoctorCategorySchema);

export {doctorCategoryModel};
