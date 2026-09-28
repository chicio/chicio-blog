"use client";

import { useCallback } from "react";
import { EffectsStore } from "matrix-component-store";
import { VideogamesNavigationOrigin } from "@/types/content/videogames";
import { writeVideogamesNavigationOrigin } from "@/lib/videogames/videogames-navigation-origin";

interface GameCardEffects {
    handleClick: (navigationOrigin: VideogamesNavigationOrigin) => () => void;
}

export const useGameCardStore = (): EffectsStore<GameCardEffects> => {
    const handleClick = useCallback(
        (navigationOrigin: VideogamesNavigationOrigin) => () => {
            writeVideogamesNavigationOrigin(navigationOrigin);
        },
        [],
    );

    return {
        effects: { handleClick },
    };
};
