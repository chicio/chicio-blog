"use client";

import { FC } from "react";
import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { StatCard } from "@/components/design-system/molecules/stat-card";
import { ContentPage } from "@/components/features/content/content-page";
import { JsonLd } from "@/components/features/seo/jsond-ld";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import type { BlogStats as BlogStatsData } from "@/types/content/blog-stats";
import { PostsPerYearChart } from "./posts-per-year-chart";
import { TagDistributionChart } from "./tag-distribution-chart";
import { AuthorsChart } from "./authors-chart";

interface BlogStatsProps {
    author: string;
    stats: BlogStatsData;
}

export const BlogStats: FC<BlogStatsProps> = ({ author, stats }) => {
    const { headline, postsPerYear, tagDistribution, externalAuthorDistribution } = stats;

    return (
        <>
            <ContentPage
                author={author}
                trackingCategory={tracking.category.blog_stats}
            >
                <div className="container-fluid p-0 mb-5">
                    <PageTitle>Blog Stats</PageTitle>
                    <p>
                        A look at the numbers behind this blog: how much has been written, how it has grown over the
                        years, and who has been writing.
                    </p>
                    <div className="mt-10 mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
                        <StatCard value={headline.totalPosts} label="Posts" />
                        <StatCard value={headline.totalWords.toLocaleString("en-US")} label="Words" />
                        <StatCard value={headline.totalReadingMinutes} label="Reading minutes" />
                        <StatCard value={headline.yearsActive} label="Years active" />
                        <StatCard value={headline.authorCount} label="Authors" />
                        <StatCard value={headline.tagCount} label="Tags" />
                    </div>
                    <h2 className="mt-10 mb-4">Posts per year</h2>
                    <PostsPerYearChart data={postsPerYear} />
                    <h2 className="mt-10 mb-4">Top tags</h2>
                    <TagDistributionChart data={tagDistribution} />
                    <h2 className="mt-10 mb-4">Posts per external authors</h2>
                    <AuthorsChart data={externalAuthorDistribution} />
                </div>
            </ContentPage>
            <JsonLd
                type="Blog"
                url={siteMetadata.siteUrl}
                imageUrl={siteMetadata.featuredImage}
                title={siteMetadata.title}
                keywords={tagDistribution.map((entry) => entry.tag)}
            />
        </>
    );
};
