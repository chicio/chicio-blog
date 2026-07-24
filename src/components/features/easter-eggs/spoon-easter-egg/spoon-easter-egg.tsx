"use client";

import { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SpoonMatrixRain } from "./spoon-matrix-rain";
import { useSpoonEasterEggStore } from "./use-spoon-easter-egg-store";

const SPOON_CLIP_ID = "matrix-spoon-clip";

export const SpoonEasterEgg: FC = () => {
    const { state } = useSpoonEasterEggStore();
    const { warping, reducedMotion } = state;

    return (
        <AnimatePresence>
            {warping && (
                <motion.div
                    key="spoon-warp"
                    className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none bg-black-alpha-75"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reducedMotion ? 0.4 : 0.3, ease: "easeInOut" }}
                >
                    <svg width="0" height="0" aria-hidden="true" className="absolute">
                        <defs>
                            <clipPath id={SPOON_CLIP_ID} clipPathUnits="userSpaceOnUse">
                                <ellipse cx="120" cy="135" rx="92" ry="122" />
                                <rect x="101" y="215" width="38" height="292" rx="19" />
                            </clipPath>
                        </defs>
                    </svg>
                    <motion.div
                        className="relative h-[520px] w-[240px]"
                        style={{
                            clipPath: `url(#${SPOON_CLIP_ID})`,
                            filter: "drop-shadow(0 0 14px #00FF41) drop-shadow(0 0 4px #39FF14)",
                        }}
                        initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.6 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            rotate: reducedMotion ? 0 : [0, -4, 6, -3, 0],
                            skewX: reducedMotion ? 0 : [0, -12, 16, -7, 0],
                            scaleY: reducedMotion ? 1 : [1, 0.95, 1.06, 0.98, 1],
                        }}
                        exit={{ opacity: 0, scale: reducedMotion ? 1 : 1.15 }}
                        transition={{ duration: reducedMotion ? 0.4 : 1.4, ease: "easeInOut" }}
                    >
                        <SpoonMatrixRain paused={reducedMotion} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
