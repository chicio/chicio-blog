import { RedPillButton } from "@/components/design-system/molecules/buttons/pills-buttons";
import { CenterContainer } from "@/components/design-system/molecules/containers/content-container";
import { MatrixTerminal } from "@/components/design-system/molecules/effects/matrix-terminal";
import { mediaQuery } from "@/components/design-system/utils/media-query";
import { EasterEggSearchResult, EasterEggTerminalLines } from "@/types/search";
import { FC, useState } from "react";
import { styled } from "styled-components";

export const neoRoomNumber = "101";

export const whiteRabbitEasterEgg = (
  query: string
): EasterEggSearchResult | null => {
  if (query === neoRoomNumber) {
    return {
      type: "easterEgg",
      terminalLines: [
        { text: "Wake up, Neo...", type: "normal", delay: 200 },
        { text: "The matrix has you...", type: "normal", delay: 600 },
        { text: "Follow the white rabbit.", type: "normal", delay: 1000 },
        { text: "", type: "normal", delay: 1300 },
        { text: "Knock, knock, Neo.", type: "normal", delay: 1600 },
      ],
    };
  }

  return null;
};

const PlaySoundContainer = styled.div<{ $visible: boolean }>`
  visibility: ${$props => $props.$visible ? 'visible' : 'hidden'};

  ${mediaQuery.minWidth.sm} {
    visibility: hidden;
  }
`;

export const NeoRoomEasterEgg: FC<{ lines: EasterEggTerminalLines }> = ({
  lines,
}) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  
  return (
    <CenterContainer>
      <MatrixTerminal
        lines={lines}
        onComplete={() => {
          setIsCompleted(true);
          const audio = new Audio("/sounds/knock-knock.mp3");
          audio.play();
        }}
      />
     <PlaySoundContainer $visible={isCompleted}>
        <RedPillButton
          onClick={() => {
            const audio = new Audio("/sounds/knock-knock.mp3");
            audio.play();
          }}
        >
          Knock, knock
        </RedPillButton>
      </PlaySoundContainer>
    </CenterContainer>
  );
};
