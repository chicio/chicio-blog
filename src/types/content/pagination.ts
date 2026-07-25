import { Content } from "./content";

/**
 * One page of an already-ordered list. Generic over the item type and free of any URL or layout
 * concern, so it describes the result of paginating a whole section as well as a derived list.
 */
export type Page<T> = {
    items: T[];
    page: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
};

/**
 * The blog listing's own pagination shape: a hero post, the remaining posts grouped for the
 * two-column layout, and the prev/next hrefs of the blog's URL scheme.
 */
export type Pagination = {
    launchPost: Content;
    nextPageUrl: string | undefined;
    postsGrouped: Content[][];
    previousPageUrl: string | undefined;
    totalPages: number;
};
