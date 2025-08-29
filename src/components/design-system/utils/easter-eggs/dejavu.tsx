import { FC, PropsWithChildren, useEffect, useState } from "react";
import { Overlay } from "../../atoms/effects/overlay";
import { CenterContainer } from "../../molecules/containers/content-container";
import { MatrixTerminal } from "../../molecules/effects/matrix-terminal";

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
      }, 3500);
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

export const DejavuEasterEgg: FC<PropsWithChildren> = ({ children }) => {
  const { handleLogoClick, showDejavu } = useDejavu();

  return (
    <div onClick={handleLogoClick}>
      {children}
      {showDejavu && (
        <Overlay zIndex={10000} delay={0} onClick={() => {}}>
          <CenterContainer>
            <MatrixTerminal
              lines={[{ text: "Déjà vu", type: "quote", delay: 200 }]}
            />
          </CenterContainer>
        </Overlay>
      )}
    </div>
  );
};
