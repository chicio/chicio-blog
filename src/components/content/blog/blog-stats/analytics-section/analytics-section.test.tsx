import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnalyticsSection } from "./index";
import type { AllTimeAnalytics, AnalyticsStats } from "@/types/content/analytics-stats";

const allTime: AllTimeAnalytics = {
    totals: { pageViews: 12345, users: 6789, sessions: 8000 },
    byContinent: [
        { label: "Europe", users: 4000 },
        { label: "Americas", users: 2000 },
    ],
    byDevice: [
        { label: "Desktop", users: 5000 },
        { label: "Mobile", users: 1500 },
    ],
    historicalWindow: { start: "May 2017", end: "May 2021" },
    hasGa4: true,
    pageViewsTimeline: [
        { month: "201705", estimated: 100, live: null },
        { month: "202105", estimated: 6000, live: 6000 },
        { month: "202401", estimated: null, live: 500 },
        { month: "202402", estimated: null, live: 700 },
    ],
};

const ga4: AnalyticsStats = {
    totals: { pageViews: 2345, users: 789, sessions: 900 },
    viewsPerMonth: [
        { month: "202401", views: 500 },
        { month: "202402", views: 700 },
    ],
    topPosts: [{ path: "/blog/post/2024/01/01/my-post", title: "My Post", views: 300 }],
    byContinent: [{ label: "Europe", users: 100 }],
    byDevice: [{ label: "desktop", users: 80 }],
    byBrowser: [{ label: "Chrome", users: 90 }],
    byOs: [{ label: "Macintosh", users: 70 }],
    since: "202401",
};

describe("AnalyticsSection", () => {
    describe("render", () => {
        it("renders the all-time totals even when GA4 is absent (stub mode)", () => {
            render(
                <AnalyticsSection
                    allTime={{ ...allTime, hasGa4: false }}
                    ga4={null}
                />,
            );

            expect(screen.getByText("Page views").previousElementSibling).toHaveTextContent("12,345");
            expect(screen.getByText("Users").previousElementSibling).toHaveTextContent("6,789");
            expect(screen.getByText("Sessions").previousElementSibling).toHaveTextContent("8,000");
        });

        it("renders the all-time breakdown headings", () => {
            render(
                <AnalyticsSection
                    allTime={allTime}
                    ga4={ga4}
                />,
            );

            expect(screen.getByRole("heading", { level: 2, name: "Traffic" })).toBeInTheDocument();
            expect(screen.getByRole("heading", { level: 2, name: "Users by continent" })).toBeInTheDocument();
            expect(screen.getByRole("heading", { level: 2, name: "Users by device" })).toBeInTheDocument();
        });

        it("always renders Views over time but hides Top posts when GA4 is absent", () => {
            render(
                <AnalyticsSection
                    allTime={{ ...allTime, hasGa4: false }}
                    ga4={null}
                />,
            );

            expect(screen.getByRole("heading", { level: 2, name: "Views over time" })).toBeInTheDocument();
            expect(screen.queryByRole("heading", { level: 2, name: "Top posts by views" })).not.toBeInTheDocument();
        });

        it("shows Top posts and the live-since caption when GA4 is present", () => {
            render(
                <AnalyticsSection
                    allTime={allTime}
                    ga4={ga4}
                />,
            );

            expect(screen.getByRole("heading", { level: 2, name: "Views over time" })).toBeInTheDocument();
            expect(screen.getByRole("heading", { level: 2, name: "Top posts by views" })).toBeInTheDocument();
            expect(screen.getByText(/live GA4 data since January 2024/)).toBeInTheDocument();
        });

        it("notes the estimate is UA-only when GA4 is absent", () => {
            render(
                <AnalyticsSection
                    allTime={{ ...allTime, hasGa4: false }}
                    ga4={null}
                />,
            );

            expect(screen.getByText(/estimated from Universal Analytics \(May 2017 – May 2021\)/)).toBeInTheDocument();
        });

        it("notes totals combine both eras when GA4 is present", () => {
            render(
                <AnalyticsSection
                    allTime={allTime}
                    ga4={ga4}
                />,
            );

            expect(screen.getByText(/combine live GA4 data with estimated Universal Analytics/)).toBeInTheDocument();
        });
    });
});
