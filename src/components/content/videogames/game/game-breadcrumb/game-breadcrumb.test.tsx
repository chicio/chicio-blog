import { describe, it, expect, vi } from "vitest";
import { render, screen, nextLinkMock } from "@/test-utils";
import { GameBreadcrumb } from "./index";
import type { BreadcrumbItem } from "@/components/design-system/molecules/breadcrumbs/breadcrumb";

vi.mock("next/link", () => nextLinkMock());

vi.mock("framer-motion", () => ({
    motion: {
        nav: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
            <nav {...props}>{children}</nav>
        ),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/design-system/molecules/breadcrumbs/breadcrumb/use-breadcrumb-store", () => ({
    useBreadcrumbStore: () => ({
        state: { navRef: { current: null }, isVisible: false },
    }),
}));

const defaultProps = {
    gameTitle: "The Legend of Zelda",
    gameSlug: "/videogames/zelda",
    consoleName: "NES",
    consoleSlug: "/videogames/nes",
};

describe("GameBreadcrumb", () => {
    describe("render", () => {
        it("renders the Videogames home breadcrumb link", () => {
            render(<GameBreadcrumb {...defaultProps} />);
            expect(screen.getAllByText("Videogames").length).toBeGreaterThan(0);
        });

        it("renders the game title as the current breadcrumb item", () => {
            render(<GameBreadcrumb {...defaultProps} />);
            expect(screen.getAllByText("The Legend of Zelda").length).toBeGreaterThan(0);
        });

        it("renders the console name breadcrumb when origin is console (default)", () => {
            render(<GameBreadcrumb {...defaultProps} />);
            expect(screen.getAllByText("NES").length).toBeGreaterThan(0);
        });
    });
});
