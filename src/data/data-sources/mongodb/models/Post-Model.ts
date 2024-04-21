import mongoose, { Schema, Document } from 'mongoose';
import { Post } from '../../../../domain/entities/POST';

const LikeSchema =  new mongoose.Schema({
    externalModelType: {
        type: String,
        enum: ['User', 'Doctor'], 
    },
    userId: {
        type: Schema.Types.ObjectId,
        refPath: 'externalModelType', // Dynamic referencing for nested replies
    },
    timestamp: { type: Date, default: Date.now }
  }, { _id: false });


const postMediaSchema =  new mongoose.Schema({
    url: {
        type: String,
        trim: true
    }
}, {
    _id: false
})

const ReplySchema = new mongoose.Schema({
    externalModelType: {
        type: String,
        enum: ['User', 'Doctor'], 
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        refPath: 'externalModelType', // Use dynamic referencing based on externalModelType
        required: true
    },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    replies: [{
        externalModelType: {
            type: String,
            enum: ['User', 'Doctor'], 
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            refPath: 'externalModelType', // Dynamic referencing for nested replies
            required: true
        },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }]
});


const CommentSchema = new mongoose.Schema({
    externalModelType: {
        type: String,
        enum: ['User', 'Doctor'], 
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        refPath: 'externalModelType', // Use dynamic referencing based on externalModelType
        required: true
    },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    replies: [ReplySchema]
});

// Report sub-schema
const ReportSchema = new mongoose.Schema({
    externalModelType: {
        type: String,
        enum: ['User', 'Doctor'], 
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        refPath: 'externalModelType', // Dynamic referencing for nested replies
        required: true
    },
    reason: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});



const PostSchema: Schema = new mongoose.Schema<Post>({
    doctorId: {
         type: Schema.Types.ObjectId, 
         ref: 'Doctor',
         required: true 
        },
    title: {
        type: String, 
        required: true },
    content: { 
        type: String,
         required: true },
    media: [postMediaSchema],
    tags: [{ 
        type: String
     }],
     createdAt: { 
        type: Date, 
        default: Date.now 
    },
    likes: [LikeSchema],
    comments: [CommentSchema],
    reportedBy: [ReportSchema],
    isBlocked:{
        type:Boolean,
        default:false
    },
    isArchived:{
        type: Boolean,
        default: false
    }
  });


  export const PostModel = mongoose.model<Post>('Post', PostSchema);
  