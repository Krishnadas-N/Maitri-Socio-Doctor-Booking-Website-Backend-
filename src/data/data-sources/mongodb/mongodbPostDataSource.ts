import mongoose, { Aggregate } from "mongoose";
import { Comment, Post, Reply, Report, SavedPost } from "../../../domain/entities/POST";
import { PostModelIDataSource } from "../../interfaces/data-sources/postIDataSource";
import { postModel } from "./models/postModel";
import { CustomError } from "../../../utils/customError";
import { userType } from "../../../models/users.model";
import { userModel } from "./models/userModel";
import {doctorModel} from "./models/doctorModel";
import { postsReponseModel } from "../../../models/post.models";


export class MongoDbPostDataSource implements PostModelIDataSource{
    constructor(){}
    async getAllhPosts(page: number, limit: number, query?: string): Promise<Post[]> {
         const skip = (page - 1) * limit;
        const baseMatch = {
          isBlocked: false, 
        };
      
        const aggregationPipeline: any = [];
        aggregationPipeline.push({ $match: baseMatch });
      
        const doctorLookupPipeline = [
          {
            $lookup: {
              from: 'doctors', // Replace with your doctor collection name
              localField: 'doctorId',
              foreignField: '_id',
              as: 'doctor'
            }
          },
          {
            $unwind: '$doctor' // Flatten the doctor array (optional if you want an array of doctors)
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
              comments: 1, // Include comments field for population
              reportedBy: 1,
              isBlocked: 1,
              isArchived: 1,
              doctorName: '$doctor.firstName', // Include doctor's name
              doctorProfileImage: '$doctor.profilePic'
            }
          }
        ];
      
        const commentPopulationPipeline = [
            {
                $lookup: {
                    from: {
                        $switch: {
                            branches: [
                                {
                                    case: { $eq: ['$comments.externalModelType', 'User'] },
                                    then: 'users'
                                },
                                {
                                    case: { $eq: ['$comments.externalModelType', 'Doctor'] },
                                    then: 'doctors'
                                },
                                // Add more cases if needed
                            ],
                            default: 'fallbackCollection' // Specify a fallback collection if none of the conditions match
                        }
                    },
                    localField: 'comments.userId',
                    foreignField: '_id',
                    as: 'comments.author'
                }
          },
          {
            $project: {
              _id: 1,
              title: 1,
              content: 1,
              createdAt: 1,
              tags: 1,
              media: 1,
              likes: 1,
              comments: {
                _id: 1, // Include relevant comment fields
                content: 1,
                timestamp: 1,
                author: { // Include relevant user/doctor data
                  _id: 1,
                  // User/doctor specific fields (e.g., name, profile picture)
                }
              },
              reportedBy: 1,
              isBlocked: 1,
              isArchived: 1,
              doctorName: '$doctor.firstName', // Include doctor's name (assuming a doctor lookup is still needed)
              doctorProfileImage: '$doctor.profilePic'
            }
          }
        ];
      
        // Choose which pipeline to use based on doctor lookup requirement:
        aggregationPipeline.push(...(doctorLookupPipeline ? doctorLookupPipeline : []));
        aggregationPipeline.push(...commentPopulationPipeline);
      
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
      
        const posts = await postModel.aggregate(aggregationPipeline)
          .skip(skip)
          .limit(limit)
          .exec();
      
        // You can optionally log the posts and their JSON string for debugging purposes
        console.log(posts, JSON.stringify(posts));
      
