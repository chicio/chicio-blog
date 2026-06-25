"use client";

import { FC } from "react";
import { ImageGlow } from "@/components/design-system/atoms/effects/image-glow";
import { MotionDiv } from "@/components/design-system/atoms/animation/motion-div";
import Image from "next/image";
import { imageShimmerPlaceholder } from "@/components/design-system/atoms/effects/image-shimmer-placeholder";
import { NavigationButtons } from "@/components/design-system/organism/image-carousel/navigation-buttons";
import { PageIndicators } from "@/components/design-system/organism/image-carousel/page-indicators";
import { FullscreenModal } from "@/components/design-system/organism/image-carousel/fullscreen-modal";
import { useImageCarouselStore } from "./use-image-carousel-store";

interface ImageCarouselProps {
    images: string[];
    alt: string;
    caption?: string;
    className?: string;
}

export const ImageCarousel: FC<ImageCarouselProps> = ({ images, alt, caption, className }) => {
    const { state, effects } = useImageCarouselStore(images.length);
    const { currentIndex, isFullscreen } = state;
    const { goToPrevious, goToNext, openFullscreen, closeFullscreen, setCurrentIndex, handleDragEnd } = effects;

    if (images.length === 1) {
        const singleImage = images[0];

        return (
            <div className={className}>
                <ImageGlow
                    src={singleImage}
                    alt={alt}
                    width={800}
                    height={450}
                    className="h-96 w-full cursor-pointer object-contain bg-general-background-light overflow-hidden"
                    onClick={openFullscreen}
                />
                {caption && <figcaption>{caption}</figcaption>}
                {isFullscreen && (
                    <FullscreenModal images={images} currentIndex={0} onClose={closeFullscreen} alt={alt} />
                )}
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            <div className="glow-container relative overflow-hidden">
                <MotionDiv
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                    className="relative h-96 cursor-grab active:cursor-grabbing"
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
                                width={800}
                                height={450}
                                loading={index === 0 ? "eager" : "lazy"}
                                className="h-96 w-full cursor-pointer object-contain bg-general-background-light overflow-hidden"
                                onClick={openFullscreen}
                                placeholder={imageShimmerPlaceholder}
                            />
                        </MotionDiv>
                    ))}
                </MotionDiv>

                <NavigationButtons onPrevious={goToPrevious} onNext={goToNext} />
                <PageIndicators images={images} currentIndex={currentIndex} onSelect={setCurrentIndex} glassmorphism />
            </div>
            {caption && <figcaption>{caption}</figcaption>}
            {isFullscreen && (
                <FullscreenModal
                    images={images}
                    currentIndex={currentIndex}
                    onClose={closeFullscreen}
                    onNavigate={setCurrentIndex}
                    alt={alt}
                />
            )}
        </div>
    );
};
