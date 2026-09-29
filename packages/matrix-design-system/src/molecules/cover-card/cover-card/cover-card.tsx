"use client";

import { FC, ReactNode } from "react";
import { GlassmorphismBackground } from "../../../atoms/effects/glassmorphism-background";
import { PlainImage, type ImageComponent } from "../../../atoms/effects/plain-image";
import { InternalLink } from "../../../atoms/links/internal-link";
import type { LinkComponent } from "../../../atoms/links/anchor-link";
import { useCoverCardStore } from "./use-cover-card-store";

export type CoverCardAction = { kind: "link"; href: string; onClick?: () => void } | { kind: "lightbox" };

export interface CoverCardProps {
    /** The cover image URL. */
    src: string;
    /** Names the cover: used as the image alt, the caption and the lightbox alt. */
    title: string;
    /** Where a click goes: to a page, or into the lightbox. */
    action: CoverCardAction;
    /** Rendered top-right over the cover, e.g. a few `CoverCardBadge`s. */
    badges?: ReactNode;
    imageComponent?: ImageComponent;
    linkComponent?: LinkComponent;
}

const coverSizes = "(max-width: 768px) 100vw, 50vw";

/**
 * A collection card: the cover over its own blurred copy, a glass caption and an optional badge slot.
 * The cover mounts only once the card is within 600px of the viewport, so a long grid stays cheap.
 */
export const CoverCard: FC<CoverCardProps> = ({
    src,
    title,
    action,
    badges,
    imageComponent: Image = PlainImage,
    linkComponent,
}) => {
    const { state, effects } = useCoverCardStore(src, title);
    const { isInView } = state;
    const { setEl, handleOpenLightbox } = effects;

    const cover = (
        <>
            <Image
                src={src}
                alt=""
                aria-hidden="true"
                fill
                sizes={coverSizes}
                className="h-full w-full object-cover blur-lg"
                priority={true}
            />
            <Image
                src={src}
                alt={title}
                fill
                sizes={coverSizes}
                className="h-full w-full object-contain"
                priority={true}
            />
            <div className="absolute bottom-0 left-0 flex w-full items-center justify-center p-2">
                <GlassmorphismBackground className="bg-black-alpha-75 w-full p-1!">
                    <p className="my-1 px-2 text-center text-white">{title}</p>
                </GlassmorphismBackground>
            </div>
            {badges && (
                <div className="pointer-events-none absolute top-1 right-1 z-20 flex flex-row items-center gap-1">
                    {badges}
                </div>
            )}
        </>
    );

    return (
        <div ref={setEl} className="glow-container relative h-80 w-full overflow-hidden rounded-lg shadow-lg">
            {isInView &&
                (action.kind === "link" ? (
                    <InternalLink
                        to={action.href}
                        onClick={action.onClick}
                        linkComponent={linkComponent}
                        className="block h-full w-full"
                    >
                        {cover}
                    </InternalLink>
                ) : (
                    <>
                        {cover}
                        <button
                            type="button"
                            aria-label={`Open ${title}`}
                            onClick={handleOpenLightbox}
                            className="absolute inset-0 z-10 cursor-zoom-in border-0 bg-transparent p-0"
                        />
                    </>
                ))}
        </div>
    );
};
