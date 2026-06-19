import { useReducedMotions } from "./use-reduced-motions";

interface UseGlassmorphismOptions {
    noScale?: boolean;
    increaseContrast?: boolean;
}

export const useGlassmorphism = ({ noScale = false, increaseContrast = false }: UseGlassmorphismOptions = {}) => {
    const shouldReduceMotion = useReducedMotions();
    const increaseContrastRule = increaseContrast ? "backdrop-blur-2xl!" : ""

    return {
        glassmorphismClass: 
            !shouldReduceMotion ? `glassmorphism${noScale ? "-no-scale" : ""} ${increaseContrastRule}` : `glassmorphism-lite${noScale ? "-no-scale" : ""} ${increaseContrastRule}`,
    };
};