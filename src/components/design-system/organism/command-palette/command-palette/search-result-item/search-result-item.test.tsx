import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SearchResultItem } from "./search-result-item";

vi.mock("cmdk", () => ({
    Command: Object.assign(
        ({ children }: React.PropsWithChildren) => <div>{children}</div>,
        {
            Item: ({
                children,
                onSelect,
                value,
            }: React.PropsWithChildren<{ onSelect?: () => void; value?: string }>) => (
                <div role="option" aria-label={value} onClick={onSelect}>
                    {children}
                </div>
            ),
        },
    ),
}));

describe("SearchResultItem", () => {
    describe("render", () => {
        it("renders the title", () => {
            render(
                <SearchResultItem
                    title="Test Article"
                    description="A great article"
                    slug="/blog/test"
                    onSelect={vi.fn()}
                />,
            );
            expect(screen.getByText(/Test Article/)).toBeInTheDocument();
        });

        it("renders the description", () => {
            render(
                <SearchResultItem
                    title="Test Article"
                    description="A great article"
                    slug="/blog/test"
                    onSelect={vi.fn()}
                />,
            );
            expect(screen.getByText("A great article")).toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("calls onSelect with the slug when item is selected", () => {
            const onSelect = vi.fn();
            render(
                <SearchResultItem
                    title="Test Article"
                    description="A great article"
                    slug="/blog/test"
                    onSelect={onSelect}
                />,
            );
            screen.getByRole("option").click();
            expect(onSelect).toHaveBeenCalledWith("/blog/test");
        });
    });
});
