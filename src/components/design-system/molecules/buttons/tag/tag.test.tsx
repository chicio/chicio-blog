import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tag } from "./tag";

vi.mock("next/link", () => ({
    default: ({ href, children, className, onClick }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
        <a href={href} className={className} onClick={onClick}>{children}</a>
    ),
}));

describe("Tag", () => {
    describe("render", () => {
        it("renders the tag text", () => {
            render(<Tag tag="typescript" link="/tags/typescript" big={false} />);
            expect(screen.getByText("typescript")).toBeInTheDocument();
        });

        it("renders as a link with the correct href", () => {
            render(<Tag tag="react" link="/tags/react" big={false} />);
            expect(screen.getByRole("link")).toHaveAttribute("href", "/tags/react");
        });
    });

    describe("props", () => {
        it("applies large text class when big is true", () => {
            render(<Tag tag="big-tag" link="/tags/big-tag" big={true} />);
            expect(screen.getByText("big-tag")).toHaveClass("text-2xl");
        });

        it("applies small text class when big is false", () => {
            render(<Tag tag="small-tag" link="/tags/small-tag" big={false} />);
            expect(screen.getByText("small-tag")).toHaveClass("text-sm");
        });
    });

    describe("interaction", () => {
        it("calls onClick when clicked", async () => {
            const onClick = vi.fn();
            render(<Tag tag="click-me" link="/tags/click-me" big={false} onClick={onClick} />);
            await userEvent.click(screen.getByRole("link"));
            expect(onClick).toHaveBeenCalledOnce();
        });
    });
});
