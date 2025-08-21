'use client'

import { FC, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import {artDescriptions} from "@/types/art";
import { ContainerFluid } from "@/components/design-system/atoms/container-fluid";
import { borderRadius } from "@/components/design-system/atoms/border-radius";
import { mediaQuery } from "@/components/design-system/utils/media-query";
import { Paragraph } from "@/components/design-system/atoms/paragraph";
import { ModalWithImage } from "./modal-with-image";

const GalleryContainer = styled(ContainerFluid)`
  padding: 0;
  margin: 0 0 ${(props) => props.theme.spacing[7]};
  display: grid;
  align-items: center;
  justify-items: center;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
`;

const GalleryImageFrame = styled.figure`
  padding: ${(props) => props.theme.spacing[1]};
  margin: 0;
  background-color: ${(props) => props.theme.light.generalBackgroundLight};
  box-shadow: 0 3px 10px 0 ${(props) => props.theme.light.boxShadowLight};
  ${borderRadius};

  ${mediaQuery.minWidth.md} {
    ${mediaQuery.inputDevice.mouse} {
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.025);
      }
    }
  }

  ${mediaQuery.dark} {
    background: ${(props) => props.theme.dark.generalBackgroundLight};
    box-shadow: 0 3px 10px 0 ${(props) => props.theme.dark.boxShadowLight};
  }
`;

const GalleryImageDescription = styled(Paragraph)`
  width: 280px;
  height: 55px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0;
  margin-right: 0;
`;

const GalleryImage = styled(Image)`
  object-fit: cover;

  ${mediaQuery.minWidth.md} {
    ${mediaQuery.inputDevice.mouse} {
      transition: opacity 0.25s ease-in-out;

      &:hover {
        opacity: 0.7;
      }
    }
  }
`;

const GalleryImageContainer = styled.div`
    overflow: hidden;
    ${borderRadius};
`;

export const ArtGallery: FC = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(
    null,
  );

  return (
    <>
      <GalleryContainer>
        {artDescriptions.map((art) => {
          const imageUrl = `/images/art/${art.name}`

          return (
            <GalleryImageFrame key={art.name} onClick={() => setCurrentImage(imageUrl)}>
              <GalleryImageContainer>
                <GalleryImage alt={art.name} src={imageUrl} width={280} height={280} />
              </GalleryImageContainer>
              <GalleryImageDescription>
                {art.description}
              </GalleryImageDescription>
            </GalleryImageFrame>
          );
        })}
      </GalleryContainer>
      {currentImage && (
        <ModalWithImage
          imageUrl={currentImage}
          imageAlt={"Modal Image"}
          onClick={() => setCurrentImage(null)}
        />
      )}
    </>
  );
};
