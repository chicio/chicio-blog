import { describe, it, expect } from "vitest";
import { buildCumulativePageViews } from "./cumulative-page-views";
import type { AnalyticsStats, HistoricalAnalytics } from "@/types/content/analytics-stats";

const historical: HistoricalAnalytics = {
    window: { start: "May 2017", end: "May 2021" },
    totals: { pageViews: 148579, users: 77736, sessions: 97173 },
    byContinent: [],
    byDevice: [],
    pageViewsCumulativeAnchors: [
        { month: "201705", total: 0 },
        { month: "202005", total: 84903 },
        { month: "202105", total: 148579 },
    ],
};

describe("buildCumulativePageViews", () => {
    it("returns only the estimated anchor series when GA4 is absent", () => {
        const points = buildCumulativePageViews(historical, null);

        expect(points).toHaveLength(3);
        expect(points.map((point) => point.estimated)).toEqual([0, 84903, 148579]);
        expect(points.every((point) => point.live === null)).toBe(true);
        expect(points[0].label).toBe("May 2017");
        expect(points[2].label).toBe("May 2021");
    });

    it("appends live cumulative points on top of the historical baseline, bridged at the last anchor", () => {
        const ga4: AnalyticsStats = {
            totals: { pageViews: 0, users: 0, sessions: 0 },
            viewsPerMonth: [
                { month: "202201", views: 1000 },
                { month: "202202", views: 500 },
            ],
            topPosts: [],
            byContinent: [],
            byDevice: [],
            since: "202201",
        };

        const points = buildCumulativePageViews(historical, ga4);

        expect(points).toHaveLength(5);
        expect(points.filter((point) => point.live !== null).map((point) => point.live)).toEqual([
            148579, 149579, 150079,
        ]);

        const junction = points.find((point) => point.label === "May 2021");
        expect(junction?.estimated).toBe(148579);
        expect(junction?.live).toBe(148579);

        expect(points.map((point) => point.time)).toEqual([...points.map((point) => point.time)].sort((a, b) => a - b));
    });
});
