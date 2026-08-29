import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, motionDivMock } from "@/test-utils";
import { ChromeSummaryModal } from "./index";

vi.mock("@/components/design-system/atoms/animation/motion-div", () => motionDivMock());

const defaultProps = {
    title: "TL;DR",
    content: "",
    status: "loading" as const,
    downloadProgress: 0,
    onClose: vi.fn(),
    onRetry: vi.fn(),
};

describe("ChromeSummaryModal", () => {
    describe("render", () => {
        it("renders the modal title", () => {
            render(<ChromeSummaryModal {...defaultProps} />);
            expect(screen.getByText("TL;DR")).toBeInTheDocument();
        });

        it("renders the close button", () => {
            render(<ChromeSummaryModal {...defaultProps} />);
            expect(screen.getByText("Close")).toBeInTheDocument();
        });
    });

    describe("status variants", () => {
        it("renders a loader status element when status is loading", () => {
            render(<ChromeSummaryModal {...defaultProps} status="loading" />);
            expect(screen.getByRole("status", { name: "Generating summary" })).toBeInTheDocument();
        });

        it("renders the content when status is done and content is provided", () => {
            render(<ChromeSummaryModal {...defaultProps} status="done" content="Summary text here." />);
            expect(screen.getByText("Summary text here.")).toBeInTheDocument();
        });

        it("renders an error message and retry button when status is error", () => {
            render(<ChromeSummaryModal {...defaultProps} status="error" />);
            expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
            expect(screen.getByText("Retry")).toBeInTheDocument();
        });
    });

    describe("interactions", () => {
        it("calls onClose when the close button is clicked", async () => {
            const onClose = vi.fn();
            render(<ChromeSummaryModal {...defaultProps} onClose={onClose} />);
            await userEvent.click(screen.getByText("Close"));
            expect(onClose).toHaveBeenCalledOnce();
        });

        it("calls onRetry when the retry button is clicked", async () => {
            const onRetry = vi.fn();
            render(<ChromeSummaryModal {...defaultProps} status="error" onRetry={onRetry} />);
            await userEvent.click(screen.getByText("Retry"));
            expect(onRetry).toHaveBeenCalledOnce();
        });
    });
});
