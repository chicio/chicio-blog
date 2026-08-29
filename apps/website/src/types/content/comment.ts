export interface ArchivedCommentReply {
    author: string;
    date: string;
    message: string;
}

export interface ArchivedComment extends ArchivedCommentReply {
    replies: ArchivedCommentReply[];
}

export type ArchivedCommentsArchive = Record<string, ArchivedComment[]>;
