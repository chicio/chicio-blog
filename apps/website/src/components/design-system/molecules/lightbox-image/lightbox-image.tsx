"use client";

import { ComponentPropsWithoutRef, FC } from "react";
import { useLightboxImageStore } from "./use-lightbox-image-store";

type LightboxImageProps = ComponentPropsWithoutRef<"img">;

export const LightboxImage: FC<LightboxImageProps> = ({ alt, ...props }) => {
    const { effects } = useLightboxImageStore(typeof props.src === "string" ? props.src : "", alt ?? "");
    const { handleOpen } = effects;

    return (
        <button
            type="button"
            onClick={handleOpen}
            className="block w-full cursor-zoom-in border-0 bg-transparent p-0"
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img loading="lazy" decoding="async" alt={alt ?? ""} {...props} />
        </button>
    );
};
