import mongoose, { Schema } from "mongoose";
import Doctor from "../../../../domain/entities/Doctor"; 
import { PasswordUtil } from "../../../../utils/passwordUtils"; 


const AvailabilitySchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: false, 
  },
  startTime: String,
  endTime: String,
});

const FollowerSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'userModel',
  },
  userModel: {
    type: String,
    required: true,
    enum: ['User', 'Doctor'],
  },
});


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
    maxlength: 100,
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
    state: String,
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
   
  },
  certifications: {
    type: [String],
   
  },
  languages: [String],
  consultationFee: [
    {
      type: {
        type: String,
        enum: ['video', 'chat', 'clinic'], // Define the types of consultation
        required: true
      },
      fee: {
        type: Number,
        min: 0,
        required: true
      }
    }
  ],
  availability: [AvailabilitySchema],
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
  followers: [FollowerSchema],
  isVerified: {
    type: Boolean,
    default: false,
  },
  typesOfConsultation: [{
    type: String,
    enum: ['video', 'chat', 'clinic'],
   
  }],
  maxPatientsPerDay: {
    type: Number,
    default: 10, // Example value, adjust according to your needs
  },
  isProfileComplete: {
    type: Boolean,
    default: false, 
  },
  resetToken:{
    type:String,
  },
  isBlocked:{
    type:Boolean,
    default:false
  },
  roles: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
    default: ['66141503f83ac04df8392561'], // Set the default role(s) here
  },
  registrationStepsCompleted:{
    type:Number,
    required:true,
    default:0,
    enum:[0,1,2,3]
  },
  selectedSlots: [{
    date: Date,
    slots: [String], 
  }]
},{
  timestamps:true
});


DoctorSchema.pre('save',async function(next){
  if (this.password  && this.isModified('password') ) {
    const hasedPassword = await PasswordUtil.hashPassword(this.password);
    this.password = hasedPassword;
  }
  next();
})

DoctorSchema.index({ firstName: 'text', lastName: 'text', specialization: 'text', bio: 'text' });


const doctorModel = mongoose.model<Doctor>("Doctor", DoctorSchema);

export {doctorModel};



