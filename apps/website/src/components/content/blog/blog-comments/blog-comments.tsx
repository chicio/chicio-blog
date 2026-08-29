"use client";

import Giscus from "@giscus/react";
import { FC } from "react";
import { giscusConfig } from "@/types/configuration/giscus";
import { TerminalProgressBar } from "@/components/design-system/molecules/terminal-progress-bar";
import { useBlogCommentsStore } from "./use-blog-comments-store";

/**
 * Renders the live giscus (GitHub Discussions) comment widget below a blog post,
 * with a simulated terminal-style progress bar shown until giscus signals that
 * its iframe is alive (a `postMessage` from https://giscus.app). Giscus stays
 * mounted throughout — only the progress bar is conditionally rendered — since
 * unmounting it would stop its iframe from ever loading. Not gated behind
 * cookie consent: giscus sets no tracking cookies.
 *
 * The custom Matrix theme (public/giscus-matrix.css) is served from the absolute
 * production URL, so on localhost giscus falls back to its unstyled default theme;
 * this is expected in local development.
 */
export const BlogComments: FC = () => {
    const { state } = useBlogCommentsStore();
    const { percentage, isLoaded, shouldReduceMotion } = state;

    return (
        <div>
            {!isLoaded && (
                <TerminalProgressBar
                    percentage={percentage}
                    loadingMessage="loading comments"
                    completeMessage="comments loaded"
                    shouldReduceMotion={shouldReduceMotion}
                />
            )}
            <Giscus {...giscusConfig} />
        </div>
    );
};
