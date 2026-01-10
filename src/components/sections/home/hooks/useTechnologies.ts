import { technologies, Technology } from "@/types/home/technology";

export const useTechnologies = () => {
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
