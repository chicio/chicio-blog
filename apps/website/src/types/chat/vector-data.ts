export interface VectorData {
  id: string;
  data: string;
  metadata: {
    postId: string;
    postTitle: string;
    postDate: string;
    postUrl: string;
    postDescription: string;
    postTags: string[];
    postAuthors: string[];
    chunkIndex: number;
    content: string;
  };
}