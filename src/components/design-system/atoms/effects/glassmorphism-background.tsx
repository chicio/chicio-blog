import { motion, stagger, Variants } from "framer-motion";
import { FC, PropsWithChildren } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.15),
    },
  },
};

export const GlassmorphismBackground: FC<PropsWithChildren> = ({
  children,
}) => (
  <motion.div
    className="glassmorphism relative p-5 md:p-9"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {children}
  </motion.div>
);
