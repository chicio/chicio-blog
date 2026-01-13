import { FC } from "react";
import { TechnologyCard } from "./technology-card";
import { technologiesGroups } from "@/types/home/technology";

export const TechnologiesSkillsGrid: FC = () => {
  const { technologies } = technologiesGroups();

  return (
    <div className="mt-9 flex w-full flex-col gap-9 md:gap-12">
      {Object.entries(technologies).map(([category, techs]) => (
        <div className="flex w-full flex-col items-center" key={category}>
          <h3 className="mb-5">{category}</h3>
          <div className="mx-auto my-0 flex w-full flex-wrap justify-center gap-8">
            {techs.map((tech, index) => (
              <TechnologyCard tech={tech} index={index} key={tech.name} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
