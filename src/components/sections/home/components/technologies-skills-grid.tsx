import { FC } from "react";
import { TechnologyCard } from "./technology-card";
import { technologies, Technology } from "@/content/home/technology";

export const technologiesGroups = () => {
  const groupedTechnologies = technologies.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, Technology[]>);

  return {
    technologies: groupedTechnologies,
  }
}

export const TechnologiesSkillsGrid: FC = () => {
  const { technologies } = technologiesGroups();

  return (
    <div className="my-9 flex w-full flex-col gap-10 md:gap-12">
      {Object.entries(technologies).map(([category, techs]) => (
        <div className="flex w-full flex-col items-center" key={category}>
          <h3 className="mb-5">{category}</h3>
          <div className="mx-auto my-0 flex w-full flex-wrap justify-center gap-8">
            {techs.map((tech) => (
              <TechnologyCard tech={tech} key={tech.name} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
