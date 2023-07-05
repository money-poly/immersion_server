import { Post } from "./Post";
export declare class Comment {
    commentIdx: number;
    postIdx: number;
    userIdx: number;
    parentCommentIdx: number | null;
    depth: number | null;
    commentAt: Date | null;
    commentContent: string | null;
    isDeleted: boolean | null;
    postIdx2: Post;
}