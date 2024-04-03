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

const DoctorCategoryModel = mongoose.model<DoctorSpecializtion>('DoctorCategory', DoctorCategorySchema);

export default DoctorCategoryModel;
