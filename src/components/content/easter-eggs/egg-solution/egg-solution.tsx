"use client";

import { FC, PropsWithChildren } from "react";
import { TerminalButton } from "@/components/design-system/molecules/buttons/terminal-button";
import { useEggSolutionStore } from "./use-egg-solution-store";

export type EggSolutionProps = PropsWithChildren<{
    eggId: string;
}>;

/**
 * The steps arrive as an MDX list rather than as a prop, so the terminal styling `TerminalLine` would
 * otherwise apply is expressed here, on the child list, instead of in a global content stylesheet.
 *
 * Deliberately does NOT set `list-disc`: `globals.css` already gives every `ul` `list-none` plus a
 * `▸` marker via `ul li::before`, so re-enabling the native bullet renders both at once.
 */
const stepListClass = [
    "[&_li]:mb-2 [&_li]:font-mono [&_li]:font-bold [&_li]:leading-tight",
    "[&_li]:text-accent [&_li]:text-shadow-md [&_li]:break-words [&_li]:text-xs sm:[&_li]:text-sm",
].join(" ");

export const EggSolution: FC<EggSolutionProps> = ({ eggId, children }) => {
    const { state, effects } = useEggSolutionStore(eggId);
    const { revealed } = state;
    const { toggleReveal } = effects;

    return (
        <>
            <TerminalButton
                onClick={toggleReveal}
                ariaExpanded={revealed}
                label={revealed ? "hide" : "reveal"}
                className="mt-3"
            />
            {revealed && <div className={`mt-3 ${stepListClass}`}>{children}</div>}
        </>
    );
};
