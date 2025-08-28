"use client";

import { mediaQuery } from "@/components/design-system/utils/media-query";
import { motion, stagger, Variants } from "framer-motion";
import { FC } from "react";
import styled from "styled-components";
import { SectionTitle } from "./section-title";
import { Timeline } from "./timeline";
import { ContainerFluid } from "@/components/design-system/atoms/containers/container-fluid";

const SectionContainer = styled(ContainerFluid)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  padding: ${(props) => props.theme.spacing[2]}
    ${(props) => props.theme.spacing[2]} ${(props) => props.theme.spacing[16]};
  background: ${(props) => props.theme.colors.generalBackground};
  scroll-snap-align: start;
  position: relative;

  ${mediaQuery.minWidth.md} {
    padding: ${(props) => props.theme.spacing[12]}
      ${(props) => props.theme.spacing[12]}
      ${(props) => props.theme.spacing[20]};
  }
`;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.3, { startDelay: 0.2 }),
    },
  },
};

export const JobsTimeline: FC = () => (
  <SectionContainer>
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <SectionTitle as="h2">Experience</SectionTitle>
      <Timeline />
    </motion.div>
  </SectionContainer>
);
