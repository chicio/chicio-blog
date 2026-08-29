import { describe, it, expect, vi } from "vitest";
import { render, screen, nextLinkMock } from "@/test-utils";
import { TopPostsList } from "./index";

vi.mock("next/link", () => nextLinkMock());

describe("TopPostsList", () => {
    describe("render", () => {
        it("renders each post's rank, linked title, and formatted view count", () => {
            render(
                <TopPostsList
                    data={[
                        { path: "/blog/post/2024/01/01/first", title: "First post", views: 41204 },
                        { path: "/blog/post/2024/02/01/second", title: "Second post", views: 3390 },
                    ]}
                />,
            );

            expect(screen.getByText("01")).toBeInTheDocument();
            expect(screen.getByRole("link", { name: "First post" })).toHaveAttribute(
                "href",
                "/blog/post/2024/01/01/first",
            );
            expect(screen.getByText("41,204")).toBeInTheDocument();
            expect(screen.getByText("02")).toBeInTheDocument();
            expect(screen.getByRole("link", { name: "Second post" })).toHaveAttribute(
                "href",
                "/blog/post/2024/02/01/second",
            );
            expect(screen.getByText("3,390")).toBeInTheDocument();
        });

        it("renders nothing but an empty container when there are no posts", () => {
            const { container } = render(<TopPostsList data={[]} />);
            expect(container.querySelector("div")?.childElementCount).toBe(0);
        });
    });
});
