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
