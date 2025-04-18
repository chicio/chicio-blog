'use client';

import React, { useEffect, useState } from 'react';
import { MediaGrid } from '@/components/design-system/molecules/media-grid';
import { useShuffleArray } from '@/components/design-system/hooks/use-shuffle-array';
import styled from 'styled-components';

export const VideoWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const ClonwsPage = () => {
  const videos = useShuffleArray([
    'https://www.youtube.com/embed/zogb9j4xr5M',
    'https://www.youtube.com/embed/2XN5mhdWoM0',
    'https://www.youtube.com/embed/cvUjYs8hUFY',
    'https://www.youtube.com/embed/k8uE-M4o3vw',
    'https://www.youtube.com/embed/64nyoeyAx9w',
    'https://www.youtube.com/embed/NGZ8fBXMM7s',
    'https://www.youtube.com/embed/e8ZXGVui6n8',
  ], 4);

  return (
    <MediaGrid>
      {videos.map((video, index) => (
        <VideoWrapper key={index}>
          <iframe
            src={`${video}?autoplay=1&mute=1`}
            title={`Clown Video ${index + 1}`}
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </VideoWrapper>
      ))}
    </MediaGrid>
  );
};

export default ClonwsPage;