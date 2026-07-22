"use client";

import { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MatrixRain } from "@/components/design-system/atoms/effects/matrix-rain/matrix-rain";
import { useSpoonEasterEggStore } from "./use-spoon-easter-egg-store";

export const SpoonEasterEgg: FC = () => {
    const { state } = useSpoonEasterEggStore();
    const { warping, reducedMotion } = state;

    return (
        <AnimatePresence>
            {warping && (
                <motion.div
                    key="spoon-warp"
                    className="fixed top-0 left-0 w-full h-full z-40 pointer-events-none"
                    initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.92, skewY: reducedMotion ? 0 : 3 }}
                    animate={{ opacity: 1, scale: 1, skewY: 0 }}
                    exit={{ opacity: 0, scale: reducedMotion ? 1 : 1.05, skewY: reducedMotion ? 0 : -3 }}
                    transition={{ duration: reducedMotion ? 0.4 : 0.3, ease: "easeInOut" }}
                >
                    <MatrixRain />
                </motion.div>
            )}
        </AnimatePresence>
    );
};
