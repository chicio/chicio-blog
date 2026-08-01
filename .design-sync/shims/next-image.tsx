import type { CSSProperties, FC, ImgHTMLAttributes } from "react";

/**
 * design-sync shim for `next/image`.
 *
 * `next/image` renders an `<img>` behind an optimisation pipeline that needs the Next.js server.
 * Outside Next there is no such pipeline, so this renders the `<img>` directly — the same
 * substitution the repo's own tests make (`src/test-utils/next-module-mocks.tsx`).
 *
 * Two behaviours are reproduced rather than dropped, because design-system components depend on them:
 *   - `fill` — Next absolutely-positions the image to fill its positioned parent. `ImageGlow` and
 *     `ImageCarousel` rely on this for layout; without it their previews collapse.
 *   - `placeholder="blur"` + `blurDataURL` — rendered as a background image so the shimmer
 *     placeholder (`imageShimmerPlaceholder`) still shows behind a loading image.
 *
 * Every other Next-only prop is destructured away. Spreading them onto a DOM `<img>` makes React warn
 * about unknown attributes, and those warnings surface as `[RENDER_ERRORS]` in `package-validate.mjs`.
 */
export type PlaceholderValue = "blur" | "empty" | `data:image/${string}`;

export type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "placeholder"> & {
    src: string | { src: string };
    alt: string;
    width?: number | string;
    height?: number | string;
    fill?: boolean;
    placeholder?: PlaceholderValue;
    blurDataURL?: string;
    priority?: boolean;
    quality?: number;
    loading?: "eager" | "lazy";
    unoptimized?: boolean;
    overrideSrc?: string;
    loader?: unknown;
    onLoadingComplete?: unknown;
};

const fillStyle: CSSProperties = {
    position: "absolute",
    height: "100%",
    width: "100%",
    inset: 0,
    objectFit: "cover",
};

const Image: FC<ImageProps> = ({
    src,
    alt,
    fill,
    placeholder,
    blurDataURL,
    style,
    priority: _priority,
    quality: _quality,
    unoptimized: _unoptimized,
    overrideSrc: _overrideSrc,
    loader: _loader,
    onLoadingComplete: _onLoadingComplete,
    ...rest
}) => {
    const resolvedSrc = typeof src === "string" ? src : src?.src;
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

export default Image;
