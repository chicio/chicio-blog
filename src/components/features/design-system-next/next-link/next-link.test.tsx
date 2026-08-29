import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextLink } from "./next-link";

vi.mock("next/link", () => ({
    default: ({
        href,
        children,
        onMouseEnter,
        onFocus,
        prefetch,
    }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; prefetch?: boolean | null }) => (
        <a
            href={href}
            onMouseEnter={onMouseEnter}
            onFocus={onFocus}
            data-prefetch={prefetch === undefined ? "undefined" : String(prefetch)}
        >
            {children}
        </a>
    ),
}));

describe("NextLink", () => {
    describe("prefetch strategy", () => {
        it("leaves Next's own default in place for the viewport strategy", () => {
            render(<NextLink href="/blog">Blog</NextLink>);
            expect(screen.getByRole("link")).toHaveAttribute("data-prefetch", "undefined");
        });

        it("defaults to the viewport strategy", () => {
            render(
                <NextLink href="/blog" prefetch="viewport">
                    Blog
                </NextLink>,
            );
            expect(screen.getByRole("link")).toHaveAttribute("data-prefetch", "undefined");
        });

        it("disables prefetching entirely for never", () => {
            render(
                <NextLink href="/blog" prefetch="never">
                    Blog
                </NextLink>,
            );
            expect(screen.getByRole("link")).toHaveAttribute("data-prefetch", "false");
        });

        it("holds prefetching back until the pointer arrives for hover", async () => {
            render(
                <NextLink href="/blog" prefetch="hover">
                    Blog
                </NextLink>,
            );
            const link = screen.getByRole("link");
            expect(link).toHaveAttribute("data-prefetch", "false");

            await userEvent.hover(link);
            expect(link).toHaveAttribute("data-prefetch", "null");
        });

        it("holds prefetching back until focus arrives for hover", async () => {
            render(
                <NextLink href="/blog" prefetch="hover">
                    Blog
                </NextLink>,
            );
            const link = screen.getByRole("link");
            expect(link).toHaveAttribute("data-prefetch", "false");

            await userEvent.tab();
            expect(link).toHaveFocus();
            expect(link).toHaveAttribute("data-prefetch", "null");
        });

        it("stays prefetchable once intent has been shown", async () => {
            render(
                <NextLink href="/blog" prefetch="hover">
                    Blog
                </NextLink>,
            );
            const link = screen.getByRole("link");

            await userEvent.hover(link);
            expect(link).toHaveAttribute("data-prefetch", "null");

            await userEvent.tab();
            expect(link).toHaveFocus();
            expect(link).toHaveAttribute("data-prefetch", "null");
        });
    });

    describe("caller handlers", () => {
        it("still calls a caller's own hover handler under the hover strategy", async () => {
            const onMouseEnter = vi.fn();
            render(
                <NextLink href="/blog" prefetch="hover" onMouseEnter={onMouseEnter}>
                    Blog
                </NextLink>,
            );
            await userEvent.hover(screen.getByRole("link"));
            expect(onMouseEnter).toHaveBeenCalledOnce();
        });

        it("passes a caller's hover handler straight through under other strategies", async () => {
            const onMouseEnter = vi.fn();
            render(
                <NextLink href="/blog" onMouseEnter={onMouseEnter}>
                    Blog
                </NextLink>,
            );
            await userEvent.hover(screen.getByRole("link"));
            expect(onMouseEnter).toHaveBeenCalledOnce();
        });
    });
});