        return posts;
    }
      
    async getAllPosts( page: number, limit: number, userId:string, query?: string): Promise<postsReponseModel[]> {
        const skip = (page - 1) * limit;
        const baseMatch = {
            isBlocked: false,
        };
    
        let postsQuery = postModel.find(baseMatch)
            .skip(skip)
            .limit(limit);
    
        if (query) {
            postsQuery = postsQuery.find({ $text: { $search: query } });
        }
    
        const posts = await postsQuery.exec();
        const postsResponse: postsReponseModel[] = [];
        // Populate doctorId for each post
        await postModel.populate(posts, { path: 'doctorId', select: 'firstName profilePic' });
    
        // Populate user and doctor data for comments and replies
        for (const post of posts) {
            if (post.comments && post.comments.length > 0) {
                for (const comment of post.comments) {
                    let userModel;
                    if (comment.externalModelType === 'User') {
                        userModel = 'User';
                    } else if (comment.externalModelType === 'Doctor') {
                        userModel = 'Doctor';
                    }
    
                    if (userModel) {
                        await postModel.populate(comment, { path: 'userId', model: userModel, select: '_id firstName lastName profilePic' });
                    }
    
                    // Populate replies for each comment
                    if (comment.replies && comment.replies.length > 0) {
                        for (const reply of comment.replies) {
                            const replyModel = reply.externalModelType === 'User' ? 'User' : 'Doctor';
                            await postModel.populate(reply, { path: 'userId', model: replyModel, select: '_id firstName lastName profilePic' });
                        }
                    }
                }
            }
            const isLikedByUser = post.likes?.some(like => like.userId.toString() === userId.toString());
            const isPermissionToCrud = post.doctorId && typeof post.doctorId === 'object' && post.doctorId._id.toString() === userId.toString();
            console.log(isPermissionToCrud,post.doctorId);
            postsResponse.push({
                post: post,
                isLikedUser: !!isLikedByUser, // Convert to boolean
                isPermissionToCrud: isPermissionToCrud as boolean
            });
            
            console.log(post.isLikedByUser);
        }
    
        // Log posts and their JSON string for debugging purposes
        console.log(postsResponse, JSON.stringify(postsResponse));

        return postsResponse;
    }
    

    async create(post: Post): Promise<Post> {
        const newPost = await postModel.create(post); 
        return newPost;
    }

    async findById(id: string,userId:string): Promise<postsReponseModel | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new CustomError('Invalid Post Id', 400);  
        }
        let postsResponse: postsReponseModel;
        const post = await postModel.findById(id).populate({ path: 'doctorId', select: 'firstName profilePic' });
        if(!post){
            throw new CustomError('No Post Found in this Id',404);
        }
        if (post.comments && post.comments.length > 0) {
            for (const comment of post.comments) {
                let userModel;
                if (comment.externalModelType === 'User') {
                    userModel = 'User';
                } else if (comment.externalModelType === 'Doctor') {
                    userModel = 'Doctor';
                }

                if (userModel) {
                    await postModel.populate(comment, { path: 'userId', model: userModel, select: '_id firstName lastName profilePic' });
                }

                // Populate replies for each comment
                if (comment.replies && comment.replies.length > 0) {
                    for (const reply of comment.replies) {
                        const replyModel = reply.externalModelType === 'User' ? 'User' : 'Doctor';
                        await postModel.populate(reply, { path: 'userId', model: replyModel, select: '_id firstName lastName profilePic' });
                    }
                }
            }
        }
        const isLikedByUser = post.likes?.some(like => like.userId.toString() === userId.toString());
        const isPermissionToCrud = post.doctorId && typeof post.doctorId === 'object' && post.doctorId._id.toString() === userId.toString();
        console.log(isPermissionToCrud,post.doctorId);
        postsResponse ={
            post: post,
            isLikedUser: !!isLikedByUser, // Convert to boolean
            isPermissionToCrud: isPermissionToCrud as boolean
        }
        
        console.log(post.isLikedByUser);
    console.log(postsResponse, JSON.stringify(postsResponse));

    return postsResponse;
    }

    async likePost(postId: string, userId: string,userType:userType): Promise<Post> {
        if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new CustomError('Invalid Post Id or User Id', 400);  
        }
        const post = await postModel.findById(postId);
        console.log("Log from like post after finding the post for like",post);
        if (!post) {
            throw new CustomError('Post not found', 404);
        }
        console.log(post.likes);
        const likedIndex = post.likes?.findIndex(like => like.userId.toString() === userId.toString());
        console.log(likedIndex,"Log from liked post index");
        if(likedIndex === undefined || likedIndex === -1){
            post.likes?.push({externalModelType:userType,userId,timestamp:new Date()});
        } else{
            post.likes?.splice(likedIndex, 1);
        }
        return await post.save();
    }

    
    async commentOnPost(postId: string, comment: Comment): Promise<Comment | null> {
        console.log(comment);
        if (!postId || !comment || !comment.userId || !comment.content || !comment.externalModelType) {
            throw new CustomError('Invalid postId, userId, model or comment content', 400);
        }

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            throw new CustomError('Invalid Post Id', 400);
        }

        if (!mongoose.Types.ObjectId.isValid(comment.userId)) {
            throw new CustomError('Invalid User Id', 400);
        }

        const post = await postModel.findById(postId);

        if (!post) {
            throw new CustomError('Post not found', 404);
        }

        if (!post.comments) {
            post.comments = [];
        }

        post.comments.push(comment);

        const updatedPost = await post.save();
        const newComment = updatedPost && updatedPost.comments && updatedPost.comments.length > 0 ? updatedPost.comments[updatedPost.comments.length - 1] : null;
        if(newComment){
            const userObject = newComment.externalModelType === 'User' 
            ? await userModel.findById(comment.userId, { _id: 1, firstName: 1, lastName: 1, profilePic: 1 })
            : await doctorModel.findById(comment.userId, { _id: 1, firstName: 1, lastName: 1, profilePic: 1 });
            newComment.userId = userObject;
        }
        return newComment;
    }

    async replyToComment(postId: string, commentId: string, reply: Reply): Promise<Reply | null> {
        console.log(postId, commentId,reply);
        if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId) || !mongoose.Types.ObjectId.isValid(reply.userId)) {
            throw new CustomError('Invalid Post Id', 400);
        }
        const post = await postModel.findById(postId);
        if(!post){
            throw new CustomError("Post Not Found ",404);
        }
        console.log(post);
        const comment = post.comments?.find(c => c?._id?.toString() === commentId.toString());

        if (!comment) {
            throw new CustomError('Comment not found', 404);
        }
        comment.replies?.push(reply);
        await post.save();
        const lastReply = comment.replies && comment.replies.length > 0 ? comment.replies[comment.replies.length - 1] : null;
        console.log(comment.replies, "this is the replie",lastReply);
        if(lastReply){
            lastReply.userId =  lastReply.externalModelType === 'User' 
            ? await userModel.findById(lastReply.userId, { _id: 1, firstName: 1, lastName: 1, profilePic: 1 })
            : await doctorModel.findById(lastReply.userId, { _id: 1, firstName: 1, lastName: 1, profilePic: 1 });
        }
        return lastReply;
    }
    
    async reportPost(postId: string, report: Report): Promise<Post | null> {
        if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(report.userId )) {
            throw new CustomError('Invalid Post Id and User ID ', 400);
        }
        if (!report.userId || !report.reason) {
            throw new CustomError('Invalid report data. User ID and reason are required.', 400);
        }
        const post = await postModel.findById(postId);
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
        return  await postModel.find({ tags: tag });
    }

    async editReply(postId: string | mongoose.Types.ObjectId, commentId: string | mongoose.Types.ObjectId, replyId: string, content: string,userType:userType): Promise<Reply | null> {
        if (!postId || !commentId || !replyId || !content) {
            throw new CustomError('postId, commentId, replyId, and content are required', 400);
        }
        console.log(userType);
        const post = await postModel.findById(postId);
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

    async editComment(postId: string | mongoose.Types.ObjectId, commentId: string | mongoose.Types.ObjectId, content: string,userType:userType): Promise<Comment | null> {
        if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId)) {
            throw new CustomError('Invalid postId or commentId', 400);
        }  
        console.log(userType);
        const post = await postModel.findById(postId);
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
        const post = await postModel.findById(postId);
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
        const post = await postModel.findById(postId);
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
        const archivedPost = await postModel.findByIdAndUpdate(postId, { archived: true }, { new: true });
        return archivedPost;
    }
    async blockPost(postId: string | mongoose.Types.ObjectId): Promise<Post | null> {
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            throw new Error('Invalid postId');
        }
        const blockedPost = await postModel.findByIdAndUpdate(postId, { blocked: true }, { new: true });
        return blockedPost;
    }

     async getDoctorPosts(doctorId: string): Promise<Post[]> {
        console.log(doctorId,'///////////////');
        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            throw new Error('Invalid doctorId');
        }
        

        const posts = await postModel.aggregate([
            { 
              $match : { "doctorId" : new mongoose.Types.ObjectId(doctorId) } 
            },
            {
              $lookup: {
                from: 'doctors',
                localField: 'doctorId',
                foreignField: '_id',
                as: 'doctor'
              }
            },
            {
              $unwind: '$doctor'
            },
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
                doctorName: '$doctor.firstName',
                doctorProfileImage: '$doctor.profilePic',
                doctorLocation: '$doctor.address'
              }
            }
          ]);
            console.log(posts,'///12132112121///');
        return posts
    }

   async editDoctorPost(doctorId: string, postId:string,title: string, content: string, tags: string[]): Promise<{ title: string; content: string; tags: string[]; }> {
      try{
        if (!mongoose.Types.ObjectId.isValid(doctorId) || !mongoose.Types.ObjectId.isValid(postId)) {
            throw new CustomError('Invalid doctorId or postId', 400);
          }
          const updatedPost = await postModel.findOneAndUpdate(
            { _id: postId, doctorId },
            { title, content, tags }, 
            { new: true }
            );
           if (!updatedPost) {
            throw new CustomError('Post not found', 404);
          }
          return {
            title: updatedPost.title,
            content: updatedPost.content,
            tags: updatedPost.tags && updatedPost.tags?.length>0?updatedPost.tags:[],
          };
      }catch(err:any){
        if(err instanceof CustomError){
            throw err
        }else{
            throw new CustomError('Error editing the post: ' + err.message,500)
        }
      }
    }

    async deletePost(doctorId:string,postId: string): Promise<void> {
        try{
            if (!mongoose.Types.ObjectId.isValid(postId)) {
                throw new CustomError('Invalid  postId', 400);
              }
            
           const result =await postModel.findOneAndDelete({_id : postId , doctorId});
           if(!result){
            throw new CustomError('Unauthorized User of Post not Found',403)
           }
          }catch(err:any){
            if(err instanceof CustomError){
                throw err
            }else{
                throw new CustomError('Error editing the post: ' + err.message,500)
            }
          }
    }
    async  toggleSavedPost(userId: string, postId: string, userType: string): Promise<boolean> {
        try {
            if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
                throw new CustomError('Invalid postId or userId', 400);
            }
    
            console.log(userType);
    
            const result = await postModel.findById(postId);
            if (!result) {
                throw new CustomError('Post not found', 404);
            }
    
            const index = result.savedBy?.findIndex((x: SavedPost) => x.userId.toString() === userId.toString());
            console.log("///////////////////////==========",index);
        // If the user is not already saved the post, add the user to savedBy array
        if (index !== undefined && index === -1) {
            if (!result.savedBy) {
                result.savedBy = [{ userId: userId, createdAt: new Date(Date.now()) }];
            } else {
                result.savedBy?.push({ userId: userId, createdAt: new Date(Date.now()) });
            }
        } else {
            // If the user is already saved the post, remove the user from savedBy array
            const indexToSplice = index as number; // Type assertion
            console.log("indexToSplice",indexToSplice);
            result.savedBy?.splice(indexToSplice, 1);
        }

        // Save the updated post
        await result.save();
        console.log("saved post ",result);
        return true;
        } catch (err:any) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError('Error editing the post: ' + err.message, 500);
            }
        }
    }

    async  getSavedPosts(userId: string): Promise<Post[]|[]> {
        try {
            // Validate user ID
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                throw new CustomError('Invalid userId', 400);
            }
    
            // Find saved posts by userId
            const savedPosts = await postModel.find({ savedBy: { $elemMatch: { userId } } });
    
            return savedPosts;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                console.error('Error fetching saved posts:', error);
                throw new CustomError('Error fetching saved posts', 500);
            }
        }
    }
}