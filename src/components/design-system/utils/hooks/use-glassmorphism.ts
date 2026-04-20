import { useReducedMotions } from "./use-reduced-motions";

interface UseGlassmorphismOptions {
    noScale?: boolean;
}

export const useGlassmorphism = ({ noScale = false }: UseGlassmorphismOptions = {}) => {
    const shouldReduceMotion = useReducedMotions();

    if (noScale) {
        return {
            glassmorphismClass: `${!shouldReduceMotion ? "glassmorphism-no-scale" : "glassmorphism-lite-no-scale"}`,
        };
    }

    return {
        glassmorphismClass: `${!shouldReduceMotion ? "glassmorphism" : "glassmorphism-lite"}`,
    };
};