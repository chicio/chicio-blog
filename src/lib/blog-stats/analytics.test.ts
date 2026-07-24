import { describe, it, expect, beforeEach, vi } from "vitest";

const { mockRunReport, mockGetPosts, mockReadAnalyticsConfig } = vi.hoisted(() => ({
    mockRunReport: vi.fn(),
    mockGetPosts: vi.fn(),
    mockReadAnalyticsConfig: vi.fn(),
}));

vi.mock("@google-analytics/data", () => ({
    BetaAnalyticsDataClient: vi.fn().mockImplementation(function (this: unknown) {
        return { runReport: mockRunReport };
    }),
}));

vi.mock("@/lib/content/posts/posts", () => ({
    posts: { list: mockGetPosts },
}));

vi.mock("./analytics-config", () => ({
    readAnalyticsConfig: mockReadAnalyticsConfig,
}));

import {
    aggregateTopPosts,
    getAnalyticsData,
    getAnalyticsStats,
    mapDimensionCounts,
    mapReportsToAnalyticsStats,
    normalizePostPathKey,
    mapTotals,
    mapViewsPerMonth,
} from "./analytics";
import { HISTORICAL_ANALYTICS } from "./historical-analytics";

describe("analytics", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetPosts.mockReturnValue([]);
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    describe("getAnalyticsStats", () => {
        it("attempts the fetch even without config and fails open to null (no stub guard)", async () => {
            mockReadAnalyticsConfig.mockReturnValue(null);
            mockRunReport.mockRejectedValue(new Error("no credentials"));

            expect(await getAnalyticsStats()).toBeNull();
            expect(mockRunReport).toHaveBeenCalled();
        });

        it("fails open (returns null) when the GA client throws", async () => {
            mockReadAnalyticsConfig.mockReturnValue({
                propertyId: "123456",
                clientEmail: "sa@example.com",
                privateKey: "key",
            });
            mockRunReport.mockRejectedValue(new Error("GA is down"));

            expect(await getAnalyticsStats()).toBeNull();
        });

        it("fails open (returns null) when any report throws partway through", async () => {
            mockReadAnalyticsConfig.mockReturnValue({
                propertyId: "123456",
                clientEmail: "sa@example.com",
                privateKey: "key",
            });
            mockRunReport
                .mockResolvedValueOnce([{ rows: [{ metricValues: [{ value: "1" }] }] }])
                .mockRejectedValueOnce(new Error("second report failed"));

            expect(await getAnalyticsStats()).toBeNull();
        });
    });

    describe("getAnalyticsData", () => {
        it("returns the historical estimate alone when GA4 is unavailable", async () => {
            mockReadAnalyticsConfig.mockReturnValue(null);
            mockRunReport.mockRejectedValue(new Error("no credentials"));

            const { allTime, ga4 } = await getAnalyticsData();

            expect(ga4).toBeNull();
            expect(allTime.hasGa4).toBe(false);
            expect(allTime.totals).toEqual(HISTORICAL_ANALYTICS.totals);
        });

        it("merges GA4 into the all-time view when GA4 is available", async () => {
            mockReadAnalyticsConfig.mockReturnValue({
                propertyId: "123456",
                clientEmail: "sa@example.com",
                privateKey: "key",
            });
            mockRunReport.mockResolvedValue([
                { rows: [{ metricValues: [{ value: "10" }, { value: "8" }, { value: "9" }] }] },
            ]);

            const { allTime, ga4 } = await getAnalyticsData();

            expect(ga4).not.toBeNull();
            expect(allTime.hasGa4).toBe(true);
            expect(allTime.totals.pageViews).toBe(HISTORICAL_ANALYTICS.totals.pageViews + 10);
        });
    });

    describe("mapTotals", () => {
        it("returns zeroed totals when rows are missing", () => {
            expect(mapTotals(null)).toEqual({ pageViews: 0, users: 0, sessions: 0 });
            expect(mapTotals(undefined)).toEqual({ pageViews: 0, users: 0, sessions: 0 });
            expect(mapTotals([])).toEqual({ pageViews: 0, users: 0, sessions: 0 });
        });

        it("maps the first row's metric values positionally", () => {
            const rows = [{ metricValues: [{ value: "1000" }, { value: "800" }, { value: "900" }] }];

            expect(mapTotals(rows)).toEqual({ pageViews: 1000, users: 800, sessions: 900 });
        });
    });

    describe("mapViewsPerMonth", () => {
        it("returns an empty array when rows are missing", () => {
            expect(mapViewsPerMonth(null)).toEqual([]);
        });

        it("maps and sorts rows ascending by month", () => {
            const rows = [
                { dimensionValues: [{ value: "202403" }], metricValues: [{ value: "50" }] },
                { dimensionValues: [{ value: "202401" }], metricValues: [{ value: "100" }] },
            ];

            expect(mapViewsPerMonth(rows)).toEqual([
                { month: "202401", views: 100 },
                { month: "202403", views: 50 },
            ]);
        });

        it("drops rows with no month dimension value", () => {
            const rows = [{ dimensionValues: [{ value: undefined }], metricValues: [{ value: "10" }] }];

            expect(mapViewsPerMonth(rows)).toEqual([]);
        });
    });

    describe("normalizePostPathKey", () => {
        it("reduces legacy and current URL schemes to the same canonical key", () => {
            expect(normalizePostPathKey("/blog/post/2022/01/02/react-hook")).toBe("2022/01/02/react-hook");
            expect(normalizePostPathKey("/2022/01/02/react-hook/")).toBe("2022/01/02/react-hook");
        });
    });

    describe("aggregateTopPosts", () => {
        const resolve =
            (map: Record<string, { title: string; url: string }>) =>
            (key: string) =>
                map[key] ?? null;

        it("sums views for one post across legacy + current paths, mapped to the current URL", () => {
            const rows = [
                { dimensionValues: [{ value: "/2022/01/02/react-hook/" }], metricValues: [{ value: "22556" }] },
                { dimensionValues: [{ value: "/blog/post/2022/01/02/react-hook" }], metricValues: [{ value: "521" }] },
                { dimensionValues: [{ value: "/2020/12/23/spring" }], metricValues: [{ value: "15579" }] },
            ];

            expect(
                aggregateTopPosts(
                    rows,
                    resolve({
                        "2022/01/02/react-hook": { title: "React hook", url: "/blog/post/2022/01/02/react-hook" },
                        "2020/12/23/spring": { title: "Spring", url: "/blog/post/2020/12/23/spring" },
                    }),
                ),
            ).toEqual([
                { path: "/blog/post/2022/01/02/react-hook", title: "React hook", views: 23077 },
                { path: "/blog/post/2020/12/23/spring", title: "Spring", views: 15579 },
            ]);
        });

        it("drops paths with no matching post and respects the limit", () => {
            const rows = [
                { dimensionValues: [{ value: "/2022/01/02/known" }], metricValues: [{ value: "10" }] },
                { dimensionValues: [{ value: "/2099/01/01/unknown" }], metricValues: [{ value: "99" }] },
            ];

            expect(
                aggregateTopPosts(rows, resolve({ "2022/01/02/known": { title: "Known", url: "/blog/post/2022/01/02/known" } }), 1),
            ).toEqual([{ path: "/blog/post/2022/01/02/known", title: "Known", views: 10 }]);
        });

        it("returns an empty array when rows are missing", () => {
            expect(aggregateTopPosts(undefined, () => null)).toEqual([]);
        });
    });

    describe("mapDimensionCounts", () => {
        it("maps dimension rows to label/users pairs, dropping empty labels", () => {
            const rows = [
                { dimensionValues: [{ value: "Europe" }], metricValues: [{ value: "27036" }] },
                { dimensionValues: [{ value: "" }], metricValues: [{ value: "5" }] },
            ];

            expect(mapDimensionCounts(rows)).toEqual([{ label: "Europe", users: 27036 }]);
        });

        it("applies the optional label normalizer", () => {
            const rows = [{ dimensionValues: [{ value: "(not set)" }], metricValues: [{ value: "12" }] }];
            const normalize = (label: string) => (label === "(not set)" ? "Unknown" : label);

            expect(mapDimensionCounts(rows, normalize)).toEqual([{ label: "Unknown", users: 12 }]);
        });
    });

    describe("mapReportsToAnalyticsStats", () => {
        it("wires totals, views-per-month, top posts, and dimension breakdowns from raw GA rows", () => {
            const totalsRows = [{ metricValues: [{ value: "1000" }, { value: "800" }, { value: "900" }] }];
            const viewsPerMonthRows = [
                { dimensionValues: [{ value: "202403" }], metricValues: [{ value: "50" }] },
                { dimensionValues: [{ value: "202401" }], metricValues: [{ value: "100" }] },
            ];
            const topPostsRows = [
                { dimensionValues: [{ value: "/blog/post/2024/01/01/my-post" }], metricValues: [{ value: "42" }] },
            ];
            const continentRows = [
                { dimensionValues: [{ value: "Europe" }], metricValues: [{ value: "10" }] },
                { dimensionValues: [{ value: "(not set)" }], metricValues: [{ value: "2" }] },
            ];
            const deviceRows = [{ dimensionValues: [{ value: "desktop" }], metricValues: [{ value: "7" }] }];
            const browserRows = [{ dimensionValues: [{ value: "Chrome" }], metricValues: [{ value: "6" }] }];
            const osRows = [{ dimensionValues: [{ value: "Macintosh" }], metricValues: [{ value: "4" }] }];
            const resolvePost = (key: string) =>
                key === "2024/01/01/my-post" ? { title: "My Post", url: "/blog/post/2024/01/01/my-post" } : null;

            expect(
                mapReportsToAnalyticsStats(
                    totalsRows,
                    viewsPerMonthRows,
                    topPostsRows,
                    continentRows,
                    deviceRows,
                    browserRows,
                    osRows,
                    resolvePost,
                ),
            ).toEqual({
                totals: { pageViews: 1000, users: 800, sessions: 900 },
                viewsPerMonth: [
                    { month: "202401", views: 100 },
                    { month: "202403", views: 50 },
                ],
                topPosts: [{ path: "/blog/post/2024/01/01/my-post", title: "My Post", views: 42 }],
                byContinent: [
                    { label: "Europe", users: 10 },
                    { label: "Unknown", users: 2 },
                ],
                byDevice: [{ label: "desktop", users: 7 }],
                byBrowser: [{ label: "Chrome", users: 6 }],
                byOs: [{ label: "Macintosh", users: 4 }],
                since: "202401",
            });
        });

        it("returns zeroed totals, empty arrays, and an empty since when every report is empty", () => {
            expect(mapReportsToAnalyticsStats(null, null, null, null, null, null, null, () => null)).toEqual({
                totals: { pageViews: 0, users: 0, sessions: 0 },
                viewsPerMonth: [],
                topPosts: [],
                byContinent: [],
                byDevice: [],
                byBrowser: [],
                byOs: [],
                since: "",
            });
        });
    });
});
