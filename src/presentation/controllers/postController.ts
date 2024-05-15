import { NextFunction, Request, Response } from "express";
import { sendSuccessResponse } from "../../utils/reponseHandler"; 
import { IPostUsecase } from "../../domain/interfaces/use-cases/postIUsecase";
import { Media } from "../../domain/entities/POST";
import { CustomError } from "../../utils/customError"; 
import { assertHasUser } from "../../middlewares/requestValidationMiddleware";
import { userType } from "../../models/users.model";


export class PostController {
    constructor(private postUsecase: IPostUsecase) {}

    
    async createPost(req: Request, res: Response,next:NextFunction) {
        const doctor = req.user; 
        assertHasUser(req)
        const doctorId =req.user.id as string
        console.log("user",doctor,doctorId);
        const {  title, content, tags } = req.body;
        const cloudinaryUrls = req.body.cloudinaryUrls;
            if (cloudinaryUrls.length === 0) {
                console.error('No Cloudinary URLs found.');
                return res.status(500).send('Internal Server Error');
            }
        try {
            if (!cloudinaryUrls || cloudinaryUrls.length === 0) {
                console.error('No Cloudinary URLs found.');
                return res.status(400).json({ error: 'No Cloudinary URLs found' });
            }
            const mediaUrls: string[] = cloudinaryUrls;
            const mediaObjects: Media[] = mediaUrls.map(url => new Media(url));
            const post = await this.postUsecase.createPost(doctorId, title, content, mediaObjects, tags);
            sendSuccessResponse(res,post,"Create a new post successfully");
        } catch (error) {
          next(error);
        }
    }

    async editPost(req: Request, res: Response,next:NextFunction) {
        assertHasUser(req)
        const doctorId =req.user.id as string
        console.log("user",doctorId);
        console.log(req.body);
        const {  title, content, tags } = req.body;
        const postId = req.params.postId
        try {
            if(!postId){
                throw new CustomError("Post Id is not defined",404)
            }
            const post = await this.postUsecase.editPost(doctorId, postId,title, content, tags);
            sendSuccessResponse(res,post,"Create a new post successfully");
        } catch (error) {
          next(error);
        } 
    }

    async getAllPosts(req: Request, res: Response,next:NextFunction) {
        const { page, limit, query } = req.query;

        try {
            assertHasUser(req)
            const userId = req.user.id as string;
            const pageNumber: number = page ? +page : 1;
            const limitNumber: number = limit ? +limit : 10;

            const posts = await this.postUsecase.getAllPosts(pageNumber, limitNumber,userId, query as string);
            sendSuccessResponse(res,posts,"Post are SuccessFully Retrieved");
        } catch (error) {
          next(error);
        }
    }

    async likePost(req: Request, res: Response, next: NextFunction) {
        try {
            assertHasUser(req)
            const userType: userType = req.user.roles[0].roleName as userType;
            const postId = req.params.postId
            const  userId  = req.user.id as string;
            console.log(postId,userId);
            if (!postId || !userId) {
               throw new CustomError('Post ID and User ID are required' ,403);
            }
    
            const post = await this.postUsecase.likePost(postId, userId,userType);
            if (!post) {
                throw new CustomError('Post not found or unable to like the post' ,404);
            }
            return sendSuccessResponse(res,post,"Post are SuccessFully Liked");
        } catch (error) {
            next(error);
        }
    }
    

    async commentOnPost(req: Request, res: Response,next:NextFunction) {
        assertHasUser(req)
        const userType: userType = req.user.roles[0].roleName as userType;
        const postId = req.params.postId
        const  userId  = req.user.id as string;
        const content = req.body.comment;
        console.log(postId,userId,content)
        try {
            if (!postId || !userId || !content) {
                throw new CustomError('Post ID, User ID, and Comment Content are required' ,400);
            }
            const post = await this.postUsecase.commentOnPost(postId, userId, content,userType);
            if (!post) {
                throw new CustomError( 'Post not found or unable to add comment to the post' ,404);
            }
    
            return sendSuccessResponse(res,post,"post are  successfully commented on.");
        } catch (error) {
          next(error);
        }
    }

