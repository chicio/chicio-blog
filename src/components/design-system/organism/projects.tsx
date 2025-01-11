import { FC } from "react";
import {projects} from "@/types/projects";
import {ProjectCard} from "@/components/design-system/molecules/project-card";

export const Projects: FC = () =>
    (
        <>
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
