import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnalyticsSection } from "./index";
import type { AnalyticsStats } from "@/types/content/analytics-stats";

const analytics: AnalyticsStats = {
    totals: { pageViews: 12345, users: 6789, sessions: 8000 },
    viewsPerMonth: [
        { month: "202401", views: 500 },
        { month: "202402", views: 700 },
    ],
    topPosts: [
        { path: "/blog/post/2024/01/01/my-post", title: "My Post", views: 300 },
        { path: "/blog/post/2024/02/01/another-post", title: "Another Post", views: 150 },
    ],
    since: "202401",
};

describe("AnalyticsSection", () => {
    describe("render", () => {
        it("renders nothing when analytics is null (stub mode)", () => {
            const { container } = render(<AnalyticsSection analytics={null} />);
            expect(container).toBeEmptyDOMElement();
        });

        it("renders the totals next to their labels", () => {
            render(<AnalyticsSection analytics={analytics} />);

            expect(screen.getByText("Page views").previousElementSibling).toHaveTextContent("12,345");
            expect(screen.getByText("Users").previousElementSibling).toHaveTextContent("6,789");
            expect(screen.getByText("Sessions").previousElementSibling).toHaveTextContent("8,000");
        });

        it("renders the section headings", () => {
            render(<AnalyticsSection analytics={analytics} />);

            expect(screen.getByRole("heading", { level: 2, name: "Traffic" })).toBeInTheDocument();
            expect(screen.getByRole("heading", { level: 2, name: "Views over time" })).toBeInTheDocument();
            expect(screen.getByRole("heading", { level: 2, name: "Top posts by views" })).toBeInTheDocument();
        });

        it("renders the honest since-caption", () => {
            render(<AnalyticsSection analytics={analytics} />);
            expect(screen.getByText("Traffic since 202401.")).toBeInTheDocument();
        });
    });
});
