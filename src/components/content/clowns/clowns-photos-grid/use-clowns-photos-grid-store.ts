"use client";

import { useShuffleArray } from "@/lib/shuffle-array/use-shuffle-array";
import { StateStore } from "@/types/component-store";

const photos = [
    "/media/clowns/clown-1.jpg",
    "/media/clowns/clown-2.jpg",
    "/media/clowns/clown-3.jpg",
    "/media/clowns/clown-4.jpg",
    "/media/clowns/clown-5.jpg",
    "/media/clowns/clown-6.jpg",
    "/media/clowns/clown-7.jpg",
    "/media/clowns/clown-8.jpg",
    "/media/clowns/clown-9.jpg",
];

interface ClownsPhotosGridState {
    photos: string[];
}

export const useClownsPhotosGridStore = (): StateStore<ClownsPhotosGridState> => {
    const shuffledPhotos = useShuffleArray(photos, 4);

    return {
        state: { photos: shuffledPhotos },
    };
};
