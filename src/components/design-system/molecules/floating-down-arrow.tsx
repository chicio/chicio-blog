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
    width: 60px;
    height: 60px;
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
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('[data-snap-container]');
      if (!scrollContainer) return;

      const scrollTop = scrollContainer.scrollTop;
      const containerHeight = scrollContainer.clientHeight;

      // Hide arrow if scrolled beyond first section (more than 10% of viewport)
      if (scrollTop > containerHeight * 0.1) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    const scrollContainer = document.querySelector('[data-snap-container]');
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleScrollDown = () => {
    // Hide immediately when clicked
    setIsVisible(false);

    const scrollContainer = document.querySelector('[data-snap-container]');
    if (!scrollContainer) return;

    const containerHeight = scrollContainer.clientHeight;

    // Scroll to next section (Technologies)
    scrollContainer.scrollTo({
      top: containerHeight,
      behavior: "smooth",
    });
  };

  // Don't render if not visible
  if (!isVisible) {
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
