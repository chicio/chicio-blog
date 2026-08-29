"use client";

import { FC } from "react";
import { BiX } from "react-icons/bi";
import { Variants } from "framer-motion";
import { Button } from "@/components/design-system/atoms/buttons/button";
import { Overlay } from "@/components/design-system/atoms/effects/overlay";
import { MotionDiv } from "@/components/design-system/atoms/animation/motion-div";
import { useLightboxStore } from "./use-lightbox-store";

const lightboxVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

export const Lightbox: FC = () => {
    const { state, effects } = useLightboxStore();
    const { open, src, alt } = state;
    const { setDialogEl, close, stopPropagation } = effects;

    if (!open) {
        return null;
    }

    return (
        <Overlay onClick={close} delay={0} className="z-[60]!">
            <Button onClick={close} className="fixed top-4 right-4 z-50 p-2!" aria-label="Close lightbox">
                <BiX className="size-8 md:size-10" />
            </Button>
            <div
                ref={setDialogEl}
                role="dialog"
                aria-modal="true"
                aria-label={alt || "Enlarged image"}
                tabIndex={-1}
                onClick={stopPropagation}
                className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 p-4"
            >
                <MotionDiv
                    variants={lightboxVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex h-full w-full items-center justify-center"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={alt} className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain" />
                </MotionDiv>
            </div>
        </Overlay>
    );
};
