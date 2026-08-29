import NextImage from "next/image";
import { FC } from "react";
import { ImageGlow as DesignSystemImageGlow, type ImageGlowProps } from "@/components/design-system/atoms/effects/image-glow";

export type { ImageGlowProps };

/**
 * ImageGlow bound to next/image. The design system renders a plain <img> by default; this website
 * wants Next's optimisation pipeline, so every site-side usage goes through here rather than
 * importing the design-system component directly.
 */
export const ImageGlow: FC<Omit<ImageGlowProps, "imageComponent">> = (props) => (
    <DesignSystemImageGlow {...props} imageComponent={NextImage} />
);
