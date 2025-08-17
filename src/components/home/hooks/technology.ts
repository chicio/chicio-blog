import { StaticImageData } from "next/image";

export const categories = {
  mobile: 'Mobile Development',
  frontend: 'Frontend Development',
  backend: 'Backend Development',
  languages: 'Programming languages'
} as const;

export type CategoryType = typeof categories[keyof typeof categories];

export interface Technology {
  name: string;
  image: StaticImageData;
  years: string;
  category: CategoryType;
}
