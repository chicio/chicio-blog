import { useReducedMotions } from "./use-reduced-motions";

  export const useGlassmorphism = () => {
    const shouldReduceMotion = useReducedMotions();

    return {
      glassmorphismClass: `${!shouldReduceMotion ? "glassmorphism " : "glassmorphism-lite "}`,
    };
  };