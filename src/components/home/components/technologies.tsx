"use client";

import styled from "styled-components";
import { FC } from "react";
import { motion, stagger, Variants } from "framer-motion";
import { ContainerFluid } from "@/components/design-system/atoms/container-fluid";
import { FloatingDownArrow } from "@/components/design-system/molecules/floating-down-arrow";
import { TechnologiesExperience } from "@/components/home/components/technologies-experience";
import { TechnologiesSkillsGrid } from "@/components/home/components/technologies-skills-grid";

const TechnologiesContainer = styled(ContainerFluid)`
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  background: ${(props) => props.theme.dark.generalBackground};
  scroll-snap-align: start;
  padding-top: ${(props) => props.theme.spacing[10]};
  padding-left: ${(props) => props.theme.spacing[4]};
  padding-right: ${(props) => props.theme.spacing[4]};
  padding-bottom: 100px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[10]};
  z-index: 2;
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

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

export interface TechnologiesProps {
  author: string;
}

export const Technologies: FC<TechnologiesProps> = ({ author }) => (
  <TechnologiesContainer>
    <ContentWrapper>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.1,
        }}
      >
        <motion.div variants={itemVariants}>
          <TechnologiesExperience author={author} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <TechnologiesSkillsGrid />
        </motion.div>
      </motion.div>
    </ContentWrapper>

    <FloatingDownArrow />
  </TechnologiesContainer>
);
