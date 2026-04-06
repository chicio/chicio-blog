import { EasterEggTerminalLines } from "@/types/search/search";
import { FC, useState } from "react";
import { CenterContainer } from "./center-container";
import { MatrixTerminal } from "@/components/design-system/molecules/effects/matrix-terminal";
import { RedPillButton } from "@/components/design-system/molecules/buttons/pills-buttons";

const NeoRoomEasterEgg: FC<{ lines: EasterEggTerminalLines }> = ({
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
     <div style={{ visibility: isCompleted ? 'visible' : 'hidden' }}>
        <RedPillButton
          onClick={() => {
            const audio = new Audio("/sounds/knock-knock.mp3");
            audio.play();
          }}
        >
          Knock, knock
        </RedPillButton>
      </div>
    </CenterContainer>
  );
};

export default NeoRoomEasterEgg;