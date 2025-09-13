import Image, { ImageProps } from "next/image";
import { FC } from "react";
import { imageShimmerPlaceholder } from "./image-shimmer-placeholder";

interface ImageGlowProps extends ImageProps {
  className?: string;
}

export const ImageGlow: FC<ImageGlowProps> = ({
  src,
  alt,
  fill,
  width,
  height,
  placeholder,
  className,
  blurDataURL,
}) => (
  <Image
    src={src}
    alt={alt}
    fill={fill}
    width={width}
    height={height}
    placeholder={placeholder ? placeholder : imageShimmerPlaceholder}
    blurDataURL={blurDataURL}
    className={`${className ? `glow-container ${className}` : ""}`}
  />
);
