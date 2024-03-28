import mongoose from "mongoose";
import Doctor from "../../../../domain1/entities/Doctor";
import { PasswordUtil } from "../../../../../utils/PasswordUtils";

const DoctorSchema = new mongoose.Schema<Doctor>({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 50,
    required:true
  },
  password:{
    type:String,
    trim:true,
    maxlength: 50,
    required:true
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    street: String,
    city: String,
    zipcode: Number,
    country: String,
  },
  specialization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DoctorCategory', 
  },
  education: [
    {
      degree: String,
      institution: String,
      year: String,
    },
  ],
  experience: {
    type: String,
    required: true,
  },
  certifications: {
    type: [String],
    required: true,
  },
  languages: [String],
  consultationFee: [
    {
      type: Number,
      min: 0,
    },
  ],
  availability: [
    {
      dayOfWeek: String,
      startTime: String,
      endTime: String,
    },
  ],
  profilePic: String,
  bio: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  followers: [String],
  isVerified: {
    type: Boolean,
    default: false,
  },
  onlineConsultation: {
    type: Boolean,
    default: true,
  },
  maxPatientsPerDay: {
    type: Number,
    default: 10, // Example value, adjust according to your needs
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  isProfileComplete: {
    type: Boolean,
    default: false, 
  },
});


DoctorSchema.pre('save',async function(next){
  if (this.password  && this.isModified('password') ) {
    const hasedPassword = await PasswordUtil.HashPassword(this.password);
    this.password = hasedPassword;
  }
  next();
})

const DoctorModel = mongoose.model<Doctor>("Doctor", DoctorSchema);

export default DoctorModel;