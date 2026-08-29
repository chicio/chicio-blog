import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test-utils";
import { ChromeAiFeaturesToolbar } from "./index";

describe("ChromeAiFeaturesToolbar", () => {
    describe("when Chrome AI is unavailable", () => {
        it("renders nothing when the Summarizer API is absent", () => {
            render(<ChromeAiFeaturesToolbar contentContainerId="post-content" />);
            expect(screen.queryByText(/AI features/)).not.toBeInTheDocument();
        });
    });

    describe("when Chrome AI is available", () => {
        it("renders the AI features accordion when Summarizer is present", async () => {
            const mockAvailability = vi.fn().mockResolvedValue("available");
            Object.defineProperty(globalThis, "Summarizer", {
                value: { availability: mockAvailability },
                configurable: true,
                writable: true,
            });

            render(<ChromeAiFeaturesToolbar contentContainerId="post-content" />);

            await vi.waitFor(() => {
                expect(screen.getByText(/AI features/)).toBeInTheDocument();
            });

            delete (globalThis as Record<string, unknown>)["Summarizer"];
        });
    });
});
