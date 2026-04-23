import { useLayoutEffect } from "react";
import { useIsIOS } from "./use-is-ios";

/**
 * Locks body scroll while `enabled` is true.
 * Defaults to always enabled (backward-compatible with existing callers).
 *
 * Pass `enabled={open}` from a parent to tie the lock to React state directly
 * instead of the component's mount/unmount lifecycle.  This is important when
 * the consumer is inside an AnimatePresence exit animation: the animation keeps
 * the component mounted for its duration, so a hook without `enabled` would
 * hold the lock until the animation finishes.  When the lock outlasts the
 * visible overlay, `overflow:hidden` on `<html>` corrupts `backdrop-filter`
 * on sibling fixed elements (e.g. the menu bar, brand header glassmorphism).
 */
export const useLockBodyScroll = (enabled = true) => {
    const isIOS = useIsIOS();

    useLayoutEffect(() => {
        if (!enabled) { return; }

        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        const originalOverflow = document.documentElement.style.overflow;
        const originalPaddingRight = document.documentElement.style.paddingRight;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        let originalBodyPosition = "";
        let originalBodyTop = "";
        let scrollY = 0;

        document.documentElement.style.overflow = "hidden";

        if (isIOS) {
            originalBodyPosition = document.body.style.position;
            originalBodyTop = document.body.style.top;
            scrollY = window.scrollY;
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
        }

        if (scrollBarWidth > 0) {
            document.documentElement.style.paddingRight = `${scrollBarWidth}px`;
            document.body.classList.add("scroll-locked");
            document.documentElement.style.setProperty("--scrollbar-width", scrollbarWidth + "px");
        }

        return () => {
            document.documentElement.style.overflow = originalOverflow;
            document.documentElement.style.paddingRight = originalPaddingRight;
            document.body.classList.remove("scroll-locked");
            document.documentElement.style.removeProperty("--scrollbar-width");

            if (isIOS) {
                document.body.style.position = originalBodyPosition;
                document.body.style.top = originalBodyTop;
                window.scrollTo(0, scrollY);
            }
        };
    }, [isIOS, enabled]);
};
