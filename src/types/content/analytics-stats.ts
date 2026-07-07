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

export interface AnalyticsStats {
    totals: AnalyticsTotals;
    viewsPerMonth: ViewsPerMonth[];
    topPosts: TopPost[];
    since: string;
}

export interface DimensionCount {
    label: string;
    users: number;
}

export interface HistoricalAnalytics {
    window: { start: string; end: string };
    totals: AnalyticsTotals;
    byContinent: DimensionCount[];
    byDevice: DimensionCount[];
}

export interface AllTimeAnalytics {
    totals: AnalyticsTotals;
    byContinent: DimensionCount[];
    byDevice: DimensionCount[];
    historicalWindow: { start: string; end: string };
    hasGa4: boolean;
}
