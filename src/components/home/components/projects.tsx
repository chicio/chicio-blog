"use client";

import { FC } from "react";
import { projects } from "@/types/projects";
import { ProjectCard } from "@/components/home/components/project-card";
import { SectionTitle } from "@/components/home/components/section-title";
import { motion, stagger, Variants } from "framer-motion";
import { FloatingDownArrow } from "@/components/design-system/molecules/floating-down-arrow";
import styled from "styled-components";
import { ContainerFluid } from "@/components/design-system/atoms/container-fluid";
import { mediaQuery } from "@/components/design-system/utils-css/media-query";

const SectionContainer = styled(ContainerFluid)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing[8]}
    ${(props) => props.theme.spacing[4]} ${(props) => props.theme.spacing[16]};
  background: ${(props) => props.theme.dark.generalBackground};
  scroll-snap-align: start;
  position: relative;

  ${mediaQuery.minWidth.md} {
    padding: ${(props) => props.theme.spacing[12]}
      ${(props) => props.theme.spacing[8]} ${(props) => props.theme.spacing[20]};
  }
`;

const ProjectsContent = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

const ProjectsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[6]};
  width: 100%;

  ${mediaQuery.minWidth.md} {
    gap: ${(props) => props.theme.spacing[12]};
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

export const Projects: FC = () => (
  <SectionContainer>
    <ProjectsContent
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.01 }}
    >
      <SectionTitle as="h2">Open Source</SectionTitle>
      <ProjectsGrid>
        {Object.keys(projects).map((projectKey, index) => {
          const project = projects[projectKey];

          return (
            <ProjectCard
              key={project.name}
              reverse={index % 2 !== 0}
              project={project}
            />
          );
        })}
      </ProjectsGrid>
    </ProjectsContent>
    <FloatingDownArrow />
  </SectionContainer>
);
