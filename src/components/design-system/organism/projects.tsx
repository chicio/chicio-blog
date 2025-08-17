import { FC } from "react";
import {projects} from "@/types/projects";
import {ProjectCard} from "@/components/design-system/molecules/project-card";
import { SectionTitle } from "@/components/home/components/section-title";

export const Projects: FC = () =>
    (
        <>
          <SectionTitle as="h2">Open Source Projects</SectionTitle>
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
        </>
    );
