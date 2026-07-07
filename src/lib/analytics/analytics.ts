import { BetaAnalyticsDataClient } from "@google-analytics/data";
import type { protos } from "@google-analytics/data";
import { getPosts } from "@/lib/content/posts/posts";
import { AnalyticsStats, AnalyticsTotals, TopPost, ViewsPerMonth } from "@/types/content/analytics-stats";
import { readAnalyticsConfig } from "./analytics-config";

type AnalyticsRow = protos.google.analytics.data.v1beta.IRow;

const LIFETIME_START_DATE = "2015-01-01";
const TODAY = "today";
const TOP_POSTS_LIMIT = 10;
const BLOG_POST_PATH_PREFIX = "/blog/post/";

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

export const mapReportsToAnalyticsStats = (
    totalsRows: AnalyticsRow[] | null | undefined,
    viewsPerMonthRows: AnalyticsRow[] | null | undefined,
    topPostsRows: AnalyticsRow[] | null | undefined,
    resolveTitle: (path: string) => string,
): AnalyticsStats => {
    const viewsPerMonth = mapViewsPerMonth(viewsPerMonthRows);

    return {
        totals: mapTotals(totalsRows),
        viewsPerMonth,
        topPosts: mapTopPosts(topPostsRows, resolveTitle),
        since: viewsPerMonth[0]?.month ?? "",
    };
};

const resolvePostTitle = (path: string): string => {
    const post = getPosts().find((entry) => entry.slug.formatted === path);

    return post?.frontmatter.title ?? path;
};

export const getAnalyticsStats = async (): Promise<AnalyticsStats | null> => {
    const config = readAnalyticsConfig();

    if (!config) {
        return null;
    }

    try {
        const client = new BetaAnalyticsDataClient({
            credentials: {
                client_email: config.clientEmail,
                private_key: config.privateKey,
            },
        });
        const property = `properties/${config.propertyId}`;
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

        return mapReportsToAnalyticsStats(
            totalsResponse.rows,
            viewsPerMonthResponse.rows,
            topPostsResponse.rows,
            resolvePostTitle,
        );
    } catch {
        return null;
    }
};
