import mongoose, { Schema, Document } from 'mongoose';
import { Post } from '../../../../domain1/entities/POST';

const LikeSchema =  new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
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
    userId: { type: Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    replies: [{
        userId: { type: Schema.Types.ObjectId, required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
    }]
});


const CommentSchema =new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        replies: [ReplySchema]
    });


// Report sub-schema
const ReportSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
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
  