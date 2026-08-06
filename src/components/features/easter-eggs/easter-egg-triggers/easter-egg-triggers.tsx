"use client";

import { FC } from "react";
import { useEasterEggTriggersStore } from "./use-easter-egg-triggers-store";

export const EasterEggTriggers: FC = () => {
    const { effects } = useEasterEggTriggersStore();
    const { registerTap } = effects;

    return (
        <div
            aria-hidden="true"
            data-testid="kung-fu-tap-hotspot"
            onClick={registerTap}
            className="pointer-events-auto fixed bottom-0 right-0 z-30 h-11 w-11"
        />
    );
};
