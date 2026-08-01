import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useLockBodyScroll } from "./use-lock-body-scroll";

vi.mock("./use-is-ios", () => ({
    useIsIOS: vi.fn(),
}));

import { useIsIOS } from "./use-is-ios";

const mockUseIsIOS = vi.mocked(useIsIOS);

describe("useLockBodyScroll", () => {
    afterEach(() => {
        document.documentElement.style.overflow = "";
        document.documentElement.style.paddingRight = "";
        document.documentElement.style.scrollBehavior = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.classList.remove("scroll-locked");
    });

    describe("on non-iOS", () => {
        it("sets overflow hidden on documentElement", () => {
            mockUseIsIOS.mockReturnValue(false);
            renderHook(() => useLockBodyScroll());
            expect(document.documentElement.style.overflow).toBe("hidden");
        });

        it("restores overflow on unmount", () => {
            mockUseIsIOS.mockReturnValue(false);
            document.documentElement.style.overflow = "auto";
            const { unmount } = renderHook(() => useLockBodyScroll());
            unmount();
            expect(document.documentElement.style.overflow).toBe("auto");
        });
    });

    describe("on iOS", () => {
        it("sets body position to fixed", () => {
            mockUseIsIOS.mockReturnValue(true);
            renderHook(() => useLockBodyScroll());
            expect(document.body.style.position).toBe("fixed");
        });

        it("restores body position on unmount", () => {
            mockUseIsIOS.mockReturnValue(true);
            document.body.style.position = "static";
            const { unmount } = renderHook(() => useLockBodyScroll());
            unmount();
            expect(document.body.style.position).toBe("static");
        });

        it("forces scroll-behavior to auto for the scroll restoration, even when smooth scrolling is active, then restores the original value (regression: reading companion TOC's smooth-scroll class turned this jump into a visible animation)", () => {
            mockUseIsIOS.mockReturnValue(true);
            document.documentElement.style.scrollBehavior = "smooth";
            let scrollBehaviorDuringScroll: string | undefined;
            const scrollToSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {
                scrollBehaviorDuringScroll = document.documentElement.style.scrollBehavior;
            });

            const { unmount } = renderHook(() => useLockBodyScroll());
            unmount();

            expect(scrollToSpy).toHaveBeenCalled();
            expect(scrollBehaviorDuringScroll).toBe("auto");
            expect(document.documentElement.style.scrollBehavior).toBe("smooth");

            scrollToSpy.mockRestore();
        });
    });
});
