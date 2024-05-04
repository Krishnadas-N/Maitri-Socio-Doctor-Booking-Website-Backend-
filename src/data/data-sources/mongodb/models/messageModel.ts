import mongoose, { Schema } from 'mongoose';
import { Message } from '../../../../domain/entities/Chat'; 

const messageSchema = new mongoose.Schema<Message>({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        refPath: 'senderModel',
        required: true
    },
    senderModel: {
        type: String,
        enum: ['User', 'Doctor'],
        required: true
    },
    content: {
        text: { type: String }, // Define subfields within content as separate properties
        fileUrl: { type: String },
        fileName: { type: String },
        fileSize: { type: Number },
        fileType: { type: String },
    },
    messageType: {
        type: String,
        enum: ['text', 'audio', 'video', 'document'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    meta: [{
        member: {
            type: Schema.Types.ObjectId,
            refPath: 'meta.memberType'
        },
        memberType: {
            type: String,
            enum: ['User', 'Doctor']
        },
        delivered: {
            type:Boolean,
            default: false,
        },
        read:  {
            type:Boolean,
            default: false,
        },
    }]
});

const messageModel = mongoose.model<Message>('message', messageSchema);

export { messageModel };
