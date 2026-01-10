import { Author } from "@/types/content/author";

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