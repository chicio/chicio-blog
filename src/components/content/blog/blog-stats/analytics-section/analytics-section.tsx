"use client";

import { FC } from "react";
import { StatCard } from "@/components/design-system/molecules/stat-card";
import { ChartPanel } from "@/components/design-system/molecules/chart/chart-panel";
import { formatAnalyticsMonth } from "@/lib/blog-stats/format-month";
import type { AllTimeAnalytics, AnalyticsStats } from "@/types/content/analytics-stats";
import { ContinentChart } from "./continent-chart";
import { DeviceChart } from "./device-chart";
import { BrowserChart } from "./browser-chart";
import { OsChart } from "./os-chart";
import { ViewsOverTimeChart } from "./views-over-time-chart";
import { TopPostsList } from "./top-posts-list";

interface AnalyticsSectionProps {
    allTime: AllTimeAnalytics;
    ga4: AnalyticsStats | null;
}

const TWO_COLUMN_GRID = "grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]";

export const AnalyticsSection: FC<AnalyticsSectionProps> = ({ allTime, ga4 }) => {
    const { totals, byContinent, byDevice, historicalWindow, hasGa4, pageViewsTimeline } = allTime;
    const estimateNote = hasGa4
        ? `Totals combine live GA4 data with estimated Universal Analytics traffic (${historicalWindow.start} – ${historicalWindow.end}). Users and sessions are approximate.`
        : `Totals are estimated from Universal Analytics (${historicalWindow.start} – ${historicalWindow.end}); live analytics is not configured yet.`;
    const sinceLabel = ga4 && ga4.since !== "" ? formatAnalyticsMonth(ga4.since) : "";
    const viewsNote = `Monthly page views. The dashed line before 2022 is an estimated distribution of the archived Universal Analytics total (${historicalWindow.start} – ${historicalWindow.end}); the solid line is live GA4 data${sinceLabel !== "" ? ` since ${sinceLabel}` : ""}.`;
    const topPostsNote = `Most-read posts${sinceLabel !== "" ? ` since ${sinceLabel}` : ""} (live GA4). Pre-2022 Universal Analytics per-post data was not preserved, so older classics aren't counted.`;

    return (
        <div className="mt-12 flex flex-col gap-5">
            <div>
                <h2>Traffic</h2>
                <p className="mb-4">{estimateNote}</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
            </div>
            <div className={TWO_COLUMN_GRID}>
                <ChartPanel
                    title="Users by continent"
                    description="Where readers connect from."
                >
                    <ContinentChart data={byContinent} />
                </ChartPanel>
                <ChartPanel
                    title="Users by device"
                    description="How readers browse the blog."
                >
                    <DeviceChart data={byDevice} />
                </ChartPanel>
            </div>
            <ChartPanel
                title="Views over time"
                description={viewsNote}
            >
                <ViewsOverTimeChart data={pageViewsTimeline} />
            </ChartPanel>
            {ga4 && (
                <>
                    <div className={TWO_COLUMN_GRID}>
                        <ChartPanel
                            title="Users by browser"
                            description="The browsers readers use (GA4)."
                        >
                            <BrowserChart data={ga4.byBrowser} />
                        </ChartPanel>
                        <ChartPanel
                            title="Users by OS"
                            description="The operating systems readers use (GA4)."
                        >
                            <OsChart data={ga4.byOs} />
                        </ChartPanel>
                    </div>
                    <ChartPanel
                        title="Top posts by views"
                        description={topPostsNote}
                    >
                        <TopPostsList data={ga4.topPosts} />
                    </ChartPanel>
                </>
            )}
        </div>
    );
};
