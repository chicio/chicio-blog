"use client";

import { useState } from "react";
import { ComponentStore } from "@/types/component-store";

interface ArtGalleryState {
    currentImage: string | null;
}

interface ArtGalleryEffects {
    selectImage: (imageUrl: string) => () => void;
    clearImage: () => void;
}

export const useArtGalleryStore = (): ComponentStore<ArtGalleryState, ArtGalleryEffects> => {
    const [currentImage, setCurrentImage] = useState<string | null>(null);

    const selectImage = (imageUrl: string) => () => {
        setCurrentImage(imageUrl);
    };

    const clearImage = () => {
        setCurrentImage(null);
    };

    return {
        state: { currentImage },
        effects: { selectImage, clearImage },
    };
};
