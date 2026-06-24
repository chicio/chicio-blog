"use client";

import { useState } from "react";
import { ComponentStore } from "@/types/component-store";

interface GenericHeaderState {
    isSubtitleExpanded: boolean;
}

interface GenericHeaderEffects {
    toggleSubtitle: () => void;
}

export const useGenericHeaderStore = (): ComponentStore<GenericHeaderState, GenericHeaderEffects> => {
    const [isSubtitleExpanded, setIsSubtitleExpanded] = useState(false);

    const toggleSubtitle = () => setIsSubtitleExpanded((prev) => !prev);

    return {
        state: { isSubtitleExpanded },
        effects: { toggleSubtitle },
    };
};
