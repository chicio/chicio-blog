"use client";

import { FC, PropsWithChildren } from "react";
import { isFightingGenre } from "@/lib/easter-eggs/fighting-genre";
import { useFightingGameTriggerStore } from "./use-fighting-game-trigger-store";

export type FightingGameTriggerProps = PropsWithChildren<{
    genre: string | undefined;
}>;

/**
 * Arms the kung fu egg on a fighting game's genre pill: five taps on it and you know kung fu.
 *
 * The pill is the target rather than the cover art because every image on a game page is already
 * spoken for — the carousel opens the lightbox and the grid covers are links — so repeated tapping on
 * one would fight a real feature. The pill has no behaviour of its own, and pressing the word
 * "Fighting" until you know it is a better joke anyway.
 *
 * Renders its children untouched on every other genre, so this is inert on the rest of the collection.
 */
export const FightingGameTrigger: FC<FightingGameTriggerProps> = ({ genre, children }) => {
    const { effects } = useFightingGameTriggerStore();
    const { registerTap } = effects;

    if (!isFightingGenre(genre)) {
        return <>{children}</>;
    }

    return (
        <div onClick={registerTap} data-testid="fighting-game-trigger">
            {children}
        </div>
    );
};
