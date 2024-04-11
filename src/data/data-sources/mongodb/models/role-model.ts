import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
  name: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  permissions: [
    {
      type: String,
      enum: ['READ', 'WRITE', 'CREATE', 'UPDATE', 'DELETE']
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
});

const RoleModel = mongoose.model<IRole>('Role', roleSchema);

export default RoleModel;


// var roleData = {
//   name: "Doctor",
//   permissions: ["READ", "WRITE"],
//   createdAt: new Date(),
//   updatedAt: new Date()
// };