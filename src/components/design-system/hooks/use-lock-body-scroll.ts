import { useLayoutEffect } from "react";
import { useIsIOS } from "./use-is-ios";

export const useLockBodyScroll = () => {
    const isIOS = useIsIOS();

    useLayoutEffect(() => {
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        const originalOverflow = document.documentElement.style.overflow;
        const originalPaddingRight = document.documentElement.style.paddingRight;

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
            document.documentElement.style.setProperty("--scrollbar-width", scrollBarWidth + "px");
        }

        return () => {
            document.documentElement.style.overflow = originalOverflow;
            document.documentElement.style.paddingRight = originalPaddingRight;
            document.body.classList.remove("scroll-locked");
            document.documentElement.style.removeProperty("--scrollbar-width");

            if (isIOS) {
                document.body.style.position = originalBodyPosition;
                document.body.style.top = originalBodyTop;

                // The reading companion table of contents toggles `scroll-behavior: smooth` on <html>
                // (see `use-table-of-contents-store.ts`) while it is mounted. If that class happens to be
                // active when this restore runs, an unguarded `window.scrollTo` animates back down to
                // `scrollY` instead of jumping instantly, the same footgun Next's own router scroll
                // restoration works around. Force `auto` for the duration of this single call, then put
                // whatever value was there back exactly as it was.
                const htmlStyle = document.documentElement.style;
                const originalScrollBehavior = htmlStyle.scrollBehavior;
                htmlStyle.scrollBehavior = "auto";
                window.scrollTo(0, scrollY);
                htmlStyle.scrollBehavior = originalScrollBehavior;
            }
        };
    }, [isIOS]);
};
