import Image, { ImageProps } from "next/image";
import { FC } from "react";
import { imageShimmerPlaceholder } from "./image-shimmer-placeholder";

interface ImageGlowProps extends ImageProps {
  className?: string;
  noPlaceholder?: boolean;
}

export const ImageGlow: FC<ImageGlowProps> = (props) => {
  const {
    src,
    alt,
    fill,
    width,
    height,
    placeholder,
    className,
    blurDataURL,
    noPlaceholder,
    ...restProps
  } = props;

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      {...(!noPlaceholder ? { placeholder: placeholder ? placeholder : imageShimmerPlaceholder } : {})}
      blurDataURL={blurDataURL}
      className={className ? `glow-container ${className}` : ""}
      {...restProps}
    />
  );
};
