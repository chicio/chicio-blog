"use client";

import styled from "styled-components";
import { FC, useEffect, useState } from "react";
import { mediaQuery } from "../utils-css/media-query";
import { bounce } from "@/components/design-system/utils-css/bounce-keyframes";
import { ChevronDown } from "@styled-icons/boxicons-regular";

const FloatingArrowContainer = styled.div`
  position: absolute;
  bottom: ${(props) => props.theme.spacing[2]};
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 1000;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.dark.accentColor} 0%,
    ${(props) => props.theme.dark.primaryColor} 100%
  );
  backdrop-filter: blur(10px);
  border: 2px solid ${(props) => props.theme.dark.accentColor};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  animation: ${bounce} 2s ease-in-out infinite;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 20px ${(props) => props.theme.dark.accentColor}80;
  }

  ${mediaQuery.minWidth.md} {
    bottom: ${(props) => props.theme.spacing[4]};
    width: 60px;
    height: 60px;
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
    const scrollContainer = document.querySelector('[data-snap-container]');
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

    // Initial calculation
    handleScroll();

    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollDown = () => {
    const scrollContainer = document.querySelector('[data-snap-container]');
    if (!scrollContainer) return;

    // Trova la sezione successiva usando la stessa logica robusta
    const sections = Array.from(scrollContainer.children);
    const nextSectionIndex = currentSectionIndex + 1;

    // Assicurati che esista una sezione successiva
    if (nextSectionIndex >= sections.length) return;

    // Ottieni la posizione reale della sezione successiva
    const nextSection = sections[nextSectionIndex] as HTMLElement;
    const nextSectionTop = nextSection.offsetTop;

    // Scrolla alla posizione reale della sezione successiva
    scrollContainer.scrollTo({
      top: nextSectionTop,
      behavior: "smooth",
    });
  };

  // Hide on last section
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
