import type { AnalyticsStats, HistoricalAnalytics, ViewsPoint } from "@/types/content/analytics-stats";

const enumerateMonths = (start: string, end: string): string[] => {
    const months: string[] = [];
    let year = Number(start.slice(0, 4));
    let month = Number(start.slice(4, 6));
    const endYear = Number(end.slice(0, 4));
    const endMonth = Number(end.slice(4, 6));

    while (year < endYear || (year === endYear && month <= endMonth)) {
        months.push(`${year}${String(month).padStart(2, "0")}`);
        month += 1;

        if (month > 12) {
            month = 1;
            year += 1;
        }
    }

    return months;
};

export const buildPageViewsTimeline = (historical: HistoricalAnalytics, ga4: AnalyticsStats | null): ViewsPoint[] => {
    const livePoints: ViewsPoint[] = [...(ga4?.viewsPerMonth ?? [])]
        .sort((a, b) => a.month.localeCompare(b.month))
        .map((entry) => ({ month: entry.month, estimated: null, live: entry.views }));

    const anchors = historical.pageViewsCumulativeAnchors;

    if (anchors.length === 0) {
        return livePoints;
    }

    const total = anchors[anchors.length - 1].total;
    const months = enumerateMonths(anchors[0].month, anchors[anchors.length - 1].month);
    const count = months.length;

    const estimatedPoints: ViewsPoint[] = months.map((month, index) => ({
        month,
        estimated: Math.round((2 * total * (index + 1)) / (count * (count + 1))),
        live: null,
    }));

    if (livePoints.length > 0) {
        const bridge = estimatedPoints[estimatedPoints.length - 1];
        estimatedPoints[estimatedPoints.length - 1] = { ...bridge, live: bridge.estimated };
    }

    return [...estimatedPoints, ...livePoints].sort((a, b) => a.month.localeCompare(b.month));
};
