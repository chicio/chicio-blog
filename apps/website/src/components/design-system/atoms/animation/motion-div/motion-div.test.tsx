import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MotionDiv } from "./motion-div";

vi.mock("@/components/design-system/hooks/use-motion-store", () => ({
    useMotionStore: vi.fn(() => true),
}));

import { useMotionStore } from "@/components/design-system/hooks/use-motion-store";

const mockUseMotionStore = vi.mocked(useMotionStore);

vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    },
}));

describe("MotionDiv", () => {
    describe("render with motion enabled", () => {
        it("renders children via motion.div", () => {
            mockUseMotionStore.mockReturnValue(true);
            render(<MotionDiv>Hello</MotionDiv>);
            expect(screen.getByText("Hello")).toBeInTheDocument();
        });
    });

    describe("render with motion disabled", () => {
        it("renders children via a plain div", () => {
            mockUseMotionStore.mockReturnValue(false);
            render(<MotionDiv>Hello reduced</MotionDiv>);
            expect(screen.getByText("Hello reduced")).toBeInTheDocument();
        });

        it("strips motion-only props and passes through DOM-safe props", () => {
            mockUseMotionStore.mockReturnValue(false);
            render(
                <MotionDiv
                    data-testid="motion-div"
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    className="my-class"
                >
                    Content
                </MotionDiv>,
            );
            const el = screen.getByTestId("motion-div");
            expect(el.tagName).toBe("DIV");
            expect(el).toHaveClass("my-class");
        });
    });
});
