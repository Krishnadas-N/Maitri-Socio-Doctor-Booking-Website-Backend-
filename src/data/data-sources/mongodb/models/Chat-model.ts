import mongoose, { Schema, Document } from 'mongoose';
import { Chat } from '../../../../domain/entities/Chat';

// interface User {
//   _id: mongoose.Schema.Types.ObjectId;
//   // Define other properties of the User model as needed
// }

// interface Participant {
//   user: mongoose.Schema.Types.ObjectId | User;
//   delivered: boolean;
//   read: boolean;
//   last_seen?: Date;
// }

// interface Meta {
//   user: mongoose.Schema.Types.ObjectId | User;
//   delivered: boolean;
//   read: boolean;
// }

// interface Message {
//   message: string;
//   meta: Meta[];
// }

// interface Chat extends Document {
//   sender: mongoose.Schema.Types.ObjectId | User;
//   messages: Message[];
//   is_group_message: boolean;
//   participants: Participant[];
// }

// const ChatSchema: Schema = new Schema({
//   sender: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   messages: [
//     {
//       message: String,
//       meta: [
//         {
//           user: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User'
//           },
//           delivered: Boolean,
//           read: Boolean
//         }
//       ]
//     }
//   ],
//   is_group_message: { type: Boolean, default: false },
//   participants: [
//     {
//       user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//       },
//       delivered: Boolean,
//       read: Boolean,
//       last_seen: Date
//     }
//   ]
// });




const ChatSchema: Schema = new Schema<Chat>({
    name: {
        type: String,
    },
    participants: [
      {
        participantType: {
          type: String,
          enum: ['User', 'Doctor'],
          required: true
        },
        participant: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: 'participants.participantType'
        },
        delivered: Boolean,
        read: Boolean,
        lastSeen: Date
      }
    ],
    messages: [
      { 
        contentType: {
          type: String,
          enum: ['text', 'audio', 'video', 'document'],
          required: true
        },   
        content: {
          text: String,
          fileUrl: String,
          fileName: String, 
          fileSize: Number, 
          fileType: String 
        },
      
      }
    ],
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'participants.participantType'
    },
    is_group_message: { type: Boolean, default: false },
    isOpen: { type: Boolean, default: true }
  },
  { 
    timestamps:true
  });
  

const ChatModel = mongoose.model<Chat>('Chat', ChatSchema);

export default ChatModel;