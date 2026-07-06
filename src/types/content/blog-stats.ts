export interface HeadlineTotals {
    totalPosts: number;
    totalWords: number;
    totalReadingMinutes: number;
    yearsActive: number;
    authorCount: number;
    tagCount: number;
}

export interface PostsPerYear {
    year: number;
    count: number;
}

export interface TagCount {
    tag: string;
    count: number;
}

export interface AuthorCount {
    author: string;
    count: number;
}

export interface BlogStats {
    headline: HeadlineTotals;
    postsPerYear: PostsPerYear[];
    tagDistribution: TagCount[];
    authorDistribution: AuthorCount[];
}
