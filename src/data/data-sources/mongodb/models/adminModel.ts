import mongoose, { Schema, Document } from 'mongoose';
import { PasswordUtil } from '../../../../utils/passwordUtils';

interface IAdmin extends Document {
  username: string;
  email:string;
  password: string;
  roles: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email:{
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Role'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
},{
  timestamps:true
});

adminSchema.pre('save',async function(next){
    if (this.password  && this.isModified('password') ) {
      const hasedPassword = await PasswordUtil.hashPassword(this.password);
      this.password = hasedPassword;
    }
    next();
  })

const adminModel = mongoose.model<IAdmin>('Admin', adminSchema);

export {IAdmin,adminModel} ;