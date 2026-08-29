"use client";

import { FC, PropsWithChildren } from "react";
import { TerminalButton } from "@/components/features/design-system-next/terminal-button";
import type { EasterEggSlug } from "@/lib/easter-eggs/easter-egg-catalog";
import { useEggSolutionStore } from "./use-egg-solution-store";

export type EggSolutionProps = PropsWithChildren<{
    slug: EasterEggSlug;
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

/**
 * Owns the replay button as well as the reveal toggle so the two sit on one row. `EggCard` cannot
 * render replay itself and still have it share a line: the solution is authored inside the card's MDX
 * body, so a button placed by the card would always be a sibling of that whole body rather than of
 * this toggle. Both read the found state straight from the global store, so nothing has to be threaded
 * down through the MDX.
 */
export const EggSolution: FC<EggSolutionProps> = ({ slug, children }) => {
    const { state, effects } = useEggSolutionStore(slug);
    const { revealed, found } = state;
    const { toggleReveal, replay } = effects;

    return (
        <>
            <div className="mt-3 flex flex-wrap items-center gap-3">
                <TerminalButton
                    onClick={toggleReveal}
                    ariaExpanded={revealed}
                    label={revealed ? "Hide" : "Reveal"}
                />
                {found && <TerminalButton label="Replay" onClick={replay} />}
            </div>
            {revealed && <div className={`mt-3 ${stepListClass}`}>{children}</div>}
        </>
    );
};
