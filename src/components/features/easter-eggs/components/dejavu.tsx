import { ImageGlow } from "@/components/design-system/atoms/effects/image-glow";
import { Overlay } from "@/components/design-system/atoms/effects/overlay";
import { MatrixTerminal } from "@/components/design-system/molecules/effects/matrix-terminal";
import { FC, PropsWithChildren } from "react";
import { CenterContainer } from "./center-container";
import { useDejavu } from "../hooks/use-dejavu";

export const DejavuEasterEgg: FC<PropsWithChildren> = ({ children }) => {
  const { handleLogoClick, showDejavu } = useDejavu();

  return (
    <div onClick={handleLogoClick}>
      {children}
      {showDejavu && (
        <Overlay delay={0}>
          <CenterContainer>
            <MatrixTerminal
              lines={[{ text: "Déjà vu", type: "quote", delay: 200 }]}
            />
            <ImageGlow
              className="w-[95%] max-w-[600px] h-auto object-contain"
              src="/media/content/about-me/tattoos/matrix-pills.png"
              alt="matrix pills"
              width={200}
              height={500}
            />
          </CenterContainer>
        </Overlay>
      )}
    </div>
  );
};
