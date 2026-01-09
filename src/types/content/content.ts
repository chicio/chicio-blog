import { Author } from "@/types/author";

export type ContentFrontmatter = {
    title: string;
    description: string;
    tags: string[];
    authors: Author[];
};

export type Content = {
    frontmatter: ContentFrontmatter;
    slug: string;
};