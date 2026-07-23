"use client";

import { FC, ReactNode } from "react";
import { ArtGalleryContext } from "../art-gallery-context";
import { ModalWithImage } from "../modal-with-image";
import { useArtGalleryProviderStore } from "./use-art-gallery-provider-store";

interface ArtGalleryProviderProps {
    children: ReactNode;
}

export const ArtGalleryProvider: FC<ArtGalleryProviderProps> = ({ children }) => {
    const { state, effects } = useArtGalleryProviderStore();
    const { currentImage } = state;
    const { selectImage, clearImage } = effects;

    return (
        <ArtGalleryContext.Provider value={{ selectImage }}>
            <div className="container-fluid mx-0 my-8 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-stretch justify-center gap-x-5 gap-y-5 p-0">
                {children}
            </div>
            {currentImage && <ModalWithImage imageUrl={currentImage} imageAlt="Modal Image" onClick={clearImage} />}
        </ArtGalleryContext.Provider>
    );
};
