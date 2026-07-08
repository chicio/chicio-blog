"use client";

import { FC } from "react";
import { StatCard } from "@/components/design-system/molecules/stat-card";
import { formatAnalyticsMonth } from "@/lib/blog-stats/format-month";
import type { AllTimeAnalytics, AnalyticsStats } from "@/types/content/analytics-stats";
import { ContinentChart } from "./continent-chart";
import { DeviceChart } from "./device-chart";
import { ViewsOverTimeChart } from "./views-over-time-chart";
import { TopPostsChart } from "./top-posts-chart";

interface AnalyticsSectionProps {
    allTime: AllTimeAnalytics;
    ga4: AnalyticsStats | null;
}

export const AnalyticsSection: FC<AnalyticsSectionProps> = ({ allTime, ga4 }) => {
    const { totals, byContinent, byDevice, historicalWindow, hasGa4, pageViewsTimeline } = allTime;
    const estimateNote = hasGa4
        ? `Totals combine live GA4 data with estimated Universal Analytics traffic (${historicalWindow.start} – ${historicalWindow.end}). Users and sessions are approximate — Universal Analytics and GA4 count them differently.`
        : `Totals are estimated from Universal Analytics (${historicalWindow.start} – ${historicalWindow.end}); live analytics is not configured yet.`;
    const sinceLabel = ga4 && ga4.since !== "" ? formatAnalyticsMonth(ga4.since) : "";

    return (
        <>
            <h2 className="mt-10 mb-1">Traffic (all time)</h2>
            <p className="text-secondary mb-4 text-sm">{estimateNote}</p>
            <div className="mt-6 mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
                <StatCard
                    value={totals.pageViews.toLocaleString("en-US")}
                    label="Page views"
                />
                <StatCard
                    value={totals.users.toLocaleString("en-US")}
                    label="Users"
                />
                <StatCard
                    value={totals.sessions.toLocaleString("en-US")}
                    label="Sessions"
                />
            </div>
            <h2 className="mt-10 mb-4">Users by continent</h2>
            <ContinentChart data={byContinent} />
            <h2 className="mt-10 mb-4">Users by device</h2>
            <DeviceChart data={byDevice} />
            <h2 className="mt-10 mb-1">Views over time</h2>
            <p className="text-secondary mb-4 text-sm">
                Monthly page views. The dashed line before 2022 is an estimated distribution of the archived Universal
                Analytics total ({historicalWindow.start} – {historicalWindow.end}); the solid line is live GA4 data
                {sinceLabel !== "" ? ` since ${sinceLabel}` : ""}.
            </p>
            <ViewsOverTimeChart data={pageViewsTimeline} />
            {ga4 && (
                <>
                    <h2 className="mt-10 mb-4">Top posts by views</h2>
                    <TopPostsChart data={ga4.topPosts} />
                </>
            )}
        </>
    );
};
