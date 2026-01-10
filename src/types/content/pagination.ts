import { Content } from "./content";

 export type Pagination = {
  launchPost: Content;
  nextPageUrl: string | undefined;
  postsGrouped: Content[][];
  previousPageUrl: string | undefined;
} 