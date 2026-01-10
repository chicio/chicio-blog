"use client";

import { projects } from "@/types/home/projects";
import { motion, stagger, Variants } from "framer-motion";
import { FC } from "react";
import { ProjectCard } from "./project-card";
import { SectionTitle } from "./section-title";

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
  <div className="container-fluid flex max-w-6xl snap-start flex-col py-9">
    <motion.div
      className="mx-auto my-0 flex max-w-[1400px] flex-1 flex-col items-center"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.01 }}
    >
      <SectionTitle>Open Source</SectionTitle>
      <div className="flex flex-col gap-2 w-full md:gap-3">
        {Object.keys(projects).map((projectKey) => {
          const project = projects[projectKey];

          return <ProjectCard key={project.name} project={project} />;
        })}
      </div>
    </motion.div>
  </div>
);
