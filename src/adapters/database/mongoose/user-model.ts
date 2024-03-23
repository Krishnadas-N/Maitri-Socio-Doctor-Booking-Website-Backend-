import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  profilePic:{
    type:String,
    default:'https://banner2.cleanpng.com/20180327/ssq/kisspng-computer-icons-user-profile-avatar-profile-5ab9e3b05772c0.6947928615221318883582.jpg'
  },
  firstname:{
    type:String,
    required:true,
    max: 25,
  },
  lastName:{
    type:String,
    required:true,
    max: 25,
  },
  username:{
    type:String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  gender:{
    type:String,
    enum:['male', 'female','other']
  },
  email: {
     type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
     },
  password: { 
    type: String,
    required: true,
    select: false,
    max: 25, 
    },
  isBlocked:{
    type:Boolean,
    default:false,
  },role: {
    type: String,
    required: true,
    default: "0x01",
},
}, 
{ timestamps: true });

export const UserModel = mongoose.model('User', userSchema);
