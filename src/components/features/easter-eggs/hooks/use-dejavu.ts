import { useEffect, useState } from "react";

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