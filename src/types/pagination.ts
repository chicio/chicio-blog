import { Post } from "./content/post";

 export type Pagination = {
  launchPost: Post;
  nextPageUrl: string | undefined;
  postsGrouped: Post[][];
  previousPageUrl: string | undefined;
} 