import { FC } from "react";
import styled from "styled-components";
import { MatrixRain } from "../../atoms/effects/matrix-rain";
import { mediaQuery } from "../../utils/media-query";

const MatrixBackground = styled.div<{ $big: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${(props) => (props.$big ? "350px" : "220px")};
  z-index: -100;
  overflow: hidden;

  border-bottom: 2px solid ${(props) => props.theme.dark.accentColor};
  box-shadow:
    0 4px 20px ${(props) => props.theme.dark.accentColor}1A,
    inset 0 -1px 0 ${(props) => props.theme.dark.accentColor}33,
    0 0 30px ${(props) => props.theme.dark.accentColor}26;

  ${mediaQuery.minWidth.sm} {
    height: ${(props) => (props.$big ? "400px" : "230px")};
  }

  ${mediaQuery.minWidth.md} {
    height: ${(props) => (props.$big ? "500px" : "250px")};
  }
`;

const MatrixBackgroundRain = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;

  body.scroll-locked & {
    right: var(--scrollbar-width, 0px);
  }
`;

interface MatrixHeaderBackgroundProps {
  big: boolean;
}

export const MatrixHeaderBackground: FC<MatrixHeaderBackgroundProps> = ({ big }) => (
  <MatrixBackground $big={big}> 
    <MatrixBackgroundRain>
      <MatrixRain fontSize={14} speed={60} density={0.95} />
    </MatrixBackgroundRain>
  </MatrixBackground>
);
