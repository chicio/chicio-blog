import styled from "styled-components";
import { motion, stagger, Variants } from "framer-motion";
import { mediaQuery } from "@/components/design-system/utils-css/media-query";
import { FC, PropsWithChildren } from "react";

export const GlassmorphismBackgroundContainer = styled(motion.div)`
  position: relative;
  z-index: 2;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.dark.accentColor}40; // Using theme color with hex opacity
  padding: ${(props) => props.theme.spacing[4]};
  box-shadow:
    0 8px 32px ${(props) => props.theme.dark.boxShadowLight},
    inset 0 1px 0 ${(props) => props.theme.dark.accentColor}1A; // 10% opacity

  ${mediaQuery.minWidth.md} {
    padding: ${(props) => props.theme.spacing[8]};
  }
`;

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
  <GlassmorphismBackgroundContainer
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {children}
  </GlassmorphismBackgroundContainer>
);
