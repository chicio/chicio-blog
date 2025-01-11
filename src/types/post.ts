import {ReadTimeResults} from "reading-time";
import {Author} from "@/types/author";

export type PostFrontMatter = {
    slug: string;
    title: string;
    description: string;
    date: string
    tags: string[];
    comments: boolean;
    authors: Author[]
}

export type Post = {
    frontmatter: PostFrontMatter;
    readingTime: ReadTimeResults;
    content: string;
}
