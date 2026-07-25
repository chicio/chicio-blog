"use client";

import { FC, PropsWithChildren } from "react";
import { TerminalButton } from "@/components/design-system/molecules/buttons/terminal-button";
import { useEggSolutionStore } from "./use-egg-solution-store";

export type EggSolutionProps = PropsWithChildren<{
    eggId: string;
}>;

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
            {revealed && <div className="egg-solution mt-3">{children}</div>}
        </>
    );
};
