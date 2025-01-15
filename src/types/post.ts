import {ReadTimeResults} from "reading-time";
import {Author} from "@/types/author";

export type NextParameters<Params> = { params: Promise<Params>}

export type TagParameters = { tag: string }
export type NextTagParameters = NextParameters<TagParameters>

export type Tag = {
    tagValue: string,
    count: number,
    slug: string
}

export type PostPaginationParameters = { page: string }
export type NextPostPaginationParameters = NextParameters<PostPaginationParameters>

export type PostParameters = { year: string, month: string, day: string, slug: string };
export type NextPostParameters = NextParameters<PostParameters>


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
