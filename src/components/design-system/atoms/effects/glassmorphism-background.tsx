'use client'

import { motion, stagger, Variants } from "framer-motion";
import { FC, PropsWithChildren } from "react";
import { useGlassmorphism } from "../../utils/hooks/use-glassmorphism";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.3),
    },
  },
};

interface GlassmorphismBackgroundProps {
  className?: string;
}

export const GlassmorphismBackground: FC<PropsWithChildren<GlassmorphismBackgroundProps>> = ({
  className,
  children,
}) => {
    const { glassmorphismClass } = useGlassmorphism();

    return (
      <motion.div
        className={`${glassmorphismClass} relative p-5 md:p-9 ${className}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {children}
      </motion.div>
    );
  };

