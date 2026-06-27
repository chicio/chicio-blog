"use client";

import { useSyncExternalStore } from "react";
import { shuffleArray } from "@/lib/shuffle-array/shuffle-array";
import { StateStore } from "@/types/component-store";

const videos = [
    "https://www.youtube.com/embed/zogb9j4xr5M",
    "https://www.youtube.com/embed/cvUjYs8hUFY",
    "https://www.youtube.com/embed/k8uE-M4o3vw",
    "https://www.youtube.com/embed/64nyoeyAx9w",
    "https://www.youtube.com/embed/NGZ8fBXMM7s",
    "https://www.youtube.com/embed/e8ZXGVui6n8",
    "https://www.youtube.com/embed/l0XKdAl3uV4",
    "https://www.youtube.com/embed/8L2jFgx3Kb8",
];

const DISPLAYED_VIDEOS = 4;

let shuffledVideos: string[] | null = null;

const subscribe = () => () => {};
const getServerSnapshot = () => videos.slice(0, DISPLAYED_VIDEOS);
const getSnapshot = () => {
    if (!shuffledVideos) {
        shuffledVideos = shuffleArray(videos, DISPLAYED_VIDEOS);
    }
    return shuffledVideos;
};

interface ClownsVideosState {
    videos: string[];
}

export const useClownsVideosStore = (): StateStore<ClownsVideosState> => {
    const displayedVideos = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    return {
        state: { videos: displayedVideos },
    };
};
