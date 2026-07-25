import { BetaAnalyticsDataClient } from "@google-analytics/data";
import type { protos } from "@google-analytics/data";
import { posts } from "@/lib/content/posts/posts";
import {
    AnalyticsData,
    AnalyticsStats,
    AnalyticsTotals,
    DimensionCount,
    TopPost,
    ViewsPerMonth,
} from "@/types/content/analytics-stats";
import { readAnalyticsConfig } from "./analytics-config";
import { mergeAllTime } from "./merge-analytics";
import { HISTORICAL_ANALYTICS } from "./historical-analytics";

type AnalyticsRow = protos.google.analytics.data.v1beta.IRow;

const LIFETIME_START_DATE = "2015-08-14";
const TODAY = "today";
const TOP_POSTS_LIMIT = 20;
const TOP_POSTS_FETCH_LIMIT = 250;
const DIMENSION_BREAKDOWN_LIMIT = 6;
const POST_PATH_REGEX = "^/(blog/post/)?[0-9]{4}/[0-9]{2}/[0-9]{2}/[^/]+/?$";
const CONTINENT_UNKNOWN_RAW = "(not set)";

export interface PostRef {
    title: string;
    url: string;
}

const parseMetricValue = (row: AnalyticsRow | undefined, index: number): number => {
    const raw = row?.metricValues?.[index]?.value;

    return raw ? Number(raw) : 0;
};

export const mapTotals = (rows: AnalyticsRow[] | null | undefined): AnalyticsTotals => {
    const row = rows?.[0];

    return {
        pageViews: parseMetricValue(row, 0),
        users: parseMetricValue(row, 1),
        sessions: parseMetricValue(row, 2),
    };
};

export const mapViewsPerMonth = (rows: AnalyticsRow[] | null | undefined): ViewsPerMonth[] =>
    (rows ?? [])
        .map((row) => ({
            month: row.dimensionValues?.[0]?.value ?? "",
            views: parseMetricValue(row, 0),
        }))
        .filter((entry) => entry.month !== "")
        .sort((a, b) => a.month.localeCompare(b.month));

export const normalizePostPathKey = (path: string): string =>
    path
        .replace(/^\/blog\/post/, "")
        .replace(/^\//, "")
        .replace(/\/$/, "");

export const aggregateTopPosts = (
    rows: AnalyticsRow[] | null | undefined,
    resolvePost: (key: string) => PostRef | null,
    limit: number = TOP_POSTS_LIMIT,
): TopPost[] => {
    const viewsByKey = new Map<string, number>();

    (rows ?? []).forEach((row) => {
        const path = row.dimensionValues?.[0]?.value ?? "";

        if (path === "") {
            return;
        }

        const key = normalizePostPathKey(path);
        viewsByKey.set(key, (viewsByKey.get(key) ?? 0) + parseMetricValue(row, 0));
    });

    return [...viewsByKey.entries()]
        .map(([key, views]) => {
            const post = resolvePost(key);

            return post ? { path: post.url, title: post.title, views } : null;
        })
        .filter((entry): entry is TopPost => entry !== null)
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);
};

export const mapDimensionCounts = (
    rows: AnalyticsRow[] | null | undefined,
    normalize: (label: string) => string = (label) => label,
): DimensionCount[] =>
    (rows ?? [])
        .map((row) => ({
            label: normalize(row.dimensionValues?.[0]?.value ?? ""),
            users: parseMetricValue(row, 0),
        }))
        .filter((entry) => entry.label !== "");

