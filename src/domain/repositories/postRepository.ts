import { Model, Types } from 'mongoose';
import { IPostsRepository } from '../interfaces/repositoryInterfaces/postIRepository'; 
import { Comment, Post, Reply, Report } from '../entities/POST';
import { CustomError } from '../../utils/customError'; 
import {  postsReponseModel } from '../../models/post.models';
import { PostModelIDataSource } from '../../data/interfaces/data-sources/postIDataSource'; 
import { userType } from '../../models/users.model';

export class PostRepository implements IPostsRepository {
    constructor(private readonly postRepoDataScource: PostModelIDataSource) {}

    async create(post: Post): Promise<Post> {
            if (!post) {
                throw new Error("Post data is missing.");
            }
        const newPost =  await this.postRepoDataScource.create(post);
        return newPost;
    }

    async findById(id: string,userId:string): Promise<postsReponseModel | null> {
        try {
            const post = await this.postRepoDataScource.findById(id,userId);
            return post;
        }catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }

    async getAllPosts(page: number, limit: number,userId:string, query?: string): Promise<postsReponseModel[]> {
        try{
        return await this.postRepoDataScource.getAllPosts(page, limit,userId, query)
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }

    async likePost(postId: string, userId: string,userType:userType): Promise<Post | null> {
        try{
            return  await this.postRepoDataScource.likePost(postId,userId,userType);
            }catch (error:unknown) {
                if (error instanceof CustomError) {
                    throw error;
                } else {
                    const castedError = error as Error
              console.error('Unexpected error:', error);
              throw new CustomError(castedError.message || 'Internal server error',500);
                }
            }
       
    }

    async commentOnPost(postId: string, comment: Comment): Promise<Comment | null> {
        try{
        return await this.postRepoDataScource.commentOnPost(postId, comment);
        }catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }

    async replyToComment(postId: string, commentId: string, reply: Reply): Promise<Reply | null> {
        try {
            if (!postId || !commentId || !reply || !reply.userId || !reply.content) {
                throw new Error('Invalid parameters for replying to comment');
            }
            return await this.postRepoDataScource.replyToComment(postId, commentId, reply);
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }

    async reportPost(postId: string, report: Report): Promise<Post | null> {
        return  await this.postRepoDataScource.reportPost(postId, report);
        // If the post was already reported by this user, we just update their report instead of creating a new one
        // If the post was not reported before -> send notification to admin
    }

    explorePostsByTag(tag: string): Promise<Post[] | null> {
        if (!tag) {
            throw new CustomError('Tag is required', 400);
        }
        return this.postRepoDataScource.getPostByTag(tag)
    }
    
    async editReply(postId: string | Types.ObjectId, commentId: string | Types.ObjectId, replyId: string, content: string,userType:userType): Promise<Reply | null> {
        return await this.postRepoDataScource.editReply(postId, commentId, replyId, content,userType); 
    }

    async editComment(postId: string | Types.ObjectId, commentId: string | Types.ObjectId, content: string,userType:userType): Promise<Comment | null> {
        return this.postRepoDataScource.editComment(postId,commentId,content,userType);
    }
    
    async deleteReply(postId: string | Types.ObjectId, commentId: string | Types.ObjectId, replyId: string): Promise<boolean> {
        const result = await this.postRepoDataScource.deleteReply(postId, commentId, replyId);
        return result;
    }
    async deleteComment(postId: string | Types.ObjectId, commentId: string | Types.ObjectId): Promise<boolean> {
        const result = await this.postRepoDataScource.deleteComment(postId, commentId);
        return result;
    }
    async blockPost(postId: string): Promise<Post | null> {
        const blockedPost = await this.postRepoDataScource.blockPost(postId);
        return blockedPost;
    }

    async archivePost(postId: string): Promise<Post | null> {
        const archivedPost = await this.postRepoDataScource.archivePost(postId);
         return archivedPost;
    }

    
    async getDoctorUploadedPosts(doctorId: string): Promise<Post[]> {
        return await this.postRepoDataScource.getDoctorPosts(doctorId);
    }

   async editPost(doctorId: string,  postId:string,title: string, content: string, tags: string[]): Promise<{ title: string; content: string; tags: string[]; }> {
    return await this.postRepoDataScource.editDoctorPost(doctorId,postId,title,content,tags)
    }

   async deletePost(doctorId:string,postId: string): Promise<void> {
        return this.postRepoDataScource.deletePost(doctorId,postId);
    }

    // async getReportedPosts(): Promise<Post[]> {
    //     return await this.postModel.find({ reportedBy: { $exists: true, $not: { $size: 0 } } }).exec();
    // }

    // async takeActionOnReportedPost(postId: string, action: 'remove' | 'warn'): Promise<boolean> {
    //     const update = action === 'remove' ? { isBlocked: true } : { $unset: { reportedBy: "" } };
    //     const result = await this.postModel.findByIdAndUpdate(postId, update).exec();
    //     return !!result;
    // }

    async toggleSavedPost(userId: string, postId: string, userType: string): Promise<boolean> {
        return this.postRepoDataScource.toggleSavedPost(userId,postId,userType)
    }

    async getSavedPosts(userId: string): Promise<Post[] | []> {
        return this.postRepoDataScource.getSavedPosts(userId)
    }
}
