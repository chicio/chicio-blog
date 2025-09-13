"use client";

import { useShuffleArray } from "@/components/design-system/utils/hooks/use-shuffle-array";

export const ClownsVideos = () => {
  const videos = useShuffleArray(
    [
      "https://www.youtube.com/embed/zogb9j4xr5M",
      "https://www.youtube.com/embed/cvUjYs8hUFY",
      "https://www.youtube.com/embed/k8uE-M4o3vw",
      "https://www.youtube.com/embed/64nyoeyAx9w",
      "https://www.youtube.com/embed/NGZ8fBXMM7s",
      "https://www.youtube.com/embed/e8ZXGVui6n8",
      "https://www.youtube.com/embed/l0XKdAl3uV4",
      "https://www.youtube.com/embed/8L2jFgx3Kb8",
    ],
    4,
  );

  return videos.map((video, index) => (
    <div className="relative glow-container w-full pt-[56.25%] overflow-hidden" key={index}>
      <iframe
      className="absolute top-0 left-0 w-full h-full border-0"
        src={`${video}?autoplay=1&mute=1`}
        title={`Clown Video ${index + 1}`}
        allow="autoplay; encrypted-media"
        allowFullScreen
      ></iframe>
    </div>
  ));
};
