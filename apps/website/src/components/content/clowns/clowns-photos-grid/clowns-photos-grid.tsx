"use client";

import { ImageGlow } from "@/components/features/design-system-next/image-glow";
import { useClownsPhotosGridStore } from "./use-clowns-photos-grid-store";

export const ClownsPhotosGrid = () => {
    const { state } = useClownsPhotosGridStore();
    const { photos } = state;

    return (
        <>
            {photos.map((photo, index) => (
                <div className="flex items-center justify-center" key={index}>
                    <ImageGlow
                        fill={true}
                        className="relative! h-full! w-full! object-cover"
                        src={photo}
                        alt={`Clown Photo ${index + 1}`}
                    />
                </div>
            ))}
        </>
    );
};
