"use client"

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { MediaGrid } from '@/components/design-system/molecules/media-grid';

const PhotoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ClownsPhotosPage = () => {
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    // Fetch 4 random clown-related photos
    const clownPhotos = [
      '/images/clown1.jpg',
      '/images/clown2.jpg',
      '/images/clown3.jpg',
      '/images/clown4.jpg',
    ];
    setPhotos(clownPhotos.sort(() => 0.5 - Math.random()).slice(0, 4));
  }, []);

  return (
    <MediaGrid>
      {photos.map((photo, index) => (
        <PhotoWrapper key={index}>
          <img src={photo} alt={`Clown Photo ${index + 1}`} />
        </PhotoWrapper>
      ))}
    </MediaGrid>
  );
};

export default ClownsPhotosPage;