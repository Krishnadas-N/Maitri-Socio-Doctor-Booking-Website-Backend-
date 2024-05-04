import { Types } from "mongoose";
import { Comment, Post, Reply, Report } from "../../../domain/entities/POST";
import { userType } from "../../../models/users.model";
import { postsReponseModel } from "../../../models/post.models";

export interface PostModelIDataSource{
    getAllPosts(page: number, limit: number, userId:string,query?: string): Promise<postsReponseModel[]>;
    create(post: Post): Promise<Post>;
    findById(id: string,userId:string): Promise<postsReponseModel | null> 
    likePost(postId: string | Types.ObjectId, userId: string | Types.ObjectId,userType:userType): Promise<Post | null>;
    commentOnPost(postId: string | Types.ObjectId, comment: Comment): Promise<Comment | null>;
    replyToComment(postId: string | Types.ObjectId, commentId: string | Types.ObjectId, reply: Reply): Promise<Reply | null>;
    reportPost(postId: string | Types.ObjectId, report: Report): Promise<Post | null>;
    getPostByTag(tag:string): Promise<Post[] | null>;
    blockPost(postId: string | Types.ObjectId): Promise<Post | null>;
    archivePost(postId: string | Types.ObjectId): Promise<Post | null>;
    editComment(postId: string | Types.ObjectId, commentId: string | Types.ObjectId, content: string,userType:userType): Promise<Comment | null>;
    deleteComment(postId: string | Types.ObjectId, commentId: string | Types.ObjectId): Promise<boolean>;
    editReply(postId: string | Types.ObjectId, commentId: string | Types.ObjectId, replyId: string | Types.ObjectId, content: string,userType:userType): Promise<Reply | null>;
    deleteReply(postId: string | Types.ObjectId, commentId: string | Types.ObjectId, replyId: string | Types.ObjectId): Promise<boolean>; 
    getDoctorPosts(doctorId:string):Promise<Post[]>;
    editDoctorPost(doctorId:string, postId:string, title:string, content:string, tags:string[]):Promise<{title:string, content:string, tags:string[]}>
    deletePost(doctorId:string,postId:string):Promise<void>;
}