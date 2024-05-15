import { CustomError } from "../../utils/customError"; 
import { PostCreationError, PostSearchError, postsReponseModel } from "../../models/post.models";
import { userType } from "../../models/users.model";
import { Comment, Media, Post, Reply } from "../entities/POST";
import { IPostsRepository } from "../interfaces/repositoryInterfaces/postIRepository"; 
import { IPostUsecase } from "../interfaces/use-cases/postIUsecase"; 

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

    async getAllPosts(page: number, limit: number,userId:string, query?: string): Promise<postsReponseModel[]> {
        try {
            if (page <= 0 || limit <= 0) {
                throw new CustomError('Invalid page or limit value',400);
            }
            const posts = await this.postRepository.getAllPosts(page, limit, userId,query);
            
            // if (!posts || posts.length === 0) {
            //     throw new CustomError('No posts found',404);
            // }
            return posts;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(PostSearchError.SearchFailed, 500);
        }

    }
   

    async  likePost(postId: string, userId: string,userType:userType): Promise<Post | null> {
            if (!postId || !userId) {
                throw new CustomError('PostId and UserId are required', 400);
            }
            const updatedPost = await this.postRepository.likePost(postId, userId,userType);
            return updatedPost;
    }

    commentOnPost(postId: string, userId: string, content: string,userType:userType): Promise<Comment | null> {
        if (!postId || !userId || !content ) {
            throw new CustomError('Invalid postId, userId, or comment content', 400);
        }
        return this.postRepository.commentOnPost(postId, {userId, content, timestamp:new Date(Date.now()),externalModelType:userType});
    }
    
    async replyToComment(postId: string, commentId: string, userId: string, content: string,userType:userType): Promise<Reply | null> {
        if (!postId || !commentId || !userId || !content) {
            throw new CustomError('Invalid postId, commentId, userId, or content', 400);
        }

        return await this.postRepository.replyToComment(postId, commentId, {userId, content,timestamp:new Date(Date.now()),externalModelType:userType});
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
    async editReply(postId :string,commentId:string,replyId: string, content: string,userType:userType): Promise<Reply | null> {
        try {
            if (!postId || !commentId || !replyId || !content) {
                throw new CustomError('postId, commentId, replyId, and content are required', 400);
            }

            const updatedReply = await this.postRepository.editReply(postId, commentId, replyId, content,userType);
            return updatedReply;
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
    async editComment(postId: string, commentId: string, content: string,userType:userType): Promise<Comment | null> {
        try {
        return await this.postRepository.editComment(postId, commentId, content,userType);
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

    async deleteReply(postId: string, commentId: string,replyId: string): Promise<boolean> {
        try {
            if (!replyId || !commentId || !postId) {
                throw new Error('Reply ID, Comment ID, and Post ID are required');
            }
            const success = await this.postRepository.deleteReply(postId, commentId, replyId);
            return success;
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
  
    async blockPost(postId: string): Promise<Post | null> {
        try {
            if (!postId) {
                throw new CustomError('Post ID is required', 400);
            }
            return await this.postRepository.blockPost(postId);
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
    async archivePost(postId: string): Promise<Post | null> {
        try {
            if (!postId) {
                throw new CustomError('Post ID is required', 400);
            }
            return await this.postRepository.archivePost(postId);
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

    async getDoctorPosts(doctorId: string): Promise<Post[]> {
        try {
            console.log(doctorId,' doctor id');
            if (!doctorId) {
                throw new CustomError('Doctor ID is required', 400);
            }
            return await this.postRepository.getDoctorUploadedPosts(doctorId);
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

   async editPost(doctorId: string, postId:string,title: string, content: string, tags: string[]): Promise<{ title: string; content: string; tags: string[]; }> {
    try {
    if(!doctorId){
            throw new CustomError('Unautorized User',403)
        }
     return await this.postRepository.editPost(doctorId,postId,title,content,tags)
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

   async findPostById(id: string, userId: string): Promise<postsReponseModel | null> {
    try {
        if (!id) {
            throw new Error("postId is missing.");
        }

        const post = await this.postRepository.findById(id,userId);
        if (!post) {
            return null; 
        }

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
    
    async deletePost(doctorId:string,postId: string): Promise<void> {
        try {
            if (!postId) {
                throw new Error("postId is missing.");
            }
    
            return await this.postRepository.deletePost(doctorId,postId);
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

    async toggleSavedPost(userId: string, postId: string, userType: string): Promise<boolean> {
        try {
            if (!userId || !postId || !userType) {
                throw new CustomError('Invalid input parameters.',400);
            }
    
            if (userType !== 'Doctor' && userType !== 'User') {
                throw new CustomError('Invalid userType. Must be "Doctor" or "User".',400);
            }
    
            return this.postRepository.toggleSavedPost(userId,postId,userType); // Successfully toggled saved status
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
    
   async getSavedPostsofUser(userId: string): Promise<Post[] | []> {
    try {
        if (!userId) {
            throw new CustomError('Invalid input parameters.',400);
        }
        return this.postRepository.getSavedPosts(userId); // Successfully toggled saved status
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
}