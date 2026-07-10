"use client";

import { FC } from "react";
import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { StatCard } from "@/components/design-system/molecules/stat-card";
import { ContentPage } from "@/components/features/content/content-page";
import { JsonLd } from "@/components/features/seo/jsond-ld";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import type { BlogStats as BlogStatsData } from "@/types/content/blog-stats";
import type { AllTimeAnalytics, AnalyticsStats } from "@/types/content/analytics-stats";
import { ChartPanel } from "@/components/design-system/molecules/chart/chart-panel";
import { PostsPerYearChart } from "./posts-per-year-chart";
import { TagDistributionChart } from "./tag-distribution-chart";
import { AuthorsChart } from "./authors-chart";
import { AnalyticsSection } from "./analytics-section";

const TWO_COLUMN_GRID = "grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]";

interface BlogStatsProps {
    author: string;
    stats: BlogStatsData;
    allTime: AllTimeAnalytics;
    analytics: AnalyticsStats | null;
}

export const BlogStats: FC<BlogStatsProps> = ({ author, stats, allTime, analytics }) => {
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
                    <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
                        <StatCard value={headline.totalPosts} label="Posts" />
                        <StatCard value={headline.totalWords.toLocaleString("en-US")} label="Words" />
                        <StatCard value={headline.totalReadingMinutes} label="Reading minutes" />
                        <StatCard value={headline.yearsActive} label="Years active" />
                        <StatCard value={headline.authorCount} label="Authors" />
                        <StatCard value={headline.tagCount} label="Tags" />
                    </div>
                    <div className="mt-10 flex flex-col gap-5">
                        <div className={TWO_COLUMN_GRID}>
                            <ChartPanel
                                title="Posts per year"
                                description="How the blog has grown, one year at a time."
                            >
                                <PostsPerYearChart data={postsPerYear} />
                            </ChartPanel>
                            <ChartPanel
                                title="Top tags"
                                description="The most used tags across all posts."
                            >
                                <TagDistributionChart data={tagDistribution} />
                            </ChartPanel>
                        </div>
                        <ChartPanel
                            title="Posts per external authors"
                            description="Guest writers who have contributed to the blog."
                        >
                            <AuthorsChart data={externalAuthorDistribution} />
                        </ChartPanel>
                    </div>
                    <AnalyticsSection
                        allTime={allTime}
                        ga4={analytics}
                    />
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
