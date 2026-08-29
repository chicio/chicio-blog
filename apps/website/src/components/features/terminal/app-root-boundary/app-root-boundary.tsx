"use client";

import { FC, ReactNode } from "react";
import { useAppRootBoundaryStore } from "./use-app-root-boundary-store";

interface AppRootBoundaryProps {
    children: ReactNode;
}

/**
 * Thin wrapper around the real page content in the root layout. Renders as
 * `display: contents` so it never affects page layout — its only job is to
 * expose a DOM node the terminal overlay can mark inert/aria-hidden while
 * open, so the background page is unreachable behind the modal shell.
 */
export const AppRootBoundary: FC<AppRootBoundaryProps> = ({ children }) => {
    const { effects } = useAppRootBoundaryStore();
    const { setEl } = effects;

    return (
        <div ref={setEl} className="contents">
            {children}
        </div>
    );
};
