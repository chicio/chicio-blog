"use client";

import { BiChevronDown } from "react-icons/bi";
import { RoundedIcon } from "./icon";
import { useScrollArrow } from "../../utils/hooks/use-scroll-arrow";
import { FC } from "react";

interface DownArrowIconProps {
  trackingCategory?: string;
}

export const DownArrowIcon: FC<DownArrowIconProps> = ({ trackingCategory }) => {
  const { isVisible, handleScrollDown } = useScrollArrow(trackingCategory);

  return (
    <>
      {isVisible && (
        <RoundedIcon className="text-text-above-primary flex animate-bounce items-center justify-center hover:shadow-lg">
          <BiChevronDown
            className="size-7 md:size-9"
            title="Scroll to next section"
            onClick={handleScrollDown}
          />
        </RoundedIcon>
      )}
    </>
  );
};
