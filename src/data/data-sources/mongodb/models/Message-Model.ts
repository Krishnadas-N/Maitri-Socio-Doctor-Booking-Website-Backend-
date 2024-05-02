import mongoose, { Schema } from 'mongoose'

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
         ref: 'Conversation',
         required:true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        refPath: 'senderModel',
        required:true
    },
    senderModel: {
        type: String,
        enum: ['User', 'Doctor'],
        required:true
    },
    content: {
        text: String,
        fileUrl: String,
        fileName: String, 
        fileSize: Number, 
        fileType: String ,
        required:true
      },
    messageType: {
        type: String,
        enum: ['text', 'audio', 'video', 'document'],
        required: true
    },
    createdAt:{
        type:Date,
        default:Date.now()
      },
      meta: [
        {
            member: {
                type: Schema.Types.ObjectId,
                refPath: 'meta.memberType'
            },
            memberType: {
                type: String,
                enum: ['User', 'Doctor']
            },
            delivered: Boolean,
            read: Boolean
        }
    ]
});

const Messages = mongoose.model('message', messageSchema);

export{
    Messages
} 