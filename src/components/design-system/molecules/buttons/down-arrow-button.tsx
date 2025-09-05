"use client";

import { FC } from "react";
import { DownArrowIcon } from "../../atoms/icons/down-arrow-icon";
import { useScrollSnap } from "../../utils/hooks/use-scroll-snap";

export const DownArrowButton: FC = () => {
  const { currentSectionIndex, totalSections, handleScrollDown } =
    useScrollSnap();

  if (currentSectionIndex >= totalSections - 1) {
    return null;
  }

  return (
    <div className="fixed left-0 right-0 bottom-3 md:bottom-4 mx-auto my-0 flex items-center justify-center z-40" onClick={handleScrollDown}>
      <DownArrowIcon />
    </div>
  );
};
