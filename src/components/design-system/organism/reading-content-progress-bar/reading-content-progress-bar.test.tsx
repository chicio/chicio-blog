import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContentProgressBar } from "./reading-content-progress-bar";

vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, initial: _i, animate: _a, exit: _e, transition: _t, style: _s, ...props }: React.HTMLAttributes<HTMLDivElement> & { initial?: unknown; animate?: unknown; exit?: unknown; transition?: unknown }) => (
            <div {...props}>{children}</div>
        ),
    },
}));

describe("ContentProgressBar", () => {
    describe("render", () => {
        it("renders without throwing", () => {
            render(<ContentProgressBar contentId="test-content" />);
            expect(document.body).toBeTruthy();
        });

        it("renders the terminal progress bar loading message", () => {
            render(<ContentProgressBar contentId="test-content" />);
            expect(screen.getByText(/Uploading knowledge/)).toBeInTheDocument();
        });
    });
});
