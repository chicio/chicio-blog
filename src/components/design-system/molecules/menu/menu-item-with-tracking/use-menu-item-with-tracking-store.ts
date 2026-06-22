"use client";

import { EffectsStore } from "@/types/component-store";
import { TrackingData } from "@/types/configuration/tracking";
import { trackWith } from "@/lib/tracking/tracking";

interface MenuItemWithTrackingEffects {
    handleClick: (trackingData: TrackingData, onClickCallback?: () => void) => () => void;
}

export const useMenuItemWithTrackingStore = (): EffectsStore<MenuItemWithTrackingEffects> => {
    const handleClick = (trackingData: TrackingData, onClickCallback?: () => void) => () => {
        trackWith(trackingData);
        onClickCallback?.();
    };

    return { effects: { handleClick } };
};
