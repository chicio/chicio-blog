'use client'

import { FC } from "react";
import { ContainerFluid } from "../atoms/container-fluid";
import styled from "styled-components";
import { Projects } from "./projects";
import { Timeline } from "./timeline";
import { mediaQuery } from "../utils-css/media-query";
import { FloatingDownArrow } from "../molecules/floating-down-arrow";
import { motion, stagger, Variants } from "framer-motion";
import { SectionTitle } from "@/components/home/components/section-title";

const SectionContainer = styled(ContainerFluid)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing[8]} ${(props) => props.theme.spacing[8]} ${(props) => props.theme.spacing[16]};
  background: ${(props) => props.theme.dark.generalBackground};
  scroll-snap-align: start;
  position: relative;

  ${mediaQuery.minWidth.md} {
    padding: ${(props) => props.theme.spacing[12]} ${(props) => props.theme.spacing[12]} ${(props) => props.theme.spacing[20]};
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


export const Resume: FC = () => {
  return (
    <>
      <SectionContainer>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <Projects />
          </motion.div>
        <FloatingDownArrow />
      </SectionContainer>

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
        <FloatingDownArrow />
      </SectionContainer>
    </>
  );
};
