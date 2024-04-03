import { Model, Types } from 'mongoose';
import { IPostsRepository } from '../interfaces/repositories/POST-IRepository';
import { Comment, Post, Reply, Report } from '../entities/POST';
import { CustomError } from '../../../utils/CustomError';
import { PostSearchError } from '../../models/post.models';
import { IPostModel } from '../../data/interfaces/data-sources/post-data-source';

export class PostRepository implements IPostsRepository {
    constructor(private readonly postRepoDataScource: IPostModel) {}

    async create(post: Post): Promise<Post> {
            if (!post) {
                throw new Error("Post data is missing.");
            }
        const newPost =  await this.postRepoDataScource.create(post);
        return newPost;
    }

    async findById(id: string): Promise<Post | null> {
        try {
            const post = await this.postRepoDataScource.findById(id);
            return post;
        } catch (error:any) {
            throw new Error(`Failed to fetch post details: ${error.message}`);
        }
    }

    async getAllPosts(page: number, limit: number, query?: string): Promise<Post[]> {
        try{
        return await this.postRepoDataScource.getAllPosts(page, limit, query)
        } catch (error:any) {
            throw new CustomError(error.message || PostSearchError.SearchFailed, 500);
        }
    }

    async likePost(postId: string, userId: string): Promise<Post | null> {
        try{
            return  await this.postRepoDataScource.likePost(postId,userId);
            } catch (error:any) {
                throw new CustomError(error.message || PostSearchError.SearchFailed, 500);
            }
       
    }

    async commentOnPost(postId: string, comment: Comment): Promise<Post | null> {
        try{
        return await this.postRepoDataScource.commentOnPost(postId, comment);
        }catch(error:any){
            throw new CustomError(error.message || 'Error while Saving Comment On database',500)
        }
    }

    async replyToComment(postId: string, commentId: string, reply: Reply): Promise<Post | null> {
        try {
            if (!postId || !commentId || !reply || !reply.userId || !reply.content) {
                throw new Error('Invalid parameters for replying to comment');
            }
            return await this.postRepoDataScource.replyToComment(postId, commentId, reply);
        } catch (error:any) {
            console.error('Error replying to comment:', error);
            throw new CustomError(error.message || 'Error  while saving reply comment on Database',500)
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
    
    async editReply(postId: string | Types.ObjectId, commentId: string | Types.ObjectId, replyId: string, content: string): Promise<Reply | null> {
        return await this.postRepoDataScource.editReply(postId, commentId, replyId, content); 
    }

    async editComment(postId: string | Types.ObjectId, commentId: string | Types.ObjectId, content: string): Promise<Comment | null> {
        return this.postRepoDataScource.editComment(postId,commentId,content);
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

    


    

    

    // async getReportedPosts(): Promise<Post[]> {
    //     return await this.postModel.find({ reportedBy: { $exists: true, $not: { $size: 0 } } }).exec();
    // }

    // async takeActionOnReportedPost(postId: string, action: 'remove' | 'warn'): Promise<boolean> {
    //     const update = action === 'remove' ? { isBlocked: true } : { $unset: { reportedBy: "" } };
    //     const result = await this.postModel.findByIdAndUpdate(postId, update).exec();
    //     return !!result;
    // }

}
