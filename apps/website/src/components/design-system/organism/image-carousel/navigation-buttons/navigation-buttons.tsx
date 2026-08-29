import { FC } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { Button } from "@/components/design-system/atoms/buttons/button";
import { useNavigationButtonsStore } from "./use-navigation-buttons-store";

interface NavigationButtonsProps {
    onPrevious: () => void;
    onNext: () => void;
    stopPropagation?: boolean;
}

export const NavigationButtons: FC<NavigationButtonsProps> = ({
    onPrevious,
    onNext,
    stopPropagation = false,
}) => {
    const { effects } = useNavigationButtonsStore(onPrevious, onNext, stopPropagation);
    const { handlePrevious, handleNext } = effects;

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
