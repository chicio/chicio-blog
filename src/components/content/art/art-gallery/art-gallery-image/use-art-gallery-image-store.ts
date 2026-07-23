"use client";

import { useContext } from "react";
import { ArtGalleryContext } from "../art-gallery-context";
import type { EffectsStore } from "@/types/component-store";

interface ArtGalleryImageEffects {
    selectImage: (imageUrl: string) => () => void;
}

const noopSelect = () => () => {};

export const useArtGalleryImageStore = (): EffectsStore<ArtGalleryImageEffects> => {
    const context = useContext(ArtGalleryContext);

    return { effects: { selectImage: context?.selectImage ?? noopSelect } };
};
