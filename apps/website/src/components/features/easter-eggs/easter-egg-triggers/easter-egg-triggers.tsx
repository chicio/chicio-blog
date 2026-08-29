"use client";

import { FC } from "react";
import { useEasterEggTriggersStore } from "./use-easter-egg-triggers-store";

/**
 * Renders nothing. The two triggers it owns are global listeners with no UI of their own: the konami
 * key sequence, and the drain for a spoon activation that fired before this mounted.
 *
 * The touch trigger for the kung fu egg used to live here as an invisible 44px box pinned to the
 * bottom right corner of every page. It has moved onto the genre pill of any fighting game, which is
 * a real target you can find rather than a hidden corner nobody would think to press.
 */
export const EasterEggTriggers: FC = () => {
    useEasterEggTriggersStore();

    return null;
};
