import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MatrixTerminal } from "./matrix-terminal";

vi.mock("@/components/design-system/atoms/animation/motion-div", () => ({
    MotionDiv: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
        <div {...props}>{children}</div>
    ),
}));

vi.mock("./use-matrix-terminal-store", () => ({
    useMatrixTerminalStore: (lines: Array<{ text: string; type?: string }>) => ({
        state: {
            containerRef: { current: null },
            completedLines: lines,
            currentLine: null,
            currentText: "",
        },
    }),
}));

describe("MatrixTerminal", () => {
    describe("render", () => {
        it("renders completed terminal lines", () => {
            render(
                <MatrixTerminal
                    lines={[
                        { text: "Initializing system..." },
                        { text: "Connection established.", type: "success" as const },
                    ]}
                />,
            );
            expect(screen.getByText("Initializing system...")).toBeInTheDocument();
            expect(screen.getByText("Connection established.")).toBeInTheDocument();
        });

        it("renders error lines with the correct text", () => {
            render(
                <MatrixTerminal
                    lines={[{ text: "Access denied.", type: "error" as const }]}
                />,
            );
            expect(screen.getByText("Access denied.")).toBeInTheDocument();
        });

        it("renders an empty terminal when lines array is empty", () => {
            render(<MatrixTerminal lines={[]} />);
            expect(screen.queryByText(">")).not.toBeInTheDocument();
        });
    });
});
