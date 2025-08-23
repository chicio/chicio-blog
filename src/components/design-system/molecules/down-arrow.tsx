"use client";

import styled from "styled-components";
import { FC, useEffect, useState } from "react";
import { mediaQuery } from "../utils/media-query";
import { bounce } from "@/components/design-system/utils/animations/bounce-keyframes";
import { ChevronDown } from "@styled-icons/boxicons-regular";
import { RoundedIcon } from "../atoms/icon";

const FloatingArrowContainer = styled(RoundedIcon)`
  animation: ${bounce} 2s ease-in-out infinite;
  position: fixed;
  z-index: 3;
  bottom: ${(props) => props.theme.spacing[2]};

  ${mediaQuery.minWidth.md} {
    bottom: ${(props) => props.theme.spacing[4]};
  }
`;

const ArrowIcon = styled.div`
  width: 30px;
  height: 30px;
  color: ${(props) => props.theme.dark.textAbovePrimaryColor};
  display: flex;
  align-items: center;
  justify-content: center;

  ${mediaQuery.minWidth.md} {
    width: 50px;
    height: 50px;
  }
`;

export const FloatingDownArrow: FC = () => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [totalSections, setTotalSections] = useState(0);

  useEffect(() => {
    const scrollContainer = document.querySelector("[data-snap-container]");
    if (!scrollContainer) return;

    const sections = Array.from(scrollContainer.children);
    setTotalSections(sections.length);

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      const containerHeight = scrollContainer.clientHeight;

      const viewportCenter = scrollTop + containerHeight / 2;

      let closestSectionIndex = 0;
      let minDistance = Infinity;

      sections.forEach((section, index) => {
        const sectionElement = section as HTMLElement;
        const sectionTop = sectionElement.offsetTop;
        const sectionCenter = sectionTop + sectionElement.offsetHeight / 2;
        const distance = Math.abs(viewportCenter - sectionCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestSectionIndex = index;
        }
      });

      setCurrentSectionIndex(closestSectionIndex);
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollDown = () => {
    const scrollContainer = document.querySelector("[data-snap-container]");
    if (!scrollContainer) return;

    const sections = Array.from(scrollContainer.children);
    const nextSectionIndex = currentSectionIndex + 1;

    if (nextSectionIndex >= sections.length) return;

    const nextSection = sections[nextSectionIndex] as HTMLElement;
    const nextSectionTop = nextSection.offsetTop;

    scrollContainer.scrollTo({
      top: nextSectionTop,
      behavior: "smooth",
    });
  };

  if (currentSectionIndex >= totalSections - 1) {
    return null;
  }

  return (
    <FloatingArrowContainer onClick={handleScrollDown}>
      <ArrowIcon>
        <ChevronDown size={100} title="Scroll to next section" />
      </ArrowIcon>
    </FloatingArrowContainer>
  );
};
