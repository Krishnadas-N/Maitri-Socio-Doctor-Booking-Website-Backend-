import mongoose, { Document, Schema, Types } from 'mongoose';
import { INotification } from '../../../../domain/entities/Notification';


const notificationSchema: Schema = new Schema<INotification>({

    sender: {
        type: Schema.Types.ObjectId,
        refPath: 'senderModel',
        required: true
    },
    senderModel: {
        type: String,
        enum: ['User', 'Doctor'],
        required: true
    },
    receivers: [{
        receiverId: {
            type: Schema.Types.ObjectId,
            refPath: 'receivers.$.receiverModel', // Dynamic reference to receiver model
            required: true
        },
        receiverModel: {
            type: String,
            enum: ['User', 'Doctor'],
            required: true
        }
    }],
    title:{
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    readBy: [{
        reader: {
            type: Schema.Types.ObjectId,
            refPath: 'readerModel',
            required: true
        },
        readerModel:{
            type: String,
            enum: ['User', 'Doctor'],
            required: true
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const notificationModel = mongoose.model<INotification>('Notification', notificationSchema);

export default notificationModel;
