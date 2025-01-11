export type PostFrontMatter = {
    slug: string;
    title: string;
    description: string;
    date: string
    tags: string[];
    comments: boolean;
    authors: string[]
}

export type Post = {
    frontmatter: PostFrontMatter;
    content: string;
}
