import type { HistoricalAnalytics } from "@/types/content/analytics-stats";

export const HISTORICAL_ANALYTICS: HistoricalAnalytics = {
    window: { start: "May 2017", end: "May 2021" },
    totals: { pageViews: 148579, users: 77736, sessions: 97173 },
    byContinent: [
        { label: "Europe", users: 27036 },
        { label: "Americas", users: 25970 },
        { label: "Asia", users: 21208 },
        { label: "Oceania", users: 1628 },
        { label: "Africa", users: 1337 },
        { label: "Unknown", users: 446 },
    ],
    byDevice: [
        { label: "Desktop", users: 65270 },
        { label: "Mobile", users: 15169 },
        { label: "Tablet", users: 764 },
    ],
    pageViewsCumulativeAnchors: [
        { month: "201705", total: 0 },
        { month: "202005", total: 84903 },
        { month: "202105", total: 148579 },
    ],
};
