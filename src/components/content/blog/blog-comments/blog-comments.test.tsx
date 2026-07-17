import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { BlogComments } from "./index";

vi.mock("@giscus/react", () => ({
    default: (props: Record<string, unknown>) => <div data-testid="giscus" data-props={JSON.stringify(props)} />,
}));

const dispatchGiscusMessage = () => {
    window.dispatchEvent(new MessageEvent("message", { origin: "https://giscus.app", data: {} }));
};

describe("BlogComments", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe("render", () => {
        it("mounts the giscus widget", () => {
            render(<BlogComments />);
            expect(screen.getByTestId("giscus")).toBeInTheDocument();
        });

        it("passes the site's giscus configuration to the widget", () => {
            render(<BlogComments />);
            const props = JSON.parse(screen.getByTestId("giscus").getAttribute("data-props")!);
            expect(props.repo).toBe("chicio/chicio-blog");
            expect(props.mapping).toBe("pathname");
            expect(props.theme).toBe("https://www.fabrizioduroni.it/giscus-matrix.css");
        });

        it("shows the loading progress bar before giscus is loaded", () => {
            render(<BlogComments />);
            expect(screen.getByText(/loading comments/)).toBeInTheDocument();
        });
    });

    describe("progress", () => {
        it("keeps giscus mounted while the progress bar is visible", () => {
            render(<BlogComments />);
            expect(screen.getByText(/loading comments/)).toBeInTheDocument();
            expect(screen.getByTestId("giscus")).toBeInTheDocument();
        });

        it("hides the progress bar and keeps giscus mounted once giscus signals it has loaded", async () => {
            render(<BlogComments />);

            await act(async () => {
                dispatchGiscusMessage();
            });
            await act(async () => {
                vi.advanceTimersByTime(400);
            });

            expect(screen.queryByText(/loading comments/)).not.toBeInTheDocument();
            expect(screen.getByTestId("giscus")).toBeInTheDocument();
        });

        it("ignores messages from other origins", async () => {
            render(<BlogComments />);

            await act(async () => {
                window.dispatchEvent(new MessageEvent("message", { origin: "https://evil.example", data: {} }));
            });

            expect(screen.getByText(/loading comments/)).toBeInTheDocument();
        });

        it("completes even without a giscus message after the fallback timeout", async () => {
            render(<BlogComments />);

            await act(async () => {
                vi.advanceTimersByTime(12000);
            });
            await act(async () => {
                vi.advanceTimersByTime(400);
            });

            expect(screen.queryByText(/loading comments/)).not.toBeInTheDocument();
            expect(screen.getByTestId("giscus")).toBeInTheDocument();
        });
    });
});
