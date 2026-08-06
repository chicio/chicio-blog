"use client";

import { FC, PropsWithChildren } from "react";
import { TerminalLine } from "@/components/design-system/atoms/typography/terminal-blocks";
import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import type { EasterEggSlug } from "@/lib/easter-eggs/easter-egg-catalog";
import { useEggCardStore } from "./use-egg-card-store";

export type EggCardProps = PropsWithChildren<{
    title: string;
    slug: EasterEggSlug;
}>;

/**
 * The cryptic hint arrives as an MDX paragraph rather than as a prop, so its styling is applied to
 * the child `p` from here instead of from a global content stylesheet.
 */
const hintParagraphClass = "[&>p]:my-4 [&>p]:font-mono [&>p]:italic [&>p]:text-primary-text [&>p]:text-shadow-md";

const BADGE_CLASS = "rounded-full border border-solid px-2.5 py-[3px] text-[12px] uppercase tracking-[.12em]";

export const EggCard: FC<EggCardProps> = ({ title, slug, children }) => {
    const { glassmorphismClass } = useGlassmorphism();
    const { state } = useEggCardStore(slug);
    const { found } = state;

    const foundCardClass = found ? "border-accent bg-general-background-light" : "";
    const badgeStateClass = found
        ? "border-accent-alpha-40 text-accent"
        : "border-accent-alpha-15 text-secondary-text";

    return (
        <div className={`${glassmorphismClass} ${foundCardClass} my-4 p-4 sm:p-6`}>
            <div className="flex items-center justify-between gap-3">
                <TerminalLine size="lg">
                    {">"} {title}
                </TerminalLine>
                <span className={`${BADGE_CLASS} ${badgeStateClass}`}>{found ? "found" : "hidden"}</span>
            </div>
            <div className={hintParagraphClass}>{children}</div>
        </div>
    );
};
