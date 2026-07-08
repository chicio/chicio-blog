import type { AnalyticsStats, CumulativePoint, HistoricalAnalytics } from "@/types/content/analytics-stats";
import { formatAnalyticsMonth } from "./format-month";

const monthToTime = (yearMonth: string): number => {
    const year = Number(yearMonth.slice(0, 4));
    const monthIndex = Number(yearMonth.slice(4, 6)) - 1;

    return Date.UTC(year, monthIndex, 1);
};

export const buildCumulativePageViews = (
    historical: HistoricalAnalytics,
    ga4: AnalyticsStats | null,
): CumulativePoint[] => {
    const anchors = historical.pageViewsCumulativeAnchors;
    const baseline = anchors[anchors.length - 1]?.total ?? 0;
    const lastAnchorMonth = anchors[anchors.length - 1]?.month;

    const estimatedPoints: CumulativePoint[] = anchors.map((anchor) => ({
        time: monthToTime(anchor.month),
        label: formatAnalyticsMonth(anchor.month),
        estimated: anchor.total,
        live: ga4 && anchor.month === lastAnchorMonth ? baseline : null,
    }));

    if (!ga4) {
        return estimatedPoints;
    }

    let running = baseline;
    const livePoints: CumulativePoint[] = [...ga4.viewsPerMonth]
        .sort((a, b) => a.month.localeCompare(b.month))
        .map((entry) => {
            running += entry.views;

            return {
                time: monthToTime(entry.month),
                label: formatAnalyticsMonth(entry.month),
                estimated: null,
                live: running,
            };
        });

    return [...estimatedPoints, ...livePoints].sort((a, b) => a.time - b.time);
};
