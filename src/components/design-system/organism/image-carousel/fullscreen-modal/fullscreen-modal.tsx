"use client";

import { FC } from "react";
import { BiX } from "react-icons/bi";
import Image from "next/image";
import { Button } from "@/components/design-system/atoms/buttons/button";
import { MotionDiv } from "@/components/design-system/atoms/animation/motion-div";
import { NavigationButtons } from "@/components/design-system/organism/image-carousel/navigation-buttons";
import { PageIndicators } from "@/components/design-system/organism/image-carousel/page-indicators";
import { useFullscreenModalStore } from "./use-fullscreen-modal-store";

interface FullscreenModalProps {
    images: string[];
    currentIndex: number;
    onClose: () => void;
    onNavigate?: (index: number) => void;
    alt: string;
}

export const FullscreenModal: FC<FullscreenModalProps> = ({
    images,
    currentIndex: initialIndex,
    onClose,
    onNavigate,
    alt,
}) => {
    const { state, effects } = useFullscreenModalStore(images, initialIndex, onClose, onNavigate);
    const { currentIndex } = state;
    const { setModalEl, goToPrevious, goToNext, navigateTo, stopPropagation, handleKeyDown, handleDragEnd } = effects;

    return (
        <div
            ref={setModalEl}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={onClose}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            tabIndex={0}
        >
            <Button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2!"
                aria-label="Close fullscreen"
            >
                <BiX className="size-8 md:size-10" />
            </Button>

            <div
                className="glow-container relative flex h-10/12 sm:h-full w-full max-w-11/12 sm:max-w-10/12 items-center bg-general-background justify-center overflow-hidden"
                onClick={stopPropagation}
            >
                <MotionDiv
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                    className="relative h-full w-full cursor-grab active:cursor-grabbing"
                >
                    {images.map((src, index) => (
                        <MotionDiv
                            key={index}
                            initial={false}
                            animate={{
                                opacity: index === currentIndex ? 1 : 0,
                                x: index === currentIndex ? 0 : index < currentIndex ? -300 : 300,
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={src}
                                alt={`${alt} - Image ${index + 1}`}
                                fill
                                loading={index === initialIndex ? "eager" : "lazy"}
                                className="object-contain"
                            />
                        </MotionDiv>
                    ))}
                </MotionDiv>

                {images.length > 1 && (
                    <>
                        <NavigationButtons onPrevious={goToPrevious} onNext={goToNext} stopPropagation />
                        <PageIndicators
                            images={images}
                            currentIndex={currentIndex}
                            onSelect={navigateTo}
                            glassmorphism
                        />
                    </>
                )}
            </div>
        </div>
    );
};
