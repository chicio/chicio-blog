"use client";

import { FC, useState, useEffect, useRef } from "react";
import { BiChevronLeft, BiChevronRight, BiX } from "react-icons/bi";
import { ImageGlow } from "../atoms/effects/image-glow";
import { Button } from "../atoms/buttons/button";
import { MotionDiv } from "../molecules/animation/motion-div";
import { useGlassmorphism } from "../utils/hooks/use-glassmorphism";
import Image from "next/image";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  stopPropagation?: boolean;
}

const NavigationButtons: FC<NavigationButtonsProps> = ({
  onPrevious,
  onNext,
  stopPropagation = false,
}) => {
  const handlePrevious = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    onPrevious();
  };

  const handleNext = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    onNext();
  };

  return (
    <>
      <Button
        onClick={handlePrevious}
        className="absolute top-1/2 left-4 -translate-y-1/2 hidden md:flex"
        aria-label="Previous image"
      >
        <BiChevronLeft className="size-10 md:size-12" />
      </Button>
      <Button
        onClick={handleNext}
        className="absolute top-1/2 right-4 -translate-y-1/2 hidden md:flex"
        aria-label="Next image"
      >
        <BiChevronRight className="size-10 md:size-12" />
      </Button>
    </>
  );
};

interface PageIndicatorsProps {
  images: string[];
  currentIndex: number;
  onSelect: (index: number) => void;
  glassmorphism?: boolean;
}

const PageIndicators: FC<PageIndicatorsProps> = ({
  images,
  currentIndex,
  onSelect,
  glassmorphism = false,
}) => {
  const { glassmorphismClass } = useGlassmorphism();

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
      <div
        className={`flex gap-2 ${glassmorphism ? `rounded-full p-3 ${glassmorphismClass}` : ""}`}
      >
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(index);
            }}
            className={`size-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-primary scale-125 shadow-lg"
                : "bg-primary-text/30 hover:bg-primary-text/50"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

interface ImageCarouselProps {
  images: string[];
  alt: string;
  caption?: string;
  className?: string;
}

export const ImageCarousel: FC<ImageCarouselProps> = ({
  images,
  alt,
  caption,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (images.length === 1) {
    return (
      <div className={className}>
        <ImageGlow
          src={images[0]}
          alt={alt}
          width={800}
          height={450}
          className="h-96 w-full cursor-pointer object-contain bg-general-background-light overflow-hidden"
          onClick={() => setIsFullscreen(true)}
        />
        {caption && <figcaption>{caption}</figcaption>}
        {isFullscreen && (
          <FullscreenModal
            images={images}
            currentIndex={0}
            onClose={() => setIsFullscreen(false)}
            alt={alt}
          />
        )}
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      goToPrevious();
    } else if (info.offset.x < -swipeThreshold) {
      goToNext();
    }
  };

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
                x: index === currentIndex ? 0 : (index < currentIndex ? -300 : 300),
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
                onClick={() => setIsFullscreen(true)}
              />
            </MotionDiv>
          ))}
        </MotionDiv>

        <NavigationButtons
          onPrevious={goToPrevious}
          onNext={goToNext}
        />
        <PageIndicators
          images={images}
          currentIndex={currentIndex}
          onSelect={(index) => {
            setCurrentIndex(index);
          }}
          glassmorphism
        />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
      {isFullscreen && (
        <FullscreenModal
          images={images}
          currentIndex={currentIndex}
          onClose={() => setIsFullscreen(false)}
          onNavigate={setCurrentIndex}
          alt={alt}
        />
      )}
    </div>
  );
};

interface FullscreenModalProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate?: (index: number) => void;
  alt: string;
}

const FullscreenModal: FC<FullscreenModalProps> = ({
  images,
  currentIndex: initialIndex,
  onClose,
  onNavigate,
  alt,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
    const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const goToPrevious = () => {
    setDirection(-1);
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    onNavigate?.(newIndex);
  };

  const goToNext = () => {
    setDirection(1);
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    onNavigate?.(newIndex);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
  };

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      goToPrevious();
    } else if (info.offset.x < -swipeThreshold) {
      goToNext();
    }
  };

  return (
    <div
      ref={modalRef}
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
        onClick={(e) => e.stopPropagation()}
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
                x: index === currentIndex ? 0 : (index < currentIndex ? -300 : 300),
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
            <NavigationButtons
              onPrevious={goToPrevious}
              onNext={goToNext}
              stopPropagation
            />
            <PageIndicators
              images={images}
              currentIndex={currentIndex}
              onSelect={(index) => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
                onNavigate?.(index);
              }}
              glassmorphism
            />
          </>
        )}
      </div>
    </div>
  );
};
