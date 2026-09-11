"use client";

import { useClownsVideosStore } from "./use-clowns-videos-store";

export const ClownsVideos = () => {
    const { state } = useClownsVideosStore();
    const { videos } = state;

    return videos.map((video, index) => (
        <div className="glow-container relative w-full overflow-hidden pt-[56.25%]" key={index}>
            <iframe
                className="absolute top-0 left-0 h-full w-full border-0"
                src={`${video}?autoplay=1&mute=1`}
                title={`Clown Video ${index + 1}`}
                allow="autoplay; encrypted-media"
                allowFullScreen
            ></iframe>
        </div>
    ));
};
