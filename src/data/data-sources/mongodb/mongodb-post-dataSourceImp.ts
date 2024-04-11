import mongoose, { Aggregate } from "mongoose";
import { Comment, Post, Reply, Report } from "../../../domain/entities/POST";
import { IPostModel } from "../../interfaces/data-sources/post-data-source";
import { PostModel } from "./models/Post-Model";
import { CustomError } from "../../../../utils/CustomError";


export class MongoDbPostDataSource implements IPostModel{
    constructor(){}
    async getAllPosts(page: number, limit: number, query?: string): Promise<Post[]> {
        const skip = (page - 1) * limit;
        const baseMatch = {
          isBlocked: false, // Adjust criteria if needed
        };
      
        const aggregationPipeline: any = [];
        aggregationPipeline.push({ $match: baseMatch });
      
        const doctorLookupPipeline = [
          {
            $lookup: {
              from: 'doctors',
              localField: 'doctorId',
              foreignField: '_id',
              as: 'doctor'
            }
          },
          {
            $unwind: '$doctor' // Flatten the doctor array
          },
          // Optionally uncomment to filter doctors
          // {
          //   $match: {
          //     'doctor.isProfileComplete': true
          //   }
          // },
          {
            $project: {
              _id: 1,
              title: 1,
              content: 1,
              createdAt: 1,
              tags: 1,
              media: 1,
              likes: 1,
              comments: 1,
              reportedBy: 1,
              isBlocked: 1,
              isArchived: 1,
              doctorName: '$doctor.firstName', // Include doctor's name
              doctorProfileImage:'$doctor.profilePic'
            }
          }
        ];
      
        aggregationPipeline.push(...doctorLookupPipeline);
      
        if (query) {
          const textSearchPipeline = [
            {
              $search: {
                text: {
                  query,
                  path: ['title', 'content']
                }
              }
            }
          ];
      
          aggregationPipeline.push({
            $unionWith: {
              coll: 'posts',
              pipeline: [...textSearchPipeline]
            }
          });
        }
      
        const posts = await PostModel.aggregate(aggregationPipeline)
          .skip(skip)
          .limit(limit)
          .exec();
      
        console.log("Log form ...", posts);
        return posts;
      }
      

    async create(post: Post): Promise<Post> {
        const newPost = await PostModel.create(post); 
        return newPost;
    }

