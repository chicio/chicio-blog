"use client";

import { useCallback, useState } from "react";
import type { ComponentStore } from "@/types/component-store";

interface ArtGalleryProviderState {
    currentImage: string | null;
}

interface ArtGalleryProviderEffects {
    selectImage: (imageUrl: string) => () => void;
    clearImage: () => void;
}

export const useArtGalleryProviderStore = (): ComponentStore<ArtGalleryProviderState, ArtGalleryProviderEffects> => {
    const [currentImage, setCurrentImage] = useState<string | null>(null);

    const selectImage = useCallback(
        (imageUrl: string) => () => {
            setCurrentImage(imageUrl);
        },
        [],
    );

    const clearImage = useCallback(() => {
        setCurrentImage(null);
    }, []);

    return {
        state: { currentImage },
        effects: { selectImage, clearImage },
    };
};
