import type {
    AllTimeAnalytics,
    AnalyticsStats,
    AnalyticsTotals,
    DimensionCount,
    HistoricalAnalytics,
} from "@/types/content/analytics-stats";
import { buildPageViewsTimeline } from "./page-views-timeline";

const sumTotals = (a: AnalyticsTotals, b: AnalyticsTotals): AnalyticsTotals => ({
    pageViews: a.pageViews + b.pageViews,
    users: a.users + b.users,
    sessions: a.sessions + b.sessions,
});

const mergeDimensions = (historical: DimensionCount[], ga4: DimensionCount[]): DimensionCount[] => {
    const byKey = new Map<string, DimensionCount>();

    [...historical, ...ga4].forEach((entry) => {
        const key = entry.label.trim().toLowerCase();
        const existing = byKey.get(key);

        if (existing) {
            existing.users += entry.users;
        } else {
            byKey.set(key, { label: entry.label, users: entry.users });
        }
    });

    return [...byKey.values()].sort((a, b) => b.users - a.users);
};

const NO_TOTALS: AnalyticsTotals = { pageViews: 0, users: 0, sessions: 0 };

export const mergeAllTime = (historical: HistoricalAnalytics, ga4: AnalyticsStats | null): AllTimeAnalytics => ({
    totals: sumTotals(historical.totals, ga4?.totals ?? NO_TOTALS),
    byContinent: mergeDimensions(historical.byContinent, ga4?.byContinent ?? []),
    byDevice: mergeDimensions(historical.byDevice, ga4?.byDevice ?? []),
    historicalWindow: historical.window,
    hasGa4: ga4 !== null,
    pageViewsTimeline: buildPageViewsTimeline(historical, ga4),
});
