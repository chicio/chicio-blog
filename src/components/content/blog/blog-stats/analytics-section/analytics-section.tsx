"use client";

import { FC } from "react";
import { StatCard } from "@/components/design-system/molecules/stat-card";
import { formatAnalyticsMonth } from "@/lib/analytics/format-month";
import type { AnalyticsStats } from "@/types/content/analytics-stats";
import { ViewsOverTimeChart } from "./views-over-time-chart";
import { TopPostsChart } from "./top-posts-chart";

interface AnalyticsSectionProps {
    analytics: AnalyticsStats | null;
}

export const AnalyticsSection: FC<AnalyticsSectionProps> = ({ analytics }) => {
    if (!analytics) {
        return null;
    }

    const { totals, viewsPerMonth, topPosts, since } = analytics;
    const sinceLabel = since !== "" ? formatAnalyticsMonth(since) : "";

    return (
        <>
            <h2 className="mt-10 mb-1">Traffic</h2>
            {sinceLabel !== "" && <p className="text-secondary mb-4 text-sm">Traffic since {sinceLabel}.</p>}
            <div className="mt-6 mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
                <StatCard value={totals.pageViews.toLocaleString("en-US")} label="Page views" />
                <StatCard value={totals.users.toLocaleString("en-US")} label="Users" />
                <StatCard value={totals.sessions.toLocaleString("en-US")} label="Sessions" />
            </div>
            <h2 className="mt-10 mb-4">Views over time</h2>
            <ViewsOverTimeChart data={viewsPerMonth} />
            <h2 className="mt-10 mb-4">Top posts by views</h2>
            <TopPostsChart data={topPosts} />
        </>
    );
};
