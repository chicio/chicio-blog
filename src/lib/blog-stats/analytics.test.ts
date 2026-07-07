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
    getPosts: mockGetPosts,
}));

vi.mock("./analytics-config", () => ({
    readAnalyticsConfig: mockReadAnalyticsConfig,
}));

import { getAnalyticsStats, mapReportsToAnalyticsStats, mapTopPosts, mapTotals, mapViewsPerMonth } from "./analytics";

describe("analytics", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetPosts.mockReturnValue([]);
    });

    describe("getAnalyticsStats", () => {
        it("returns null when no config is present (stub mode)", async () => {
            mockReadAnalyticsConfig.mockReturnValue(null);

            expect(await getAnalyticsStats()).toBeNull();
            expect(mockRunReport).not.toHaveBeenCalled();
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

    describe("mapTopPosts", () => {
        it("resolves each post's title via the given resolver", () => {
            const rows = [{ dimensionValues: [{ value: "/blog/post/2024/01/01/my-post" }], metricValues: [{ value: "42" }] }];

            expect(mapTopPosts(rows, () => "My Post")).toEqual([
                { path: "/blog/post/2024/01/01/my-post", title: "My Post", views: 42 },
            ]);
        });

        it("returns an empty array when rows are missing", () => {
            expect(mapTopPosts(undefined, (path) => path)).toEqual([]);
        });
    });

    describe("mapReportsToAnalyticsStats", () => {
        it("wires totals, views-per-month, and top posts from raw GA rows", () => {
            const totalsRows = [{ metricValues: [{ value: "1000" }, { value: "800" }, { value: "900" }] }];
            const viewsPerMonthRows = [
                { dimensionValues: [{ value: "202403" }], metricValues: [{ value: "50" }] },
                { dimensionValues: [{ value: "202401" }], metricValues: [{ value: "100" }] },
            ];
            const topPostsRows = [
                { dimensionValues: [{ value: "/blog/post/2024/01/01/my-post" }], metricValues: [{ value: "42" }] },
            ];
            const resolveTitle = (path: string) => (path.endsWith("my-post") ? "My Post" : path);

            expect(mapReportsToAnalyticsStats(totalsRows, viewsPerMonthRows, topPostsRows, resolveTitle)).toEqual({
                totals: { pageViews: 1000, users: 800, sessions: 900 },
                viewsPerMonth: [
                    { month: "202401", views: 100 },
                    { month: "202403", views: 50 },
                ],
                topPosts: [{ path: "/blog/post/2024/01/01/my-post", title: "My Post", views: 42 }],
                since: "202401",
            });
        });

        it("returns zeroed totals, empty arrays, and an empty since when every report is empty", () => {
            expect(mapReportsToAnalyticsStats(null, null, null, (path) => path)).toEqual({
                totals: { pageViews: 0, users: 0, sessions: 0 },
                viewsPerMonth: [],
                topPosts: [],
                since: "",
            });
        });
    });
});
