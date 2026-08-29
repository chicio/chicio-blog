import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Overlay } from "./overlay";

vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, onClick, className }: React.HTMLAttributes<HTMLDivElement>) => (
            <div role="dialog" className={className} onClick={onClick}>
                {children}
            </div>
        ),
    },
}));

vi.mock("@/components/design-system/hooks/use-lock-body-scroll", () => ({
    useLockBodyScroll: vi.fn(),
}));

describe("Overlay", () => {
    describe("render", () => {
        it("mounts without throwing", () => {
            render(<Overlay delay={0} />);
            expect(document.body).toBeInTheDocument();
        });

        it("renders children inside the overlay", () => {
            render(<Overlay delay={0}><span>Overlay content</span></Overlay>);
            expect(screen.getByText("Overlay content")).toBeInTheDocument();
        });

        it("forwards additional className", () => {
            render(<Overlay delay={0} className="custom-overlay" />);
            const el = screen.getByRole("dialog");
            expect(el.className).toContain("custom-overlay");
        });
    });

    describe("interaction", () => {
        it("calls onClick when the overlay is clicked", async () => {
            const onClick = vi.fn();
            render(<Overlay delay={0} onClick={onClick} />);
            await userEvent.click(screen.getByRole("dialog"));
            expect(onClick).toHaveBeenCalledOnce();
        });
    });
});
