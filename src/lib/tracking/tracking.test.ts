import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockHasConsented, mockSendGAEvent } = vi.hoisted(() => ({
    mockHasConsented: vi.fn(),
    mockSendGAEvent: vi.fn(),
}));

vi.mock("@/lib/consents/consents", () => ({
    hasConsented: mockHasConsented,
}));

vi.mock("@next/third-parties/google", () => ({
    sendGAEvent: mockSendGAEvent,
}));

import { trackWith } from "./tracking";

describe("trackWith", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("when user has consented", () => {
        it("fires sendGAEvent with the correct action and payload", () => {
            mockHasConsented.mockReturnValue(true);

            trackWith({ action: "open_blog", category: "home", label: "footer" });

            expect(mockSendGAEvent).toHaveBeenCalledOnce();
            expect(mockSendGAEvent).toHaveBeenCalledWith("event", "open_blog", {
                event_category: "home",
                event_label: "footer",
            });
        });

        it("passes undefined label through untouched", () => {
            mockHasConsented.mockReturnValue(true);

            trackWith({ action: "reload", category: "home", label: undefined });

            expect(mockSendGAEvent).toHaveBeenCalledWith("event", "reload", {
                event_category: "home",
                event_label: undefined,
            });
        });
    });

    describe("when user has not consented", () => {
        it("does not fire sendGAEvent", () => {
            mockHasConsented.mockReturnValue(false);

            trackWith({ action: "open_blog", category: "home", label: "header" });

            expect(mockSendGAEvent).not.toHaveBeenCalled();
        });
    });
});
