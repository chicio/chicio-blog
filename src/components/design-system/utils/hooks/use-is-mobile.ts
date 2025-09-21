import { useEffect, useState } from "react";

/**
 * Ritorna true se il device è mobile (usa window.matchMedia su max-width 640px).
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.matchMedia("(max-width: 640px)").matches);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}