export const mapReportsToAnalyticsStats = (
    totalsRows: AnalyticsRow[] | null | undefined,
    viewsPerMonthRows: AnalyticsRow[] | null | undefined,
    topPostsRows: AnalyticsRow[] | null | undefined,
    continentRows: AnalyticsRow[] | null | undefined,
    deviceRows: AnalyticsRow[] | null | undefined,
    browserRows: AnalyticsRow[] | null | undefined,
    osRows: AnalyticsRow[] | null | undefined,
    resolvePost: (key: string) => PostRef | null,
): AnalyticsStats => {
    const viewsPerMonth = mapViewsPerMonth(viewsPerMonthRows);

    return {
        totals: mapTotals(totalsRows),
        viewsPerMonth,
        topPosts: aggregateTopPosts(topPostsRows, resolvePost),
        byContinent: mapDimensionCounts(continentRows, (label) =>
            label === CONTINENT_UNKNOWN_RAW ? "Unknown" : label,
        ),
        byDevice: mapDimensionCounts(deviceRows),
        byBrowser: mapDimensionCounts(browserRows),
        byOs: mapDimensionCounts(osRows),
        since: viewsPerMonth[0]?.month ?? "",
    };
};

const buildPostResolver = (): ((key: string) => PostRef | null) => {
    const byKey = new Map(
        posts.list().map((post) => [
            normalizePostPathKey(post.slug.formatted),
            { title: post.frontmatter.title, url: post.slug.formatted },
        ]),
    );

    return (key: string): PostRef | null => byKey.get(key) ?? null;
};

export const getAnalyticsStats = async (): Promise<AnalyticsStats | null> => {
    try {
        const config = readAnalyticsConfig();
        const client = new BetaAnalyticsDataClient({
            credentials: {
                client_email: config?.clientEmail,
                private_key: config?.privateKey,
            },
        });
        const property = `properties/${config?.propertyId}`;
        const dateRanges = [{ startDate: LIFETIME_START_DATE, endDate: TODAY }];

        const [totalsResponse] = await client.runReport({
            property,
            dateRanges,
            metrics: [{ name: "screenPageViews" }, { name: "totalUsers" }, { name: "sessions" }],
        });

        const [viewsPerMonthResponse] = await client.runReport({
            property,
            dateRanges,
            dimensions: [{ name: "yearMonth" }],
            metrics: [{ name: "screenPageViews" }],
            orderBys: [{ dimension: { dimensionName: "yearMonth" } }],
        });

        const [topPostsResponse] = await client.runReport({
            property,
            dateRanges,
            dimensions: [{ name: "pagePath" }],
            metrics: [{ name: "screenPageViews" }],
            dimensionFilter: {
                filter: {
                    fieldName: "pagePath",
                    stringFilter: { matchType: "FULL_REGEXP", value: POST_PATH_REGEX },
                },
            },
            orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
            limit: TOP_POSTS_FETCH_LIMIT,
        });

        const [continentResponse] = await client.runReport({
            property,
            dateRanges,
            dimensions: [{ name: "continent" }],
            metrics: [{ name: "totalUsers" }],
            orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
        });

        const [deviceResponse] = await client.runReport({
            property,
            dateRanges,
            dimensions: [{ name: "deviceCategory" }],
            metrics: [{ name: "totalUsers" }],
            orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
        });

        const [browserResponse] = await client.runReport({
            property,
            dateRanges,
            dimensions: [{ name: "browser" }],
            metrics: [{ name: "totalUsers" }],
            orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
            limit: DIMENSION_BREAKDOWN_LIMIT,
        });

        const [osResponse] = await client.runReport({
            property,
            dateRanges,
            dimensions: [{ name: "operatingSystem" }],
            metrics: [{ name: "totalUsers" }],
            orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
            limit: DIMENSION_BREAKDOWN_LIMIT,
        });

        return mapReportsToAnalyticsStats(
            totalsResponse.rows,
            viewsPerMonthResponse.rows,
            topPostsResponse.rows,
            continentResponse.rows,
            deviceResponse.rows,
            browserResponse.rows,
            osResponse.rows,
            buildPostResolver(),
        );
    } catch (error) {
        console.error("GA4 analytics fetch failed; falling back to historical-only:", error);

        return null;
    }
};

export const getAnalyticsData = async (): Promise<AnalyticsData> => {
    const ga4 = await getAnalyticsStats();

    return {
        allTime: mergeAllTime(HISTORICAL_ANALYTICS, ga4),
        ga4,
    };
};
