import { describe, it, expect } from "vitest";
import { buildPageViewsTimeline } from "./page-views-timeline";
import type { AnalyticsStats, HistoricalAnalytics } from "@/types/content/analytics-stats";

const historical: HistoricalAnalytics = {
    window: { start: "May 2017", end: "May 2021" },
    totals: { pageViews: 148579, users: 77736, sessions: 97173 },
    byContinent: [],
    byDevice: [],
    pageViewsCumulativeAnchors: [
        { month: "201705", total: 0 },
        { month: "202105", total: 148579 },
    ],
};

describe("buildPageViewsTimeline", () => {
    it("produces a dashed estimated monthly ramp summing to the historical total when GA4 is absent", () => {
        const points = buildPageViewsTimeline(historical, null);

        expect(points).toHaveLength(49);
        expect(points.every((point) => point.live === null)).toBe(true);
        const sum = points.reduce((acc, point) => acc + (point.estimated ?? 0), 0);
        expect(sum).toBeGreaterThanOrEqual(148579 - 49);
        expect(sum).toBeLessThanOrEqual(148579 + 49);
        expect(points[0].month).toBe("201705");
        expect(points[points.length - 1].month).toBe("202105");
        expect((points[48].estimated ?? 0) > (points[0].estimated ?? 0)).toBe(true);
    });

    it("appends solid live months and bridges the last estimated month", () => {
        const ga4: AnalyticsStats = {
            totals: { pageViews: 0, users: 0, sessions: 0 },
            viewsPerMonth: [
                { month: "202201", views: 5000 },
                { month: "202202", views: 4000 },
            ],
            topPosts: [],
            byContinent: [],
            byDevice: [],
            byBrowser: [],
            byOs: [],
            since: "202201",
        };

        const points = buildPageViewsTimeline(historical, ga4);

        expect(points).toHaveLength(51);
        const bridge = points.find((point) => point.month === "202105");
        expect(bridge?.estimated).not.toBeNull();
        expect(bridge?.live).toBe(bridge?.estimated);

        const live = points.filter((point) => point.month.startsWith("2022"));
        expect(live.map((point) => point.live)).toEqual([5000, 4000]);
        expect(live.every((point) => point.estimated === null)).toBe(true);
    });
});
