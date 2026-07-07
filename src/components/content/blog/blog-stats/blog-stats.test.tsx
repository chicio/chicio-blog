import { describe, it, expect, vi } from "vitest";
import type { ReactNode } from "react";
import { render, screen } from "@/test-utils";
import { BlogStats } from "./index";
import type { BlogStats as BlogStatsData } from "@/types/content/blog-stats";

vi.mock("@/lib/tracking/tracking", () => ({ trackWith: vi.fn() }));

vi.mock("@/components/features/content/content-page", () => ({
    ContentPage: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));

const stats: BlogStatsData = {
    headline: {
        totalPosts: 42,
        totalWords: 123456,
        totalReadingMinutes: 987,
        yearsActive: 6,
        authorCount: 3,
        tagCount: 15,
    },
    postsPerYear: [
        { year: 2020, count: 5 },
        { year: 2021, count: 10 },
    ],
    tagDistribution: [
        { tag: "react", count: 8 },
        { tag: "node", count: 5 },
    ],
    externalAuthorDistribution: [
        { author: "Francesco Bonfadelli", count: 12 },
        { author: "Alessandro Romano", count: 4 },
    ],
};

describe("BlogStats", () => {
    describe("render", () => {
        it("renders the page title", () => {
            render(<BlogStats author="Fabrizio Duroni" stats={stats} />);
            expect(screen.getByRole("heading", { level: 1, name: "Blog Stats" })).toBeInTheDocument();
        });

        it("renders every headline counter next to its label", () => {
            render(<BlogStats author="Fabrizio Duroni" stats={stats} />);

            const expectations: [string, string][] = [
                ["Posts", "42"],
                ["Words", "123,456"],
                ["Reading minutes", "987"],
                ["Years active", "6"],
                ["Authors", "3"],
                ["Tags", "15"],
            ];

            expectations.forEach(([label, value]) => {
                expect(screen.getByText(label).previousElementSibling).toHaveTextContent(value);
            });
        });

        it("renders the section labels for each chart", () => {
            render(<BlogStats author="Fabrizio Duroni" stats={stats} />);
            expect(screen.getByRole("heading", { level: 2, name: "Posts per year" })).toBeInTheDocument();
            expect(screen.getByRole("heading", { level: 2, name: "Top tags" })).toBeInTheDocument();
            expect(screen.getByRole("heading", { level: 2, name: "Posts per external authors" })).toBeInTheDocument();
        });
    });
});
