import Image, { ImageProps } from "next/image";
import { FC } from "react";

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
}) => (
  <Image
    src={src}
    alt={alt}
    width={width}
    height={height}
    placeholder={placeholder}
    className={`${className ? `glow-container ${className}` : ""}`}
  />
);
