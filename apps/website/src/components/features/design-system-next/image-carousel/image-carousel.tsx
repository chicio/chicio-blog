"use client";

import NextImage from "next/image";
import { FC } from "react";
import { ImageCarousel as DesignSystemImageCarousel, type ImageCarouselProps } from "matrix-design-system";
export type { ImageCarouselProps };

/** ImageCarousel bound to next/image. See design-system-next/image-glow for why this layer exists. */
export const ImageCarousel: FC<Omit<ImageCarouselProps, "imageComponent">> = (props) => (
    <DesignSystemImageCarousel {...props} imageComponent={NextImage} />
);
