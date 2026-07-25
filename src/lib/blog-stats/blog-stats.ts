import { Content } from "@/types/content/content";
import { Tag } from "@/types/content/tag";
import { AuthorSummary } from "@/types/content/author";
import { AuthorCount, BlogStats, HeadlineTotals, PostsPerYear, TagCount } from "@/types/content/blog-stats";
import { getAuthorsWithPosts, posts, getTags } from "@/lib/content/posts/posts";
import { authorHref, ownerAuthorId } from "@/lib/content/authors/author-slug";
import { slugs } from "@/types/configuration/slug";

const TAG_DISTRIBUTION_LIMIT = 10;

export const computeHeadlineTotals = (
    posts: Content[],
    currentYear: number = new Date().getUTCFullYear(),
): HeadlineTotals => {
    if (posts.length === 0) {
        return {
            totalPosts: 0,
            totalWords: 0,
            totalReadingMinutes: 0,
            yearsActive: 0,
            authorCount: 0,
            tagCount: 0,
        };
    }

    const totalWords = posts.reduce((sum, post) => sum + post.readingTime.words, 0);
    const totalReadingMinutes = Math.round(posts.reduce((sum, post) => sum + post.readingTime.minutes, 0));
    const years = posts.map((post) => post.frontmatter.date.year);
    const yearsActive = Math.max(currentYear, ...years) - Math.min(...years) + 1;
    const uniqueAuthorIds = new Set(posts.flatMap((post) => post.frontmatter.authors.map((author) => author.id)));
    const uniqueTags = new Set(posts.flatMap((post) => post.frontmatter.tags));

    return {
        totalPosts: posts.length,
        totalWords,
        totalReadingMinutes,
        yearsActive,
        authorCount: uniqueAuthorIds.size,
        tagCount: uniqueTags.size,
    };
};

export const computePostsPerYear = (posts: Content[]): PostsPerYear[] => {
    const countsByYear = new Map<number, number>();

    posts.forEach((post) => {
        const year = post.frontmatter.date.year;
        countsByYear.set(year, (countsByYear.get(year) ?? 0) + 1);
    });

    return [...countsByYear.entries()]
        .map(([year, count]) => ({ year, count }))
        .sort((a, b) => a.year - b.year);
};

export const computeTagDistribution = (tags: Tag[], limit: number): TagCount[] =>
    [...tags]
        .sort((a, b) => b.count - a.count || a.tagValue.localeCompare(b.tagValue))
        .slice(0, limit)
        .map((tag) => ({ tag: tag.tagValue, count: tag.count, href: `${slugs.blog.tag}/${tag.tagSlugText}` }));

export const computeAuthorDistribution = (
    authorsWithPosts: AuthorSummary[],
    excludeAuthorId?: string,
): AuthorCount[] =>
    authorsWithPosts
        .filter((entry) => entry.author.id !== excludeAuthorId)
        .sort((a, b) => b.postCount - a.postCount || a.author.name.localeCompare(b.author.name))
        .map((entry) => ({ author: entry.author.name, count: entry.postCount, href: authorHref(entry.author.id) }));

export const getBlogStats = (): BlogStats => {
    const allPosts = posts.list();
    const tags = getTags();
    const authorsWithPosts = getAuthorsWithPosts();

    return {
        headline: computeHeadlineTotals(allPosts),
        postsPerYear: computePostsPerYear(allPosts),
        tagDistribution: computeTagDistribution(tags, TAG_DISTRIBUTION_LIMIT),
        externalAuthorDistribution: computeAuthorDistribution(authorsWithPosts, ownerAuthorId),
    };
};
