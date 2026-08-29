import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GlassmorphismBackground } from "./glassmorphism-background";

vi.mock("@/components/design-system/atoms/animation/motion-div", () => ({
    MotionDiv: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
        <div {...props}>{children}</div>
    ),
}));

describe("GlassmorphismBackground", () => {
    describe("render", () => {
        it("renders children", () => {
            render(<GlassmorphismBackground>Inner content</GlassmorphismBackground>);
            expect(screen.getByText("Inner content")).toBeInTheDocument();
        });

        it("applies glassmorphism class from the store", () => {
            const { container } = render(<GlassmorphismBackground>Content</GlassmorphismBackground>);
            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper.className).toMatch(/glassmorphism/);
        });

        it("appends an extra className when provided", () => {
            const { container } = render(
                <GlassmorphismBackground className="extra-class">Content</GlassmorphismBackground>,
            );
            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper.className).toContain("extra-class");
        });
    });
});
