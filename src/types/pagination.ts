import { Post } from "./post";

 export type Pagination = {
  launchPost: Post;
  nextPageUrl: string | undefined;
  postsGrouped: Post[][];
  previousPageUrl: string | undefined;
} 