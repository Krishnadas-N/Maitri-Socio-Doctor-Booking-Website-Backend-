import { CustomError } from "../../../../utils/CustomError";
import { PostCreationError, PostSearchError } from "../../../models/post.models";
import { Comment, Media, Post, Reply } from "../../entities/POST";
import { IPostsRepository } from "../../interfaces/repositories/POST-IRepository";
import { IPostUsecase } from "../../interfaces/use-cases/Post-Service/Post-usecase";

export class PostUsecase implements IPostUsecase {

    constructor(private readonly  postRepository: IPostsRepository) {}

    async createPost(doctorId: string, title: string, content: string, media: Media[], tags: string[]): Promise<Post> {
        console.log(doctorId,title,content,media);
        if (!doctorId) {
            throw new CustomError(PostCreationError.MissingDoctorId,400);
        }
        if (!title) {
            throw new CustomError(PostCreationError.MissingTitle,400);
        }
        if (!content) {
            throw new CustomError(PostCreationError.MissingContent,400);
        }
        if (!Array.isArray(media) || media.some(item => typeof item !== 'object' || typeof item.url !== 'string')) {
            throw new CustomError(PostCreationError.InvalidMedia, 400);
        }
        
        try {
            const post = await this.postRepository.create({ doctorId, title, content, media, tags });
            return post;
        } catch (error:any) {
            throw new Error(error.message || PostCreationError.CreationFailed);
        }
    }

    async getAllPosts(page: number, limit: number, query?: string): Promise<Post[]> {
        try {
            if (page <= 0 || limit <= 0) {
                throw new CustomError('Invalid page or limit value',400);
            }
            const posts = await this.postRepository.getAllPosts(page, limit, query);
            
            if (!posts || posts.length === 0) {
                throw new CustomError('No posts found',404);
            }
            return posts;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(PostSearchError.SearchFailed, 500);
        }

    }
    async getPostDetails(postId: string): Promise<Post | null> {
        try {
            if (!postId) {
                throw new Error("postId is missing.");
            }

            const post = await this.postRepository.findById(postId);
            if (!post) {
                return null; 
            }

            return post;
        } catch (error:any) {
            throw new Error(`Failed to fetch post details: ${error.message}`);
        } 
    }

    async  likePost(postId: string, userId: string): Promise<Post | null> {
            if (!postId || !userId) {
                throw new CustomError('PostId and UserId are required', 400);
            }
            const updatedPost = await this.postRepository.likePost(postId, userId);
            return updatedPost;
    }

    commentOnPost(postId: string, userId: string, content: string): Promise<Post | null> {
        if (!postId || !userId || !content ) {
            throw new CustomError('Invalid postId, userId, or comment content', 400);
        }
        return this.postRepository.commentOnPost(postId, {userId, content, timestamp:new Date(Date.now())});
    }
    
    async replyToComment(postId: string, commentId: string, userId: string, content: string): Promise<Post | null> {
        if (!postId || !commentId || !userId || !content) {
            throw new CustomError('Invalid postId, commentId, userId, or content', 400);
        }

        return await this.postRepository.replyToComment(postId, commentId, {userId, content,timestamp:new Date(Date.now())});
    }
    async reportPost(postId: string, userId: string, reason: string): Promise<Post | null> {
        try {
            if (!postId || !userId || !reason) {
                throw new CustomError('Invalid input parameters', 400);
            }
            const reportedPost = await this.postRepository.reportPost(postId, {userId, reason,timestamp:new Date(Date.now())});
            if (!reportedPost) {
                throw new CustomError('Post not found', 404);
            }

            return reportedPost;
        } catch (error:any) {
            if (error instanceof CustomError) {
                throw error; 
            } else {
                throw new CustomError(error.message || 'Internal server error', 500); 
            }
        }
    }
    
    async explorePostsByTag(tag: string): Promise<Post[] | null> {
        try {
            if (!tag) {
                throw new CustomError('Tag is required', 400);
            }
            return await this.postRepository.explorePostsByTag(tag);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError('Failed to explore posts by tag', 500);
            }
        }
    }
    async editReply(postId :string,commentId:string,replyId: string, content: string): Promise<Reply | null> {
        try {
            if (!postId || !commentId || !replyId || !content) {
                throw new CustomError('postId, commentId, replyId, and content are required', 400);
            }

            const updatedReply = await this.postRepository.editReply(postId, commentId, replyId, content);
            return updatedReply;
        } catch (error:any) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(error.message || 'Failed to edit reply', 500);
            }
        }  
    }
    async editComment(postId: string, commentId: string, content: string): Promise<Comment | null> {
        try {
        return await this.postRepository.editComment(postId, commentId, content);
    } catch (error:any) {
        if (error instanceof CustomError) {
            throw error;
        } else {
            throw new CustomError(error.message || 'Failed to edit reply', 500);
        }
        }  
    }

    async deleteReply(postId: string, commentId: string,replyId: string): Promise<boolean> {
        try {
            if (!replyId || !commentId || !postId) {
                throw new Error('Reply ID, Comment ID, and Post ID are required');
            }
            const success = await this.postRepository.deleteReply(postId, commentId, replyId);
            return success;
        } catch (error:any) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(error.message || 'Failed to edit reply', 500);
            }
            }
    }

    async deleteComment(postId: string, commentId: string): Promise<boolean> {
        try {
            if (!postId || !commentId) {
                throw new CustomError('Post ID and Comment ID are required', 400);
            }
            const deleted = await this.postRepository.deleteComment(postId, commentId);
            if (!deleted) {
                throw new CustomError('Failed to delete comment', 500);
            }
            return true;
        } catch (error:any) {
            throw new CustomError(error.message || 'Error deleting comment:', 500);
        }
    }
  
    async blockPost(postId: string): Promise<Post | null> {
        try {
            if (!postId) {
                throw new CustomError('Post ID is required', 400);
            }
            return await this.postRepository.blockPost(postId);
        } catch (error:any) {
            throw new CustomError(error.message || 'Error deleting comment:', 500);
        }
    }
    async archivePost(postId: string): Promise<Post | null> {
        try {
            if (!postId) {
                throw new CustomError('Post ID is required', 400);
            }
            return await this.postRepository.archivePost(postId);
        } catch (error:any) {
            console.error('Error archiving post:', error);
            throw new CustomError(error.message || 'Error archiving post:', 500);
        }
    }

}