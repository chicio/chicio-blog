import { BetaAnalyticsDataClient } from "@google-analytics/data";
import type { protos } from "@google-analytics/data";
import { getPosts } from "@/lib/content/posts/posts";
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
const TOP_POSTS_LIMIT = 10;
const BLOG_POST_PATH_PREFIX = "/blog/post/";
const CONTINENT_UNKNOWN_RAW = "(not set)";

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

export const mapTopPosts = (
    rows: AnalyticsRow[] | null | undefined,
    resolveTitle: (path: string) => string,
): TopPost[] =>
    (rows ?? []).map((row) => {
        const path = row.dimensionValues?.[0]?.value ?? "";

        return {
            path,
            title: resolveTitle(path),
            views: parseMetricValue(row, 0),
        };
    });

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
    resolveTitle: (path: string) => string,
): AnalyticsStats => {
    const viewsPerMonth = mapViewsPerMonth(viewsPerMonthRows);

    return {
        totals: mapTotals(totalsRows),
        viewsPerMonth,
        topPosts: mapTopPosts(topPostsRows, resolveTitle),
        byContinent: mapDimensionCounts(continentRows, (label) =>
            label === CONTINENT_UNKNOWN_RAW ? "Unknown" : label,
        ),
        byDevice: mapDimensionCounts(deviceRows),
        since: viewsPerMonth[0]?.month ?? "",
    };
};

const buildPostTitleResolver = (): ((path: string) => string) => {
    const titleByPath = new Map(getPosts().map((post) => [post.slug.formatted, post.frontmatter.title]));

    return (path: string): string => titleByPath.get(path) ?? path;
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
                    stringFilter: { matchType: "BEGINS_WITH", value: BLOG_POST_PATH_PREFIX },
                },
            },
            orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
            limit: TOP_POSTS_LIMIT,
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

        return mapReportsToAnalyticsStats(
            totalsResponse.rows,
            viewsPerMonthResponse.rows,
            topPostsResponse.rows,
            continentResponse.rows,
            deviceResponse.rows,
            buildPostTitleResolver(),
        );
    } catch {
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
