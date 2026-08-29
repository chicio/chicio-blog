import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Breadcrumb, BreadcrumbItem } from "./breadcrumb";

vi.mock("next/link", () => ({
    default: ({ href, children, className, onClick }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
        <a href={href} className={className} onClick={onClick}>{children}</a>
    ),
}));

vi.mock("framer-motion", () => ({
    motion: {
        nav: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
            <nav {...props}>{children}</nav>
        ),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("./use-breadcrumb-store", () => ({
    useBreadcrumbStore: () => ({
        state: { navRef: { current: null }, isVisible: false },
    }),
}));

describe("Breadcrumb", () => {
    const items: BreadcrumbItem[] = [
        { label: "Home", href: "/", isCurrent: false },
        { label: "Blog", href: "/blog", isCurrent: false },
        { label: "My Post", href: "/blog/my-post", isCurrent: true },
    ];

    describe("render", () => {
        it("renders the current page label", () => {
            render(<Breadcrumb items={items} />);
            expect(screen.getAllByText("My Post").length).toBeGreaterThan(0);
        });

        it("renders parent item links", () => {
            render(<Breadcrumb items={items} />);
            const homeLinks = screen.getAllByRole("link", { name: "Home" });
            expect(homeLinks.length).toBeGreaterThan(0);
        });

        it("marks the current page with aria-current=page", () => {
            render(<Breadcrumb items={items} />);
            const current = screen.getAllByText("My Post").find(
                (el) => el.getAttribute("aria-current") === "page",
            );
            expect(current).toBeInTheDocument();
        });

        it("renders nav element with accessible label", () => {
            render(<Breadcrumb items={items} />);
            expect(screen.getAllByRole("navigation", { name: "Breadcrumb" }).length).toBeGreaterThan(0);
        });
    });

    describe("interaction", () => {
        it("calls onClick of a breadcrumb item when clicked", async () => {
            const onClick = vi.fn();
            const itemsWithCallback: BreadcrumbItem[] = [
                { label: "Home", href: "/", isCurrent: false, onClick },
                { label: "Page", href: "/page", isCurrent: true },
            ];
            render(<Breadcrumb items={itemsWithCallback} />);
            const homeLink = screen.getAllByRole("link", { name: "Home" })[0];
            await userEvent.click(homeLink);
            expect(onClick).toHaveBeenCalledOnce();
        });
    });
});
