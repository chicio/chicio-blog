import { Children, FC, PropsWithChildren, isValidElement } from "react";
import { ArtGalleryImage } from "../art-gallery-image";

/**
 * `@microflash/rehype-figure` (the site's MDX pipeline, see next.config.ts) wraps every
 * standalone `![alt](src)` image in a `<figure><img/><figcaption>{alt}</figcaption></figure>`
 * at build time — it never leaves a bare `<img>` inside a `<p>`. This override unwraps that
 * figure down to just the (already gallery-card-ified) image, dropping the redundant
 * figcaption since the card renders its own caption from `alt`, so the CSS grid the provider
 * applies to its children sees a flat run of gallery cards instead of one-per-figure wrappers.
 */
export const ArtGalleryFigure: FC<PropsWithChildren> = ({ children }) => {
    const imageChild = Children.toArray(children).find(
        (child) => isValidElement(child) && child.type === ArtGalleryImage,
    );

    return imageChild ? <>{imageChild}</> : <figure>{children}</figure>;
};
