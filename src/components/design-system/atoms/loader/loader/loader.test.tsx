import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Loader } from "./loader";

vi.mock("@/components/design-system/atoms/animation/motion-div", () => ({
    MotionDiv: ({ children, className }: React.HTMLAttributes<HTMLDivElement>) => (
        <div className={className}>{children}</div>
    ),
}));

describe("Loader", () => {
    describe("render", () => {
        it("renders a status element with the default label", () => {
            render(<Loader />);
            expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
        });

        it("renders a status element with a custom label", () => {
            render(<Loader label="Please wait" />);
            expect(screen.getByRole("status", { name: "Please wait" })).toBeInTheDocument();
        });

        it("renders three animated dots", () => {
            const { container } = render(<Loader />);
            const dots = container.querySelectorAll("[class*='rounded-full']");
            expect(dots.length).toBe(3);
        });
    });

    describe("props", () => {
        it("applies small size dot classes for size=sm", () => {
            const { container } = render(<Loader size="sm" />);
            const dots = container.querySelectorAll("[class*='h-1.5']");
            expect(dots.length).toBe(3);
        });

        it("applies large size dot classes for size=lg", () => {
            const { container } = render(<Loader size="lg" />);
            const dots = container.querySelectorAll("[class*='h-3.5']");
            expect(dots.length).toBe(3);
        });

        it("appends custom className to the wrapper", () => {
            const { container } = render(<Loader className="my-loader" />);
            const status = container.firstChild as HTMLElement;
            expect(status.className).toContain("my-loader");
        });
    });
});
