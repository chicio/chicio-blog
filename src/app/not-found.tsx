'use client'

import styled from "styled-components";
import { ContainerFullscreen } from "@/components/design-system/atoms/container-fullscreen";
import { MatrixRain } from "@/components/design-system/atoms/matrix-rain";
import { MatrixTerminal } from "@/components/design-system/molecules/matrix-terminal";
import { MatrixPills } from "@/components/design-system/molecules/matrix-pills";
import { Heading1 } from "@/components/design-system/atoms/heading1";
import { glitch } from "@/components/design-system/utils/animations/glitch-keyframes";
import { mediaQuery } from "@/components/design-system/utils/media-query";

const Matrix404Container = styled(ContainerFullscreen)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
  background: #000;
  color: ${(props) => props.theme.dark.accentColor};
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing[2]};
  padding: ${(props) => props.theme.spacing[2]};
`;

const Matrix404Title = styled(Heading1)`
  text-shadow: 
    0 0 10px ${(props) => props.theme.dark.accentColor},
    0 0 20px ${(props) => props.theme.dark.accentColor},
    0 0 40px ${(props) => props.theme.dark.accentColor};
  animation: ${glitch} 2s infinite;
  position: relative;

  font-size: 72px;

    ${mediaQuery.minWidth.sm} {
      font-size: 100px;
    }
`;

const terminalLines = [
  { text: "Scanning the matrix...", delay: 300 },
  { text: "Accessing page...", delay: 500 },
  { text: "ERROR 404: Page not found", type: 'error' as const, delay: 800 },
  { text: "This is your last chance...", type: 'quote' as const, delay: 1500 },
];

export default function notFoundPage() {
  return (
    <Matrix404Container>
      <MatrixRain fontSize={14} speed={35} density={0.975} />
      
      <ContentWrapper>
        <Matrix404Title>404</Matrix404Title>
        
        <MatrixTerminal lines={terminalLines} />
        
        <MatrixPills
          redPillHref="/"
          bluePillHref="javascript:history.back()"
          redPillText="HOME"
          bluePillText="BACK"
        />
      </ContentWrapper>
    </Matrix404Container>
  );
};
