"use client";

import { useSyncExternalStore } from "react";
import { shuffleArray } from "@/lib/shuffle-array/shuffle-array";
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

const DISPLAYED_PHOTOS = 4;

let shuffledPhotos: string[] | null = null;

const subscribe = () => () => {};
const getServerSnapshot = () => photos.slice(0, DISPLAYED_PHOTOS);
const getSnapshot = () => {
    if (!shuffledPhotos) {
        shuffledPhotos = shuffleArray(photos, DISPLAYED_PHOTOS);
    }
    return shuffledPhotos;
};

interface ClownsPhotosGridState {
    photos: string[];
}

export const useClownsPhotosGridStore = (): StateStore<ClownsPhotosGridState> => {
    const displayedPhotos = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    return {
        state: { photos: displayedPhotos },
    };
};
