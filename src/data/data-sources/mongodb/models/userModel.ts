import mongoose, { Schema } from 'mongoose';
import { PasswordUtil } from '../../../../utils/passwordUtils'; 

const userSchema = new mongoose.Schema({
  profilePic:{
    type:String,
    default:'https://banner2.cleanpng.com/20180327/ssq/kisspng-computer-icons-user-profile-avatar-profile-5ab9e3b05772c0.6947928615221318883582.jpg'
  },
  firstName:{
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
dateOfBirth: {
  type: Date,
},
isVerified:{
  type:Boolean,
  default:false
},
resetToken:{
  type:String,
},
roles: {
  type: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
  default: ['6612457293c66989fc111447'], // Set the default role(s) here
},
refreshToken:{
  type: String 
}
}, 
{ timestamps: true });


userSchema.pre('save',async function(next){
  if (this.password  && this.isModified('password') ) {
    const hasedPassword = await PasswordUtil.hashPassword(this.password);
    this.password = hasedPassword;
  }
  next();
})

const userModel = mongoose.model('User', userSchema);
export {userModel};