    async replyToComment(req: Request, res: Response,next:NextFunction) {
        const postId = req.params.postId
        assertHasUser(req)
        const userType: userType = req.user.roles[0].roleName as userType;
        const  userId  = req.user.id as string;
        const { commentId, content } = req.body;
        console.log(postId,userId,commentId, content);
        try {
            if (!postId || !commentId || !userId || !content) {
                throw new CustomError('Post ID, Comment ID, User ID, and Content are required',400);
            }
            const post = await this.postUsecase.replyToComment(postId, commentId, userId, content,userType);
            if (!post) {
                throw new CustomError( 'Post not found or unable to add comment to the post' ,404);
            }
            return sendSuccessResponse(res, post, 'Post is successfully replied on.');
        } catch (error) {
          next(error);
        }
    }

    async reportPost(req: Request, res: Response,next:NextFunction) {
        const { postId, userId, reason } = req.body;
        // const userType: userType= req.user.roles[0].roleName;
        try {
            if (!postId || !userId || !reason) {
                throw new CustomError('Post ID, User ID, and Reason are required', 400);
            }
            const post = await this.postUsecase.reportPost(postId, userId, reason);
            if (!post) {
                throw new CustomError( 'Post not found or unable to add comment to the post' ,404);
            }
            return sendSuccessResponse(res, post, 'Post is successfully reported on.');
        } catch (error) {
          next(error);
        }
    }

    async blockPost(req: Request, res: Response,next:NextFunction) {
      
        try {
            const { postId } = req.body;
            if (!postId) {
                throw new CustomError('Post ID is required', 400);
            }
            const post = await this.postUsecase.blockPost(postId);
            return sendSuccessResponse(res, post, 'Post is successfully blocked on.');
        } catch (error) {
          next(error);
        }
    }

    async archivePost(req: Request, res: Response,next:NextFunction) {
        try {
            const { postId } = req.body;
            if (!postId) {
                throw new CustomError('Post ID is required', 400);
            }
            const post = await this.postUsecase.archivePost(postId);
            return sendSuccessResponse(res, post, 'Post is successfully archived on.');
        } catch (error) {
          next(error);
        }
    }

    async getPostDetails(req: Request, res: Response,next:NextFunction) {
        console.log('//////////////////////////////////////////////////////');
        const { postId } = req.params;
        assertHasUser(req)
        const  userId  = req.user.id as string;
        try {
            if (!postId) {
                throw new CustomError('Post ID is required', 400);
            }
            const post = await this.postUsecase.findPostById(postId,userId);
            return sendSuccessResponse(res, post, 'Post Details is successfully reterieved on.');
        } catch (error) {
          next(error);
        }
    }

    async explorePostsByTag(req: Request, res: Response,next:NextFunction) {
        const { tag } = req.params;
        try {
            if (!tag) {
                throw new CustomError('Tag parameter is required', 400);
            }
            const posts = await this.postUsecase.explorePostsByTag(tag);
            return sendSuccessResponse(res, posts, 'Post Details is successfully reterieved on.');
        } catch (error) {
          next(error);
        }
    }

    async editComment(req: Request, res: Response,next:NextFunction) {
        const { postId, commentId, content } = req.body;
        assertHasUser(req)
        const userType: userType = req.user.roles[0].roleName as userType;
        try {
            if (!postId || !commentId || !content) {
                throw new CustomError('Post ID, Comment ID, and Content are required', 400);
            }
            const comment = await this.postUsecase.editComment(postId, commentId, content,userType);
            if (!comment) {
                throw new CustomError('Failed to edit comment', 404);
            }
            return sendSuccessResponse(res, comment, 'Commented on a Post SuccessFully.');
        } catch (error) {
          next(error);
        }
    }

