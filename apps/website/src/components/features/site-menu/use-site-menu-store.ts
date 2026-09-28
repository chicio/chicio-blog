"use client";

import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import type { StateStore } from "matrix-component-store";
import type { MenuEntry } from "@/components/features/design-system-next/menu";
import { useCallback } from "react";
import { buildMenuEntries } from "@/components/features/content/nav-config";

interface SiteMenuState {
    entries: MenuEntry[];
}

export const useSiteMenuStore = (trackingCategory: string): StateStore<SiteMenuState> => {
    const onTrackNavigation = useCallback(
        (action: string) => {
            trackWith({
                category: trackingCategory,
                label: tracking.label.header,
                action,
            });
        },
        [trackingCategory],
    );

    return { state: { entries: buildMenuEntries(onTrackNavigation) } };
};
