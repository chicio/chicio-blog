import { projects } from "@/content/home/projects";
import { FC } from "react";
import { ProjectCard } from "./project-card";

export const Projects: FC = () => (
    <div className="my-9 flex w-full flex-col gap-2 md:gap-3">
        {Object.keys(projects).map((projectKey) => {
            const project = projects[projectKey];

            return <ProjectCard key={project.name} project={project} />;
        })}
    </div>
);
