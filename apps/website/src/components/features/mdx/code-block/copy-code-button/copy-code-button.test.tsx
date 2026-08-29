import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test-utils";
import { fireEvent } from "@testing-library/react";
import { CopyCodeButton } from "./copy-code-button";

const writeText = vi.fn();

describe("CopyCodeButton", () => {
    describe("when clipboard is unavailable", () => {
        it("renders nothing", () => {
            const { container } = render(<CopyCodeButton getText={() => "code"} />);
            expect(container.firstChild).toBeNull();
        });
    });

    describe("when clipboard is available", () => {
        beforeEach(() => {
            Object.defineProperty(navigator, "clipboard", {
                value: { writeText },
                writable: true,
                configurable: true,
            });
        });

        it("renders a copy button with the correct aria-label", () => {
            render(<CopyCodeButton getText={() => "const x = 1;"} />);
            expect(screen.getByRole("button", { name: "Copy code" })).toBeInTheDocument();
        });

        it("shows copied state after a successful copy", async () => {
            writeText.mockResolvedValueOnce(undefined);
            render(<CopyCodeButton getText={() => "hello"} />);
            fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
            expect(await screen.findByRole("button", { name: "Copied!" })).toBeInTheDocument();
        });

        it("shows error state after a failed copy", async () => {
            writeText.mockRejectedValueOnce(new Error("denied"));
            render(<CopyCodeButton getText={() => "hello"} />);
            fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
            expect(await screen.findByRole("button", { name: "Copy failed" })).toBeInTheDocument();
        });
    });
});
