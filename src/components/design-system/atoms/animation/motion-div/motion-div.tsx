"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ComponentPropsWithoutRef, FC } from "react";
import { useMotionDivStore } from "./use-motion-div-store";

type MotionDivProps = HTMLMotionProps<"div">;

export const MotionDiv: FC<MotionDivProps> = (props) => {
    const { state } = useMotionDivStore();
    const { motionEnabled } = state;

    if (!motionEnabled) {
        /* eslint-disable @typescript-eslint/no-unused-vars */
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
        /* eslint-enable @typescript-eslint/no-unused-vars */

        return <div {...(divProps as ComponentPropsWithoutRef<"div">)} />;
    }

    return <motion.div {...props} />;
};
