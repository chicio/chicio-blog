import { FC } from "react";
import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import { PageIndicatorButton } from "@/components/design-system/organism/image-carousel/page-indicators/page-indicator-button";

interface PageIndicatorsProps {
    images: string[];
    currentIndex: number;
    onSelect: (index: number) => void;
    glassmorphism?: boolean;
}

export const PageIndicators: FC<PageIndicatorsProps> = ({
    images,
    currentIndex,
    onSelect,
    glassmorphism = false,
}) => {
    const { glassmorphismClass } = useGlassmorphism();

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className={`flex gap-2 ${glassmorphism ? `rounded-full p-3 ${glassmorphismClass}` : ""}`}>
                {images.map((_, index) => (
                    <PageIndicatorButton
                        key={index}
                        index={index}
                        isActive={index === currentIndex}
                        onSelect={onSelect}
                    />
                ))}
            </div>
        </div>
    );
};
