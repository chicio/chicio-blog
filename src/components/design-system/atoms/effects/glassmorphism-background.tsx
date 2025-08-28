import styled from "styled-components";
import { motion, stagger, Variants } from "framer-motion";
import { FC, PropsWithChildren } from "react";
import { mediaQuery } from "../../utils/media-query";
import { glassmorphism } from "./glassmorphism";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.15),
    },
  },
};

const GlassmorphismBackgroundContainer = styled(motion.div)`
  position: relative;
  z-index: 2;
  padding: ${(props) => props.theme.spacing[4]};
  ${glassmorphism};

  ${mediaQuery.minWidth.md} {
    padding: ${(props) => props.theme.spacing[8]};
  }
`;

type Props = {
  withPadding?: boolean
};

export const GlassmorphismBackground: FC<PropsWithChildren<Props>> = ({
  children,
}) => (
  <GlassmorphismBackgroundContainer
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {children}
  </GlassmorphismBackgroundContainer>
);
