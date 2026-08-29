import { describe, it, expect, vi } from "vitest";
import { matrixRainPanelOpenEvent, openMatrixRainPanel } from "./matrix-rain-panel-events";

describe("matrix-rain-panel-events", () => {
    describe("openMatrixRainPanel", () => {
        it("dispatches the matrix rain panel open event", () => {
            const listener = vi.fn();
            window.addEventListener(matrixRainPanelOpenEvent, listener);

            openMatrixRainPanel();

            expect(listener).toHaveBeenCalledOnce();
            window.removeEventListener(matrixRainPanelOpenEvent, listener);
        });
    });
});
