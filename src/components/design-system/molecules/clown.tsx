import styled from "styled-components";
import { Heading1 } from "../atoms/heading1";
import { mediaQuery } from "../utils/media-query";
import { FC } from "react";
import { useScrollDirection, ScrollDirection } from "../hooks/use-scroll-direction";

const CenteredHeading = styled(Heading1)`
  text-align: center;

  ${mediaQuery.maxWidth.md} {
    font-size: ${(props) => props.theme.fontSizes[8]};
  }
`;

const ClownBackground = styled.div`
  background: linear-gradient(45deg, red, yellow, blue, green, orange);
  padding: 20px;
  margin-bottom: 20px;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const AnimatedClownBackground = styled(ClownBackground)<{ $hide: boolean }>`
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: ${(props) => (props.$hide ? 0 : 1)};
  transform: translateY(${(props) => (props.$hide ? "-100%" : "0")});
`;

export const ClownTitle: FC = () => {
  const scrollDirection = useScrollDirection();

  return (
    <AnimatedClownBackground $hide={scrollDirection === ScrollDirection.down}>
      <CenteredHeading>
        🤡 Clownified!! 🤡
      </CenteredHeading>
    </AnimatedClownBackground>
  );
};