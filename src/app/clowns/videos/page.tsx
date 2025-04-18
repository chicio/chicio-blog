'use client';

import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useShuffleArray } from '@/components/design-system/hooks/use-shuffle-array';
import { MediaGrid } from '@/components/design-system/molecules/media-grid';
import { Heading1 } from '@/components/design-system/atoms/heading1';
import { ClownTitle } from '@/components/design-system/molecules/clown';

export const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* Aspect ratio 16:9 */
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

const CenteredHeading = styled(Heading1)`
  text-align: center;
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
    'https://www.youtube.com/embed/zogb9j4xr5M',
    'https://www.youtube.com/embed/l0XKdAl3uV4',
    'https://www.youtube.com/embed/8L2jFgx3Kb8',
  ], 4);

  return (
    <>
      <ClownTitle />
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
    </>
  );
};

export default ClonwsPage;