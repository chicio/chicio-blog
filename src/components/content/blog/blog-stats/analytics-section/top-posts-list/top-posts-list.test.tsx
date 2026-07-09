import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TopPostsList } from "./index";

describe("TopPostsList", () => {
    describe("render", () => {
        it("renders each post's rank, title, and formatted view count", () => {
            render(
                <TopPostsList
                    data={[
                        { path: "/blog/post/a", title: "First post", views: 41204 },
                        { path: "/blog/post/b", title: "Second post", views: 3390 },
                    ]}
                />,
            );

            expect(screen.getByText("01")).toBeInTheDocument();
            expect(screen.getByText("First post")).toBeInTheDocument();
            expect(screen.getByText("41,204")).toBeInTheDocument();
            expect(screen.getByText("02")).toBeInTheDocument();
            expect(screen.getByText("Second post")).toBeInTheDocument();
            expect(screen.getByText("3,390")).toBeInTheDocument();
        });

        it("renders nothing but an empty container when there are no posts", () => {
            const { container } = render(<TopPostsList data={[]} />);
            expect(container.querySelector("div")?.childElementCount).toBe(0);
        });
    });
});
