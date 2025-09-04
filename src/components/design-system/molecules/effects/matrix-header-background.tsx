import { FC } from "react";
import styled, { TransientProps } from "styled-components";
import { MatrixRain } from "../../atoms/effects/matrix-rain";
import { mediaQuery } from "../../utils/media-query";
import { boxShadow } from "../../atoms/effects/box-shadow";

const MatrixBackground = styled.div<TransientProps<MatrixHeaderBackgroundProps>>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${(props) => (props.$big ? "350px" : "220px")};
  z-index: -100;
  overflow: hidden;
  border-bottom: 2px solid ${(props) => props.theme.colors.accentColor};
  ${boxShadow};

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
      <MatrixRain fontSize={14} density={0.95} />
    </MatrixBackgroundRain>
  </MatrixBackground>
);
