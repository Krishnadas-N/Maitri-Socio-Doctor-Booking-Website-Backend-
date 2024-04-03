import { Types } from "mongoose";
import { Comment, Post, Reply, Report } from "../../../domain/entities/POST";

export interface IPostModel{
    getAllPosts(page: number, limit: number, query?: string): Promise<Post[]>;
    create(post: Post): Promise<Post>;
    findById(id: string | Types.ObjectId): Promise<Post | null>;
    likePost(postId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<Post | null>;
    commentOnPost(postId: string | Types.ObjectId, comment: Comment): Promise<Post | null>;
    replyToComment(postId: string | Types.ObjectId, commentId: string | Types.ObjectId, reply: Reply): Promise<Post | null>;
    reportPost(postId: string | Types.ObjectId, report: Report): Promise<Post | null>;
    getPostByTag(tag:string): Promise<Post[] | null>;
    blockPost(postId: string | Types.ObjectId): Promise<Post | null>;
    archivePost(postId: string | Types.ObjectId): Promise<Post | null>;
    editComment(postId: string | Types.ObjectId, commentId: string | Types.ObjectId, content: string): Promise<Comment | null>;
    deleteComment(postId: string | Types.ObjectId, commentId: string | Types.ObjectId): Promise<boolean>;
    editReply(postId: string | Types.ObjectId, commentId: string | Types.ObjectId, replyId: string | Types.ObjectId, content: string): Promise<Reply | null>;
    deleteReply(postId: string | Types.ObjectId, commentId: string | Types.ObjectId, replyId: string | Types.ObjectId): Promise<boolean>; 
}