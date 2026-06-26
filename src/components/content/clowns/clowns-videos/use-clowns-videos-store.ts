"use client";

import { useShuffleArray } from "@/components/design-system/hooks/use-shuffle-array";
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

interface ClownsVideosState {
    videos: string[];
}

export const useClownsVideosStore = (): StateStore<ClownsVideosState> => {
    const shuffledVideos = useShuffleArray(videos, 4);

    return {
        state: { videos: shuffledVideos },
    };
};
