'use client'

import styled from "styled-components";
import { MatrixRain } from "../../atoms/effects/matrix-rain";
import { FC, ReactNode } from "react";

const MatrixBackgroundDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
`;

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  min-height: 100vh;
  width: 100%;
`;

const ContentWrapper = styled.div`
  scroll-snap-align: start;
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

interface ContainerFullscreenWithMatrixProps {
  children: ReactNode;
  fontSize?: number;
  speed?: number;
  density?: number;
}

export const MatrixBackground: FC<ContainerFullscreenWithMatrixProps> = ({
  children,
  fontSize = 16,
  speed = 50,
  density = 0.95
}) => (
  <Container>
    <MatrixBackgroundDiv>
      <MatrixRain fontSize={fontSize} speed={speed} density={density} />
    </MatrixBackgroundDiv>
    <ContentWrapper>
      {children}
    </ContentWrapper>
  </Container>
);
