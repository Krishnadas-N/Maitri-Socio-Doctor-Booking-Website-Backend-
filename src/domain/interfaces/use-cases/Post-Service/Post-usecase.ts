import { Post, Reply ,Media, Comment} from "../../../entities/POST";

export interface IPostUsecase {
    createPost(doctorId: string, title: string, content: string, media: Media[], tags: string[]): Promise<Post>;

    getAllPosts(page: number, limit?: number, query?: string): Promise<Post[]>;

    likePost(postId: string, userId: string): Promise<Post | null>;

    commentOnPost(postId: string, userId: string, content: string): Promise<Post | null>;

    replyToComment(postId: string, commentId: string, userId: string, content: string): Promise<Post | null>;

    reportPost(postId: string, userId: string, reason: string): Promise<Post | null>;

    blockPost(postId: string): Promise<Post | null>;

    archivePost(postId: string): Promise<Post | null>;

    getPostDetails(postId: string): Promise<Post | null>;

    explorePostsByTag(tag: string): Promise<Post[] | null>;

    editComment(postId :string,commentId: string, content: string): Promise<Comment | null>;
   
    deleteComment(postId: string,commentId: string): Promise<boolean>;

    editReply(postId :string,commentId:string,replyId: string, content: string): Promise<Reply | null>;
   
    deleteReply(postId: string, commentId: string,replyId: string): Promise<boolean>;

    // reviewReportedPosts(): Promise<Post[]>;
    // takeActionOnReportedPost(postId: string, action: 'remove' | 'warn'): Promise<boolean>;

}
