import { FC } from "react";
import { usePageIndicatorButtonStore } from "./use-page-indicator-button-store";

interface PageIndicatorButtonProps {
    index: number;
    isActive: boolean;
    onSelect: (index: number) => void;
}

export const PageIndicatorButton: FC<PageIndicatorButtonProps> = ({ index, isActive, onSelect }) => {
    const { effects } = usePageIndicatorButtonStore(index, onSelect);
    const { handleClick } = effects;

    return (
        <button
            onClick={handleClick}
            className={`size-3 rounded-full transition-all duration-300 ${
                isActive ? "bg-primary scale-125 shadow-lg" : "bg-primary-text/30 hover:bg-primary-text/50"
            }`}
            aria-label={`Go to image ${index + 1}`}
        />
    );
};
