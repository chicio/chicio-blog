"use client";

import styled from "styled-components";
import { FC, useEffect, useState } from "react";
import { mediaQuery } from "../utils-css/media-query";
import { bounce } from "@/components/design-system/utils-css/bounce-keyframes";
import { ChevronDown } from "@styled-icons/boxicons-regular";

const FloatingArrowContainer = styled.div`
  position: fixed;
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

export const FloatingDownArrow: FC = ({}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Hide when user scrolls more than 10% of viewport
      if (scrollY > windowHeight * 0.1 && !hasScrolled) {
        setHasScrolled(true);
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled]);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });

    // Hide after click
    setHasScrolled(true);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <FloatingArrowContainer onClick={handleScrollDown}>
      <ArrowIcon>
        <ChevronDown size={100} title={"Github"} />
      </ArrowIcon>
    </FloatingArrowContainer>
  );
};
