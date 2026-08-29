import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PaginationNavigation } from "./pagination-navigation";

vi.mock("next/link", () => ({
    default: ({ href, children, className, onClick }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
        <a href={href} className={className} onClick={onClick}>{children}</a>
    ),
}));

describe("PaginationNavigation", () => {
    describe("render", () => {
        it("renders Previous link when previousPageUrl is provided", () => {
            render(
                <PaginationNavigation
                    previousPageUrl="/blog/page/1"
                    nextPageUrl={undefined}
                />,
            );
            expect(screen.getByText("Previous")).toBeInTheDocument();
        });

        it("renders Next link when nextPageUrl is provided", () => {
            render(
                <PaginationNavigation
                    previousPageUrl={undefined}
                    nextPageUrl="/blog/page/3"
                />,
            );
            expect(screen.getByText("Next")).toBeInTheDocument();
        });

        it("renders both links when both URLs are provided", () => {
            render(
                <PaginationNavigation
                    previousPageUrl="/blog/page/1"
                    nextPageUrl="/blog/page/3"
                />,
            );
            expect(screen.getByText("Previous")).toBeInTheDocument();
            expect(screen.getByText("Next")).toBeInTheDocument();
        });

        it("renders nothing when both URLs are undefined", () => {
            const { container } = render(
                <PaginationNavigation
                    previousPageUrl={undefined}
                    nextPageUrl={undefined}
                />,
            );
            expect(screen.queryByText("Previous")).not.toBeInTheDocument();
            expect(screen.queryByText("Next")).not.toBeInTheDocument();
            expect(container.querySelector("a")).toBeNull();
        });
    });

    describe("interaction", () => {
        it("calls onPreviousClick when Previous is clicked", async () => {
            const onPreviousClick = vi.fn();
            render(
                <PaginationNavigation
                    previousPageUrl="/blog/page/1"
                    onPreviousClick={onPreviousClick}
                    nextPageUrl={undefined}
                />,
            );
            await userEvent.click(screen.getByText("Previous"));
            expect(onPreviousClick).toHaveBeenCalledOnce();
        });

        it("calls onNextClick when Next is clicked", async () => {
            const onNextClick = vi.fn();
            render(
                <PaginationNavigation
                    previousPageUrl={undefined}
                    nextPageUrl="/blog/page/3"
                    onNextClick={onNextClick}
                />,
            );
            await userEvent.click(screen.getByText("Next"));
            expect(onNextClick).toHaveBeenCalledOnce();
        });
    });
});
