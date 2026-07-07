import { describe, it, expect } from "vitest";
import { mergeAllTime } from "./merge-analytics";
import type { AnalyticsStats, HistoricalAnalytics } from "@/types/content/analytics-stats";

const historical: HistoricalAnalytics = {
    window: { start: "May 2017", end: "May 2021" },
    totals: { pageViews: 100, users: 80, sessions: 90 },
    byContinent: [
        { label: "Europe", users: 50 },
        { label: "Americas", users: 30 },
    ],
    byDevice: [
        { label: "Desktop", users: 60 },
        { label: "Mobile", users: 20 },
    ],
};

const ga4: AnalyticsStats = {
    totals: { pageViews: 10, users: 8, sessions: 9 },
    viewsPerMonth: [{ month: "202401", views: 10 }],
    topPosts: [],
    byContinent: [
        { label: "Europe", users: 5 },
        { label: "Asia", users: 7 },
    ],
    byDevice: [{ label: "desktop", users: 3 }],
    since: "202401",
};

describe("mergeAllTime", () => {
    it("returns the historical estimate alone when GA4 is absent (stub mode)", () => {
        const result = mergeAllTime(historical, null);

        expect(result.totals).toEqual({ pageViews: 100, users: 80, sessions: 90 });
        expect(result.byContinent).toEqual([
            { label: "Europe", users: 50 },
            { label: "Americas", users: 30 },
        ]);
        expect(result.hasGa4).toBe(false);
        expect(result.historicalWindow).toEqual({ start: "May 2017", end: "May 2021" });
    });

    it("sums totals across both eras", () => {
        expect(mergeAllTime(historical, ga4).totals).toEqual({ pageViews: 110, users: 88, sessions: 99 });
    });

    it("unions dimensions by case-insensitive label, keeping the historical label, sorted desc", () => {
        const result = mergeAllTime(historical, ga4);

        expect(result.byContinent).toEqual([
            { label: "Europe", users: 55 },
            { label: "Americas", users: 30 },
            { label: "Asia", users: 7 },
        ]);
        expect(result.byDevice).toEqual([
            { label: "Desktop", users: 63 },
            { label: "Mobile", users: 20 },
        ]);
        expect(result.hasGa4).toBe(true);
    });
});
