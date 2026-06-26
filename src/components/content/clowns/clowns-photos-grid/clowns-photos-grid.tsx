"use client";

import { ImageGlow } from "@/components/design-system/atoms/effects/image-glow";
import { useClownsPhotosGridStore } from "./use-clowns-photos-grid-store";

export const ClownsPhotosGrid = () => {
    const { state } = useClownsPhotosGridStore();
    const { photos } = state;

    return (
        <>
            {photos.map((photo, index) => (
                <div className="flex justify-center items-center" key={index}>
                    <ImageGlow fill={true} className="relative! w-full! h-full! object-cover" src={photo} alt={`Clown Photo ${index + 1}`} />
                </div>
            ))}
        </>
    );
};