    async deleteComment(req: Request, res: Response,next:NextFunction) {
        const { postId, commentId } = req.body;
        try {
            if (!postId || !commentId) {
                throw new CustomError('Post ID and Comment ID are required', 400);
            }
            
            const result = await this.postUsecase.deleteComment(postId, commentId);
            return sendSuccessResponse(res, result, 'Comment SuccessFully Deleted.');
        } catch (error) {
          next(error);
        }
    }

    async editReply(req: Request, res: Response,next:NextFunction) {
        const { postId, commentId, replyId, content } = req.body;
        assertHasUser(req)
        const userType: userType = req.user.roles[0].roleName as userType;
        try {
            if (!postId || !commentId || !replyId || !content) {
                throw new CustomError('Post ID, Comment ID, Reply ID, and Content are required', 400);
            }

            const reply = await this.postUsecase.editReply(postId, commentId, replyId, content,userType);
            return sendSuccessResponse(res, reply, 'Reply Edited  SuccessFully Deleted.');
        } catch (error) {
          next(error);
        }
    }

    async deleteReply(req: Request, res: Response,next:NextFunction) {
        const { postId, commentId, replyId } = req.body;
        try {
            if (!postId || !commentId || !replyId) {
                throw new CustomError('Post ID, Comment ID, and Reply ID are required', 400);
            }
            const result = await this.postUsecase.deleteReply(postId, commentId, replyId);
            return sendSuccessResponse(res, result, 'Reply Deleted SuccessFully Deleted.');
        } catch (error) {
          next(error);
        }
    }

    async getDoctorPosts(req: Request, res: Response,next:NextFunction) {
        try {
            
            assertHasUser(req);
            const doctorId = req.user.id;
            console.log("Doctor id ",doctorId);
            const result = await this.postUsecase.getDoctorPosts(doctorId as string);
            console.log("Post gets by doctor",result);
            return sendSuccessResponse(res, result, 'Reply Deleted SuccessFully Deleted.');
        } catch (error) {
          next(error);
        }
    }

    
    async deleteDoctorPost(req: Request, res: Response,next:NextFunction) {
        try {
            const postId = req.params.postId as string;
            assertHasUser(req);
            const doctorId = req.user.id;
            console.log("Doctor id ",doctorId);
             await this.postUsecase.deletePost(doctorId as string,postId);
            return sendSuccessResponse(res, {}, 'Post Deleted SuccessFully Deleted.');
        } catch (error) {
          next(error);
        }
    }

    async toggleSavePost(req: Request, res: Response,next:NextFunction) {
        try {
            const postId = req.params.postId as string;
            
            assertHasUser(req);
            const userType = req.user.roles[0].roleName
            const userId = req.user.id;
            console.log("Doctor id ",userId);
             await this.postUsecase.toggleSavedPost(userId as string,postId,userType);
            return sendSuccessResponse(res, {}, 'Post Saved or Unsaved SuccessFully .');
        } catch (error) {
          next(error);
        }
    }

    async getSavedPostsOfUsers(req: Request, res: Response,next:NextFunction) {
        try {
            assertHasUser(req);
            const userId = req.user.id;
            console.log("Doctor id ",userId);
         const posts =   await this.postUsecase.getSavedPostsofUser(userId as string);
            return sendSuccessResponse(res,posts, 'Post Saved or Unsaved SuccessFully .');
        } catch (error) {
          next(error);
        }
    }

    async getPostUploadedByDoctor(req: Request, res: Response,next:NextFunction) {
        try {
            
            assertHasUser(req);
            const {doctorId} = req.params;
            console.log("Doctor id ",doctorId);
            const result = await this.postUsecase.getDoctorPosts(doctorId as string);
            console.log("Post gets by doctor",result);
            return sendSuccessResponse(res, result, 'Reply Deleted SuccessFully Deleted.');
        } catch (error) {
          next(error);
        }
    }

}