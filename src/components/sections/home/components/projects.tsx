"use client";

import { mediaQuery } from "@/components/design-system/utils/media-query";
import { projects } from "@/types/projects";
import { motion, stagger, Variants } from "framer-motion";
import { FC } from "react";
import styled from "styled-components";
import { ProjectCard } from "./project-card";
import { SectionTitle } from "./section-title";

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
  gap: ${(props) => props.theme.spacing[1]};
  width: 100%;

  ${mediaQuery.minWidth.md} {
    gap: ${(props) => props.theme.spacing[2]};
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
  <div className="container-fluid snap-start flex flex-col max-w-6xl py-9">
    <ProjectsContent
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.01 }}
    >
      <SectionTitle>Open Source</SectionTitle>
      <ProjectsGrid>
        {Object.keys(projects).map((projectKey) => {
          const project = projects[projectKey];

          return (
            <ProjectCard
              key={project.name}
              project={project}
            />
          );
        })}
      </ProjectsGrid>
    </ProjectsContent>
  </div>
);
