import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TerminalProgressBar } from "./terminal-progress-bar";

describe("TerminalProgressBar", () => {
    describe("render", () => {
        it("renders loading message when percentage is below 100", () => {
            render(
                <TerminalProgressBar
                    percentage={50}
                    loadingMessage="Loading..."
                    completeMessage="Done!"
                />,
            );
            expect(screen.getByText(/Loading\.\.\./)).toBeInTheDocument();
        });

        it("renders complete message when percentage is 100", () => {
            render(
                <TerminalProgressBar
                    percentage={100}
                    loadingMessage="Loading..."
                    completeMessage="Done!"
                />,
            );
            expect(screen.getByText(/Done!/)).toBeInTheDocument();
        });

        it("renders the progress bar characters", () => {
            render(
                <TerminalProgressBar
                    percentage={50}
                    loadingMessage="Loading"
                    completeMessage="Done"
                />,
            );
            expect(screen.getByText(/█.*░/)).toBeInTheDocument();
        });
    });

    describe("props", () => {
        it("hides cursor when shouldReduceMotion is true", () => {
            const { container } = render(
                <TerminalProgressBar
                    percentage={50}
                    loadingMessage="Loading"
                    completeMessage="Done"
                    shouldReduceMotion={true}
                />,
            );
            expect(container.querySelector(".terminal-cursor")).toBeNull();
        });
    });
});
