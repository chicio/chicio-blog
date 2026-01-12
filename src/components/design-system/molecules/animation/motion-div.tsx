/**
 * @author Fabrizio Duroni
 */

"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ComponentPropsWithoutRef, FC } from "react";
import { useMotionStore } from "../../utils/hooks/use-motion-store";

type MotionDivProps = HTMLMotionProps<"div">;

/**
 * A wrapper component for motion.div that conditionally renders animations
 * based on user motion preferences stored in localStorage.
 *
 * When animations are enabled: renders a motion.div with all animation props
 * When animations are disabled: renders a plain div (motion props are discarded)
 *
 * This approach ensures:
 * - Zero animation overhead when disabled
 * - Immediate sync across all instances when settings change
 * - Proper SSR handling via useSyncExternalStore
 * - Components using this stay as client components, keeping the rest server-rendered
 */
export const MotionDiv: FC<MotionDivProps> = (props) => {
    const motionEnabled = useMotionStore();

    if (!motionEnabled) {
        // Extract only standard HTML div props for regular div
        const {
            animate,
            initial,
            transition,
            variants,
            whileHover,
            whileTap,
            whileFocus,
            whileInView,
            whileDrag,
            exit,
            layout,
            layoutId,
            drag,
            dragConstraints,
            dragElastic,
            dragMomentum,
            dragTransition,
            dragSnapToOrigin,
            dragControls,
            dragListener,
            dragPropagation,
            onDrag,
            onDragStart,
            onDragEnd,
            onDirectionLock,
            onAnimationStart,
            onAnimationComplete,
            onUpdate,
            onViewportEnter,
            onViewportLeave,
            ...divProps
        } = props;

        return <div {...(divProps as ComponentPropsWithoutRef<"div">)} />;
    }

    return <motion.div {...props} />;
};
