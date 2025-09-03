import { ImageGlow } from "@/components/design-system/atoms/effects/image-glow";
import { Overlay } from "@/components/design-system/atoms/effects/overlay";
import { CenterContainer } from "@/components/design-system/molecules/containers/content-container";
import { MatrixTerminal } from "@/components/design-system/molecules/effects/matrix-terminal";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { styled } from "styled-components";

export const useDejavu = () => {
  const [logoClicks, setLogoClicks] = useState(0);
  const [showDejavu, setShowDejavu] = useState(false);

  useEffect(() => {
    if (logoClicks === 4) {
      document.body.classList.add("glitch-active");
      const glitchTimeout = setTimeout(() => {
        document.body.classList.remove("glitch-active");
        setShowDejavu(true);
      }, 400);
      const resetTimeout = setTimeout(() => {
        setShowDejavu(false);
        setLogoClicks(0);
      }, 4000);
      return () => {
        clearTimeout(glitchTimeout);
        clearTimeout(resetTimeout);
      };
    }
  }, [logoClicks]);

  const handleLogoClick = () => {
    if (!showDejavu && logoClicks < 4) {
      setLogoClicks((prev) => prev + 1);
    }
  };

  return { showDejavu, handleLogoClick };
};

const DejavuImage = styled(ImageGlow)`
  width: 95%;
  max-width: 600px;
  height: auto;
  object-fit: contain;
`;

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
            <DejavuImage
              src="/images/tattoos/matrix-pills.png"
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