    async findById(id: string): Promise<Post | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new CustomError('Invalid Post Id', 400);  
        }

        const post = await PostModel.findById(id);
        return post;
    }

    async likePost(postId: string, userId: string): Promise<Post> {
        if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new CustomError('Invalid Post Id or User Id', 400);  
        }
        const post = await PostModel.findById(postId);

        if (!post) {
            throw new CustomError('Post not found', 404);
        }

        const likedIndex = post.likes?.findIndex(like => like.userId === userId);
        if(likedIndex === undefined || likedIndex === -1){
            post.likes?.push({userId,timestamp:new Date()});
        } else{
            post.likes?.splice(likedIndex, 1);
        }
        return await post.save();
    }

    
    async commentOnPost(postId: string, comment: Comment): Promise<Post | null> {
        if (!postId || !comment || !comment.userId || !comment.content) {
            throw new CustomError('Invalid postId, userId, or comment content', 400);
        }

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            throw new CustomError('Invalid Post Id', 400);
        }

        if (!mongoose.Types.ObjectId.isValid(comment.userId)) {
            throw new CustomError('Invalid User Id', 400);
        }

        const post = await PostModel.findById(postId);

        if (!post) {
            throw new CustomError('Post not found', 404);
        }

        if (!post.comments) {
            post.comments = [];
        }

        post.comments.push(comment);

        const updatedPost = await post.save();

        return updatedPost;
    }

    async replyToComment(postId: string, commentId: string, reply: Reply): Promise<Post | null> {
        console.log(postId, commentId,reply);
        if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId) || !mongoose.Types.ObjectId.isValid(reply.userId)) {
            throw new CustomError('Invalid Post Id', 400);
        }
        const post = await PostModel.findById(postId);
        if(!post){
            throw new CustomError("Post Not Found ",404);
        }
        console.log(post);
        const comment = post.comments?.find(c => c?._id?.toString() === commentId.toString());

        if (!comment) {
            throw new CustomError('Comment not found', 404);
        }
        comment.replies?.push(reply);
        const updatedPost = await post.save();
        return updatedPost;
    }
    
    async reportPost(postId: string, report: Report): Promise<Post | null> {
        if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(report.userId )) {
            throw new CustomError('Invalid Post Id and User ID ', 400);
        }
        if (!report.userId || !report.reason) {
            throw new CustomError('Invalid report data. User ID and reason are required.', 400);
        }
        const post = await PostModel.findById(postId);
        if (!post) {
            throw new CustomError('Post not found', 404);
        }
        const existingReport = post.reportedBy?.find(r => r.userId === report.userId);
        if (existingReport) {
            throw new CustomError('Post already reported by this user', 400);
        }
        post.reportedBy?.push(report);
        const updatedPost = await post.save();
        return updatedPost;
    }

    async getPostByTag(tag: string): Promise<Post[] | null> {
        return  await PostModel.find({ tags: tag });
    }

    async editReply(postId: string | mongoose.Types.ObjectId, commentId: string | mongoose.Types.ObjectId, replyId: string, content: string): Promise<Reply | null> {
        if (!postId || !commentId || !replyId || !content) {
            throw new CustomError('postId, commentId, replyId, and content are required', 400);
        }
        const post = await PostModel.findById(postId);
            if (!post) {
                throw new CustomError('Post not found', 404);
            }
            const comment = post.comments?.find((comment: any) => comment._id.equals(commentId));
            if (!comment) {
                throw new CustomError('Comment not found', 404);
            }
        
            const reply = comment.replies?.find((reply: any) => reply._id.equals(replyId));
            if (!reply) {
                throw new CustomError('Reply not found', 404);
            }

            reply.content = content;
            await post.save();

            return reply;
    }

    async editComment(postId: string | mongoose.Types.ObjectId, commentId: string | mongoose.Types.ObjectId, content: string): Promise<Comment | null> {
        if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId)) {
            throw new CustomError('Invalid postId or commentId', 400);
        }  
        const post = await PostModel.findById(postId);
        if (!post) {
            throw new CustomError('Post not found', 404);
        }
        const comment = post.comments?.find((comment: any) => comment._id.equals(commentId));
        if (!comment) {
            throw new CustomError('Comment not found', 404);
        }
        comment.content = content;
            await post.save();

            return comment;
    }
    async deleteComment(postId: string | mongoose.Types.ObjectId, commentId: string | mongoose.Types.ObjectId): Promise<boolean> {
        if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId)) {
            throw new CustomError('Invalid postId or commentId', 400);
        } 
        const post = await PostModel.findById(postId);
        if (!post) {
            console.error('Post not found');
            return false;
        }
        const commentIndex = post.comments?.findIndex((comment:any) => comment._id.toString() === commentId.toString());
        if (commentIndex===undefined || commentIndex === -1) {
            console.error('Comment not found');
            return false;
        }
        post.comments?.splice(commentIndex, 1);
        await post.save();
        return true;
    }
   async deleteReply(postId: string | mongoose.Types.ObjectId, commentId: string | mongoose.Types.ObjectId, replyId: string | mongoose.Types.ObjectId): Promise<boolean> {
        if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId)) {
            throw new CustomError('Invalid postId or commentId', 400);
        }
        const post = await PostModel.findById(postId);
        if (!post) {
            console.error('Post not found');
            return false;
        }
        const comment = post.comments?.find((comment:any) => comment._id.toString() === commentId.toString());
        if (!comment) {
            console.error('Comment not found');
            return false;
        }
        const replyIndex = comment.replies?.findIndex((reply:any) => reply._id.toString() === replyId.toString());
        if (!replyIndex || replyIndex === -1) {
            console.error('Reply not found');
            return false;
        }
        comment.replies?.splice(replyIndex, 1);
            await post.save();
            return true;
    }

    async archivePost(postId: string | mongoose.Types.ObjectId): Promise<Post | null> {
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            throw new Error('Invalid postId');
        }
        const archivedPost = await PostModel.findByIdAndUpdate(postId, { archived: true }, { new: true });
        return archivedPost;
    }
    async blockPost(postId: string | mongoose.Types.ObjectId): Promise<Post | null> {
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            throw new Error('Invalid postId');
        }
        const blockedPost = await PostModel.findByIdAndUpdate(postId, { blocked: true }, { new: true });
        return blockedPost;
    }
}