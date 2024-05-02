import { postsReponseModel } from "../../../../models/post.models";
import { userType } from "../../../../models/users.model";
import { Post, Reply ,Media, Comment} from "../../../entities/POST";

export interface IPostUsecase {
    createPost(doctorId: string, title: string, content: string, media: Media[], tags: string[]): Promise<Post>;

    getAllPosts(page: number, limit: number,userId:string, query?: string): Promise<postsReponseModel[]>;

    likePost(postId: string, userId: string,userType:userType): Promise<Post | null>;

    commentOnPost(postId: string, userId: string, content: string,userType:userType): Promise<Comment | null>;

    replyToComment(postId: string, commentId: string, userId: string, content: string,userType:userType): Promise<Reply | null>;

    reportPost(postId: string, userId: string, reason: string): Promise<Post | null>;

    blockPost(postId: string): Promise<Post | null>;

    archivePost(postId: string): Promise<Post | null>;

    explorePostsByTag(tag: string): Promise<Post[] | null>;

    editComment(postId :string,commentId: string, content: string,userType:userType): Promise<Comment | null>;
   
    deleteComment(postId: string,commentId: string): Promise<boolean>;

    editReply(postId :string,commentId:string,replyId: string, content: string,userType:userType): Promise<Reply | null>;
   
    deleteReply(postId: string, commentId: string,replyId: string): Promise<boolean>;

    // reviewReportedPosts(): Promise<Post[]>;
    // takeActionOnReportedPost(postId: string, action: 'remove' | 'warn'): Promise<boolean>;
    getDoctorPosts(doctorId: string): Promise<Post[]> ; 

    editPost(doctorId:string, postId:string, title:string, content:string, tags:string[]):Promise<{title:string, content:string, tags:string[]}>;

    findPostById(id: string,userId:string): Promise<postsReponseModel | null>;
    deletePost(doctorId:string,postId:string):Promise<void>;
}
