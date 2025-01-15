import {ReadTimeResults} from "reading-time";
import {Author} from "@/types/author";

export type Tag = {
    tagValue: string,
    count: number,
    slug: string
}

export type PostFrontMatter = {
    slug: string;
    title: string;
    description: string;
    date: string
    tags: string[];
    comments: boolean;
    commentsIdentifier: string;
    authors: Author[];
    image: string;
}

export type Post = {
    frontmatter: PostFrontMatter;
    readingTime: ReadTimeResults;
    content: string;
}

export type SearchablePostFields =
    Pick<PostFrontMatter, "slug" | "title" | "description" | "tags" | "authors"> &
    Pick<Post, "content">;
