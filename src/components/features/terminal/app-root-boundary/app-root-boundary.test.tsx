import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils";
import { getAppRootElement, registerAppRootElement } from "@/lib/terminal/terminal-overlay-dom";
import { AppRootBoundary } from "./app-root-boundary";

describe("AppRootBoundary", () => {
    it("renders its children unchanged", () => {
        render(
            <AppRootBoundary>
                <p>page content</p>
            </AppRootBoundary>,
        );

        expect(screen.getByText("page content")).toBeInTheDocument();
    });

    it("registers its DOM node as the app root on mount and clears it on unmount", () => {
        registerAppRootElement(null);

        const { unmount } = render(
            <AppRootBoundary>
                <p>page content</p>
            </AppRootBoundary>,
        );

        expect(getAppRootElement()).not.toBeNull();
        expect(getAppRootElement()?.textContent).toBe("page content");

        unmount();
        expect(getAppRootElement()).toBeNull();
    });
});
