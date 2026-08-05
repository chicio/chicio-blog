"use client";

import { FC } from "react";
import { TerminalLine } from "@/components/design-system/atoms/typography/terminal-blocks";
import { TerminalButton } from "@/components/design-system/molecules/buttons/terminal-button";
import { TerminalProgressBar } from "@/components/design-system/molecules/terminal-progress-bar";
import { useEggHuntProgressStore } from "./use-egg-hunt-progress-store";

export const EggHuntProgress: FC = () => {
    const { state, effects } = useEggHuntProgressStore();
    const { foundCount, totalCount, percentage, shouldReduceMotion } = state;
    const { resetHunt, revealAll } = effects;

    return (
        <div className="glassmorphism-lite-no-scale my-4 flex flex-col gap-4 p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <TerminalLine>
                    {">"} {foundCount} / {totalCount} easter eggs found
                </TerminalLine>
                <div className="flex flex-wrap gap-3">
                    <TerminalButton label="reveal all solutions" onClick={revealAll} />
                    <TerminalButton label="reset hunt" onClick={resetHunt} className="min-h-11" />
                </div>
            </div>
            <TerminalProgressBar
                percentage={percentage}
                loadingMessage="scanning the matrix for hidden payloads"
                completeMessage="all easter eggs found — welcome to the real world"
                shouldReduceMotion={shouldReduceMotion}
            />
        </div>
    );
};
