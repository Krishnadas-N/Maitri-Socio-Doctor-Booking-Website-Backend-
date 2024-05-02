import mongoose, { Schema } from 'mongoose'

const conversationSchema = new mongoose.Schema({
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

const Conversation = mongoose.model('Conversation', conversationSchema);

export{
    Conversation
} 