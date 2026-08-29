"use client";

import type { CSSProperties, FC, ImgHTMLAttributes, ReactEventHandler } from "react";
import { usePlainImageStore } from "./use-plain-image-store";

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

/**
 * `next/image`'s `fill` positions the image to cover its ancestor but sets no `object-fit`, leaving
 * that to the caller's class. Setting one here as an inline style would silently beat that class.
 */
const fillStyle: CSSProperties = {
    position: "absolute",
    height: "100%",
    width: "100%",
    inset: 0,
};

/**
 * Resolves what to paint behind a loading image. `next/image` treats a `data:` placeholder as the
 * image to show directly, and `"blur"` as an instruction to use `blurDataURL`.
 */
const placeholderSource = (placeholder?: ImagePlaceholder, blurDataURL?: string): string | undefined => {
    if (!placeholder || placeholder === "empty") {
        return undefined;
    }

    return placeholder === "blur" ? blurDataURL : placeholder;
};

/**
 * The framework-free default: a real `<img>`. It reproduces the `next/image` behaviours design-system
 * layouts depend on — `fill` positioning, a placeholder painted behind the image until it loads, and
 * lazy loading unless the caller marks the image as priority. Optimisation-only props are
 * destructured away instead of spread onto the DOM, where React would warn about them.
 */
export const PlainImage: ImageComponent = ({
    src,
    alt,
    fill,
    placeholder,
    blurDataURL,
    style,
    loading,
    priority,
    onLoad,
    quality: _quality,
    ...rest
}) => {
    const { state, effects } = usePlainImageStore(onLoad);
    const { loaded } = state;
    const { setImage, handleLoad } = effects;

    const resolvedSrc = typeof src === "string" ? src : src.src;
    const background = loaded ? undefined : placeholderSource(placeholder, blurDataURL);

    return (
        <img
            ref={setImage}
            src={resolvedSrc}
            alt={alt}
            loading={loading ?? (priority ? "eager" : "lazy")}
            fetchPriority={priority ? "high" : undefined}
            onLoad={handleLoad}
            style={{
                ...(fill ? fillStyle : undefined),
                ...(background
                    ? { backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center" }
                    : undefined),
                ...style,
            }}
            {...rest}
        />
    );
};
