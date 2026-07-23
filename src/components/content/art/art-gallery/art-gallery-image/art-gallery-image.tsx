"use client";

import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import { MotionDiv } from "@/components/design-system/atoms/animation/motion-div";
import Image from "next/image";
import { ComponentPropsWithoutRef, FC } from "react";
import { useArtGalleryImageStore } from "./use-art-gallery-image-store";

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
};

type ArtGalleryImageProps = ComponentPropsWithoutRef<"img">;

export const ArtGalleryImage: FC<ArtGalleryImageProps> = ({ src, alt }) => {
    const { effects } = useArtGalleryImageStore();
    const { selectImage } = effects;
    const { glassmorphismClass } = useGlassmorphism();

    const imageUrl = typeof src === "string" ? src : "";
    const imageAlt = alt ?? "";

    return (
        <MotionDiv
            variants={cardVariants}
            className="flex-1 h-full"
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ duration: 0.4 }}
            style={{ width: "100%" }}
        >
            <div className={`${glassmorphismClass} flex h-full flex-col p-2`} onClick={selectImage(imageUrl)}>
                <div className="h-full flex-1 overflow-hidden rounded-xl">
                    <Image
                        alt={imageAlt}
                        src={imageUrl}
                        width={250}
                        height={250}
                        className="h-full w-full object-cover"
                    />
                </div>
                <p className="m-0 flex h-[44px] w-full items-center justify-center overflow-hidden text-center text-sm break-words text-ellipsis whitespace-normal md:text-base my-4">
                    {imageAlt}
                </p>
            </div>
        </MotionDiv>
    );
};
