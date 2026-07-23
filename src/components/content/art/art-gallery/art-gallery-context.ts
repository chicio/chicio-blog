import { createContext } from "react";

export interface ArtGalleryContextValue {
    selectImage: (imageUrl: string) => () => void;
}

export const ArtGalleryContext = createContext<ArtGalleryContextValue | null>(null);
