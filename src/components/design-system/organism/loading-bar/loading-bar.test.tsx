import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingBar } from "./loading-bar";

describe("LoadingBar", () => {
    describe("render", () => {
        it("renders the default message", () => {
            render(<LoadingBar />);
            expect(screen.getByText(/Processing\.\.\./)).toBeInTheDocument();
        });

        it("renders a custom message when provided", () => {
            render(<LoadingBar message="Loading data..." />);
            expect(screen.getByText(/Loading data\.\.\./)).toBeInTheDocument();
        });

        it("renders the animated progress bar characters", () => {
            const { container } = render(<LoadingBar />);
            const divs = container.querySelectorAll("div");
            expect(divs.length).toBeGreaterThanOrEqual(2);
        });
    });
});
