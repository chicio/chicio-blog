import Image, { ImageProps } from "next/image";
import { FC } from "react";
import { imageShimmerPlaceholder } from "./image-shimmer-placeholder";

interface ImageGlowProps extends ImageProps {
  className?: string;
}

export const ImageGlow: FC<ImageGlowProps> = ({
  src,
  alt,
  width,
  height,
  placeholder,
  className,
  blurDataURL,
}) => (
  <Image
    src={src}
    alt={alt}
    width={width}
    height={height}
    placeholder={placeholder ? placeholder : imageShimmerPlaceholder}
    blurDataURL={blurDataURL}
    className={`${className ? `glow-container ${className}` : ""}`}
  />
);
