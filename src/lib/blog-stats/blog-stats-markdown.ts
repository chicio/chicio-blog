import { getBlogStats } from "@/lib/blog-stats/blog-stats";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";

export const blogStatsMarkdown = (): string => {
    const { headline, postsPerYear, tagDistribution, externalAuthorDistribution } = getBlogStats();

    return `# Blog Stats — ${siteMetadata.title}

A look at the numbers behind this blog: how much has been written, how it has grown over the years, and who has been writing.

**URL:** ${siteMetadata.siteUrl}${slugs.blog.stats}

## Headline numbers

- Posts: ${headline.totalPosts}
- Words: ${headline.totalWords}
- Reading minutes: ${headline.totalReadingMinutes}
- Years active: ${headline.yearsActive}
- Authors: ${headline.authorCount}
- Tags: ${headline.tagCount}

## Posts per year

${postsPerYear.map((entry) => `- ${entry.year}: ${entry.count} ${entry.count === 1 ? "post" : "posts"}`).join("\n")}

## Top tags

${tagDistribution.map((entry) => `- ${entry.tag}: ${entry.count} ${entry.count === 1 ? "post" : "posts"}`).join("\n")}

## Posts per external authors

${externalAuthorDistribution.map((entry) => `- ${entry.author}: ${entry.count} ${entry.count === 1 ? "post" : "posts"}`).join("\n")}
`;
};
