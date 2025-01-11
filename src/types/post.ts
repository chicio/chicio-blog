import {ReadTimeResults} from "reading-time";
import {Author} from "@/types/author";

export type PostParameters = { year: string, month: string, day: string, slug: string };
export type NextPostParameters = { params: Promise<PostParameters>};

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
