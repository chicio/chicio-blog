import { describe, it, expect, vi } from "vitest";
import { openTerminalOverlay, terminalOverlayOpenEvent } from "./terminal-events";

describe("terminal-events", () => {
    describe("openTerminalOverlay", () => {
        it("dispatches the terminal overlay open event", () => {
            const listener = vi.fn();
            window.addEventListener(terminalOverlayOpenEvent, listener);

            openTerminalOverlay();

            expect(listener).toHaveBeenCalledOnce();
            window.removeEventListener(terminalOverlayOpenEvent, listener);
        });
    });
});
