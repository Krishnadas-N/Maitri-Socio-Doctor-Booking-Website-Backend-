import mongoose, { Schema } from 'mongoose'
import { Conversation } from '../../../../domain/entities/Chat';

const conversationSchema = new mongoose.Schema<Conversation>({
    members: [
        {
            member: {
                type: Schema.Types.ObjectId,
                refPath: 'members.memberType',
                required:true
            },
            memberType: {
                type: String,
                enum: ['User', 'Doctor'],
                required:true
            }
        }
    ],
    isGroupChat: {
        type: Boolean,
        default: false
    },
    groupName: {
        type: String 
    },
    groupDescritption: {
        type: String 
    },
    lastUpdate: {
        type: Date,
        default: Date.now()
    },
    isClosed: {
        type:Boolean,
        default:false
    }
});

const conversationModel = mongoose.model<Conversation>('Conversation', conversationSchema);

export{
    conversationModel
} 