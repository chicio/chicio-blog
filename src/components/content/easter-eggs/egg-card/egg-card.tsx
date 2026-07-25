"use client";

import { FC, PropsWithChildren } from "react";
import { TerminalLine } from "@/components/design-system/atoms/typography/terminal-blocks";
import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";

export type EggCardProps = PropsWithChildren<{
    title: string;
}>;

/**
 * The cryptic hint arrives as an MDX paragraph rather than as a prop, so its styling is applied to
 * the child `p` from here instead of from a global content stylesheet.
 */
const hintParagraphClass = "[&>p]:my-4 [&>p]:font-mono [&>p]:italic [&>p]:text-primary-text [&>p]:text-shadow-md";

export const EggCard: FC<EggCardProps> = ({ title, children }) => {
    const { glassmorphismClass } = useGlassmorphism();

    return (
        <div className={`${glassmorphismClass} my-4 p-4 sm:p-6`}>
            <TerminalLine>
                {">"} {title}
            </TerminalLine>
            <div className={hintParagraphClass}>{children}</div>
        </div>
    );
};
