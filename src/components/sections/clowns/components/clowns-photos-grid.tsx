'use client';

import { ImageGlow } from "@/components/design-system/atoms/effects/image-glow";
import { useShuffleArray } from "@/components/design-system/utils/hooks/use-shuffle-array";

export const ClownsPhotosGrid = () => {
  const photos = useShuffleArray([
    '/images/clowns/clown-1.jpg',
    '/images/clowns/clown-2.jpg',
    '/images/clowns/clown-3.jpg',
    '/images/clowns/clown-4.jpg',
    '/images/clowns/clown-5.jpg',
    '/images/clowns/clown-6.jpg',
    '/images/clowns/clown-7.jpg',
    '/images/clowns/clown-8.jpg',
    '/images/clowns/clown-9.jpg',
  ], 4);

  return (
    <>
        {photos.map((photo, index) => (
          <div className="flex justify-center items-center" key={index}>
            <ImageGlow fill={true} className="relative! w-full h-full object-cover" src={photo} alt={`Clown Photo ${index + 1}`} />
          </div>
        ))}
    </>
  );
};
