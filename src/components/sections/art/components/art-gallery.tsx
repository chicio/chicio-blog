"use client";

import { ContainerFluid } from "@/components/design-system/atoms/containers/container-fluid";
import { borderRadius } from "@/components/design-system/atoms/effects/border";
import { glassmorphism } from "@/components/design-system/atoms/effects/glassmorphism";
import { artDescriptions } from "@/types/art";
import { motion } from "framer-motion";
import Image from "next/image";
import { FC, useState } from "react";
import styled from "styled-components";
import { ModalWithImage } from "./modal-with-image";

const GalleryContainer = styled(ContainerFluid)`
  padding: 0;
  margin: ${(props) => props.theme.spacing[7]} 0
    ${(props) => props.theme.spacing[7]};
  display: grid;
  align-items: center;
  justify-items: center;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
`;

const GalleryImageFrame = styled.figure`
  padding: 0;
  margin: 0;
  background: none;
  box-shadow: none;
  ${borderRadius};
`;

const GalleryImageContainer = styled.div`
  overflow: hidden;
  ${borderRadius};
  margin-bottom: 4px;
`;

const GalleryItemContainer = styled.div`
  ${glassmorphism};
  padding: 8px;
`;

const GalleryImage = styled(Image)`
  object-fit: cover;
  width: 100%;
`;

export const ArtGallery: FC = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <>
      <GalleryContainer>
        {artDescriptions.map((art, i) => {
          const imageUrl = `/images/art/${art.name}`;
          return (
            <motion.div
              key={art.name}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ duration: 0.4, delay: i * 0.08 }}
              style={{ width: "100%" }}
            >
              <GalleryItemContainer>
                <GalleryImageFrame onClick={() => setCurrentImage(imageUrl)}>
                  <GalleryImageContainer>
                    <GalleryImage
                      alt={art.name}
                      src={imageUrl}
                      width={280}
                      height={280}
                    />
                  </GalleryImageContainer>
                  <p className="text-shadow-md m-0 flex h-[44px] w-full items-center justify-center overflow-hidden text-center text-sm break-words text-ellipsis whitespace-normal md:text-base">
                    {art.description}
                  </p>
                </GalleryImageFrame>
              </GalleryItemContainer>
            </motion.div>
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