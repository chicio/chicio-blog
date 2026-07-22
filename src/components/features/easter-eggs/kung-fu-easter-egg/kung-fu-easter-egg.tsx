"use client";

import { FC } from "react";
import { Overlay } from "@/components/design-system/atoms/effects/overlay";
import { MatrixTerminal } from "@/components/design-system/molecules/effects/matrix-terminal";
import { CenterContainer } from "@/components/features/easter-eggs/center-container";
import { kungFuTerminalLines } from "@/lib/content/easter-eggs/easter-eggs-content";
import { useKungFuEasterEggStore } from "./use-kung-fu-easter-egg-store";

export const KungFuEasterEgg: FC = () => {
    const { state, effects } = useKungFuEasterEggStore();

    if (!state.active) {
        return null;
    }

    return (
        <Overlay delay={0} onClick={effects.dismiss}>
            <CenterContainer>
                <MatrixTerminal lines={kungFuTerminalLines} />
            </CenterContainer>
        </Overlay>
    );
};
