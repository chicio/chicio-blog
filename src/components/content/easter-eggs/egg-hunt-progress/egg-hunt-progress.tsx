"use client";

import { FC } from "react";
import { TerminalLine } from "@/components/design-system/atoms/typography/terminal-blocks";
import { BluePillButton, RedPillButton } from "@/components/design-system/molecules/buttons/pills-buttons";
import { TerminalProgressBar } from "@/components/design-system/molecules/terminal-progress-bar";
import { useEggHuntProgressStore } from "./use-egg-hunt-progress-store";

/**
 * The two hunt-wide actions are pills rather than terminal buttons, both to separate them from the
 * per-egg `reveal` / `replay` controls and because the metaphor is exact: the red pill shows you the
 * truth, the blue pill puts you back to sleep with no memory of it. The cookie banner already uses
 * the same pairing.
 */
export const EggHuntProgress: FC = () => {
    const { state, effects } = useEggHuntProgressStore();
    const { foundCount, totalCount, percentage, shouldReduceMotion } = state;
    const { resetHunt, revealAll } = effects;

    return (
        <div className="glassmorphism-lite-no-scale my-4 flex flex-col items-center gap-4 p-4 sm:p-6">
            <TerminalLine size="md">
                {">"} {foundCount} / {totalCount} easter eggs found
            </TerminalLine>
            <TerminalProgressBar
                percentage={percentage}
                loadingMessage="scanning the matrix for hidden payloads"
                completeMessage="all easter eggs found, welcome to the real world"
                shouldReduceMotion={shouldReduceMotion}
            />
            <div className="flex flex-wrap items-center justify-center gap-4">
                <RedPillButton onClick={revealAll} className="uppercase">
                    reveal all solutions
                </RedPillButton>
                <BluePillButton onClick={resetHunt} className="uppercase">
                    reset hunt
                </BluePillButton>
            </div>
        </div>
    );
};
