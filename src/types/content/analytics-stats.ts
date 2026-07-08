export interface AnalyticsTotals {
    pageViews: number;
    users: number;
    sessions: number;
}

export interface ViewsPerMonth {
    month: string;
    views: number;
}

export interface TopPost {
    path: string;
    title: string;
    views: number;
}

export interface DimensionCount {
    label: string;
    users: number;
}

export interface AnalyticsStats {
    totals: AnalyticsTotals;
    viewsPerMonth: ViewsPerMonth[];
    topPosts: TopPost[];
    byContinent: DimensionCount[];
    byDevice: DimensionCount[];
    since: string;
}

export interface CumulativeAnchor {
    month: string;
    total: number;
}

export interface HistoricalAnalytics {
    window: { start: string; end: string };
    totals: AnalyticsTotals;
    byContinent: DimensionCount[];
    byDevice: DimensionCount[];
    pageViewsCumulativeAnchors: CumulativeAnchor[];
}

export interface ViewsPoint {
    month: string;
    estimated: number | null;
    live: number | null;
}

export interface AllTimeAnalytics {
    totals: AnalyticsTotals;
    byContinent: DimensionCount[];
    byDevice: DimensionCount[];
    historicalWindow: { start: string; end: string };
    hasGa4: boolean;
    pageViewsTimeline: ViewsPoint[];
}

export interface AnalyticsData {
    allTime: AllTimeAnalytics;
    ga4: AnalyticsStats | null;
}
