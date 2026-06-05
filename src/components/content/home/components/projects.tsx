import { projects } from "@/content/home/projects";
import { FC } from "react";
import { ProjectCard } from "./project-card";

export const Projects: FC = () => (
    <div className="flex flex-col my-9 gap-2 w-full md:gap-3">
      {Object.keys(projects).map((projectKey) => {
        const project = projects[projectKey];

        return <ProjectCard key={project.name} project={project} />;
      })}
    </div>
);
