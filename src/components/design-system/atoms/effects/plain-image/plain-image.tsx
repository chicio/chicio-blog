import type { CSSProperties, FC, ImgHTMLAttributes, ReactEventHandler } from "react";

export type ImagePlaceholder = "blur" | "empty" | `data:image/${string}`;

/**
 * A plain URL, or the object shape every bundler's static image import produces (Next, Vite and
 * webpack all emit at least `src`). Accepting both keeps the design system usable with or without a
 * build step that understands image imports.
 */
export type ImageSource = string | { src: string; width: number; height: number; blurDataURL?: string };

export interface ImageComponentProps
    extends Omit<
        ImgHTMLAttributes<HTMLImageElement>,
        "src" | "alt" | "placeholder" | "width" | "height" | "loading"
    > {
    src: ImageSource;
    alt: string;
    width?: number | `${number}`;
    height?: number | `${number}`;
    /** Absolutely fill the nearest positioned ancestor, as `next/image` does. */
    fill?: boolean;
    sizes?: string;
    priority?: boolean;
    quality?: number;
    loading?: "eager" | "lazy";
    placeholder?: ImagePlaceholder;
    blurDataURL?: string;
    className?: string;
    style?: CSSProperties;
    onClick?: ReactEventHandler<HTMLImageElement>;
}

/**
 * What the design system needs from an image renderer. Consumers inject an optimising implementation
 * (`next/image`, and so on); without one, components fall back to {@link PlainImage}.
 */
export type ImageComponent = FC<ImageComponentProps>;

const fillStyle: CSSProperties = {
    position: "absolute",
    height: "100%",
    width: "100%",
    inset: 0,
    objectFit: "cover",
};

/**
 * The framework-free default: a real `<img>`. Two behaviours are reproduced rather than dropped,
 * because design-system layouts depend on them — `fill`, which components rely on for positioning,
 * and `placeholder` + `blurDataURL`, rendered as a background so a shimmer still shows while the
 * image loads. Optimisation-only props are destructured away instead of being spread onto the DOM,
 * which would make React warn about unknown attributes.
 */
export const PlainImage: ImageComponent = ({
    src,
    alt,
    fill,
    placeholder,
    blurDataURL,
    style,
    priority: _priority,
    quality: _quality,
    ...rest
}) => {
    const resolvedSrc = typeof src === "string" ? src : src.src;
    const blurred =
        placeholder && placeholder !== "empty" && blurDataURL
            ? { backgroundImage: `url(${blurDataURL})`, backgroundSize: "cover", backgroundPosition: "center" }
            : undefined;

    return (
        <img
            src={resolvedSrc}
            alt={alt}
            style={{ ...(fill ? fillStyle : undefined), ...blurred, ...style }}
            {...rest}
        />
    );
};
