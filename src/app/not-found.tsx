"use client";

import styled from "styled-components";
import { MatrixRain } from "@/components/design-system/atoms/effects/matrix-rain";
import { MatrixTerminal } from "@/components/design-system/molecules/effects/matrix-terminal";
import { MatrixChoice } from "@/components/design-system/molecules/buttons/matrix-choice";
import { Heading1 } from "@/components/design-system/atoms/typography/heading1";
import { glitch } from "@/components/design-system/utils/animations/glitch-keyframes";
import { mediaQuery } from "@/components/design-system/utils/media-query";
import { ContainerFullscreen } from "@/components/design-system/atoms/containers/container-fullscreen";
import { tracking } from "@/types/tracking";

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
  animation: ${glitch} 2s infinite;
  position: relative;

  font-size: 72px;

  ${mediaQuery.minWidth.sm} {
    font-size: 100px;
  }
`;

const terminalLines = [
  { text: "Scanning the Matrix...", delay: 600 },
  { text: "Accessing page...", delay: 700 },
  { text: "ERROR 404: Page not found", type: "error" as const, delay: 900 },
  { text: "This is your last chance...", type: "quote" as const, delay: 1200 },
];

export default function notFoundPage() {
  return (
    <Matrix404Container>
      <MatrixRain fontSize={14} speed={35} density={0.975} />
      <ContentWrapper>
        <Matrix404Title>404</Matrix404Title>
        <MatrixTerminal lines={terminalLines} />
        <MatrixChoice
          redPillHref="/"
          bluePillHref="javascript:history.back()"
          redPillText="Wake up!"
          bluePillText="Stay asleep"
          trackingCategory={tracking.category.notfound}
          trackingLabel={tracking.label.body}
        />
      </ContentWrapper>
    </Matrix404Container>
  );
}
