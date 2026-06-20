"use client";

import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import { MotionDiv } from "@/components/design-system/molecules/animation/motion-div";
import { artDescriptions } from "@/content/art/art";
import Image from "next/image";
import { FC } from "react";
import { ModalWithImage } from "./modal-with-image";
import { useArtGalleryStore } from "./use-art-gallery-store";

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
};

export const ArtGallery: FC = () => {
    const { state, effects } = useArtGalleryStore();
    const { glassmorphismClass } = useGlassmorphism();
    const { selectImage, clearImage } = effects;

    return (
        <>
            <div className="container-fluid mx-0 my-8 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-stretch justify-center gap-x-5 gap-y-5 p-0">
                {artDescriptions.map((art, i) => {
                    const imageUrl = `/media/content/art/${art.name}`;
                    return (
                        <MotionDiv
                            key={art.name}
                            variants={cardVariants}
                            className="flex-1 h-full"
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            style={{ width: "100%" }}
                        >
                            <div
                                className={`${glassmorphismClass} flex h-full flex-col p-2`}
                                onClick={selectImage(imageUrl)}
                            >
                                <div className="h-full flex-1 overflow-hidden rounded-xl">
                                    <Image
                                        alt={art.name}
                                        src={imageUrl}
                                        width={250}
                                        height={250}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <p className="m-0 flex h-[44px] w-full items-center justify-center overflow-hidden text-center text-sm break-words text-ellipsis whitespace-normal md:text-base my-4">
                                    {art.description}
                                </p>
                            </div>
                        </MotionDiv>
                    );
                })}
            </div>
            {state.currentImage && (
                <ModalWithImage
                    imageUrl={state.currentImage}
                    imageAlt={"Modal Image"}
                    onClick={clearImage}
                />
            )}
        </>
    );
};
