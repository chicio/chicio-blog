"use client";

import { EasterEggTerminalLines } from "@/types/search/search";
import { FC } from "react";
import { CenterContainer } from "@/components/features/easter-eggs/center-container";
import { MatrixTerminal } from "@/components/design-system/molecules/effects/matrix-terminal";
import { RedPillButton } from "@/components/design-system/molecules/buttons/pills-buttons";
import { useNeoRoomEasterEggStore } from "./use-neo-room-easter-egg-store";

const NeoRoomEasterEgg: FC<{ lines: EasterEggTerminalLines }> = ({ lines }) => {
    const { state, effects } = useNeoRoomEasterEggStore();

    return (
        <CenterContainer>
            <MatrixTerminal
                lines={lines}
                onComplete={effects.onComplete}
            />
            <div style={{ visibility: state.isCompleted ? "visible" : "hidden" }}>
                <RedPillButton onClick={effects.onKnock}>
                    Knock, knock
                </RedPillButton>
            </div>
        </CenterContainer>
    );
};

export default NeoRoomEasterEgg;