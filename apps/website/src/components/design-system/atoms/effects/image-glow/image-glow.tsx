import { FC } from "react";
import { imageShimmerPlaceholder } from "@/components/design-system/atoms/effects/image-shimmer-placeholder";
import {
    PlainImage,
    type ImageComponent,
    type ImageComponentProps,
} from "@/components/design-system/atoms/effects/plain-image";

export interface ImageGlowProps extends ImageComponentProps {
    className?: string;
    noPlaceholder?: boolean;
    imageComponent?: ImageComponent;
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
        imageComponent: Image = PlainImage,
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
