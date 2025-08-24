"use client";

import styled from "styled-components";
import { MediaGrid } from "@/components/design-system/molecules/containers/media-grid";
import { MatrixHeaderBackground } from "@/components/design-system/molecules/effects/matrix-header-background";
import { GenericHeader } from "@/components/design-system/organism/header/generic-header";
import { PageTemplate } from "@/components/design-system/templates/page-template";
import { useShuffleArray } from "@/components/design-system/utils/hooks/use-shuffle-array";
import { siteMetadata } from "@/types/site-metadata";
import { tracking } from "@/types/tracking";

import { ClownSvgIcon } from "@/components/sections/clowns/components/clown-svg-icon";
import { glowContainer } from "@/components/design-system/atoms/effects/glow";

const VideoWrapper = styled.div`
  ${glowContainer};
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

const ClownsPage = () => {
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
    4
  );

  return (
    <PageTemplate
      header={
        <>
          <MatrixHeaderBackground big={false} />
          <GenericHeader
            title="Clownified!!!"
            subtitle="Bravo! Keep up the effort and you’ll clown-it!"
            logo={<ClownSvgIcon />}
          />
        </>
      }
      author={siteMetadata.author}
      trackingCategory={tracking.category.clowns}
    >
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
    </PageTemplate>
  );
};

export default ClownsPage;
