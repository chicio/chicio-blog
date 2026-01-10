import { slugs } from "@/types/configuration/slug";
import { getSingleContentBy } from "./content";
import { Content } from "@/types/content/content";

export const getAboutMe = (): Content =>
    getSingleContentBy(slugs.aboutMe)!;