import { getAboutMe } from "./about-me/about-me";
import {
  getAllDataStructuresAndAlgorithmsTopics,
  getAllExercises,
  getDataStructuresAndAlgorithmsRoadmap,
  getExercisesContent,
} from "./data-structures-and-algorithms/data-structures-and-algorithms";
import { getPosts } from "./posts/posts";
import { getAllConsoles, getAllGames } from "./videogames/videogames";
import { easterEggHuntPageDescription, easterEggHuntPageTitle } from "./easter-eggs/easter-eggs-content";
import { Content } from "@/types/content/content";
import { slugs } from "@/types/configuration/slug";

const easterEggHuntSearchEntry: Content = {
  frontmatter: {
    title: easterEggHuntPageTitle,
    description: easterEggHuntPageDescription,
    tags: ["easter egg", "matrix"],
    authors: [],
    date: { year: 0, month: 0, day: 0, formatted: "" },
    image: "",
  },
  slug: { params: {}, formatted: slugs.easterEggHunt },
  readingTime: { text: "", minutes: 0, time: 0, words: 0 },
  contentFileRelativePath: "",
  content: "",
};

export const getIndexableContent = () => [
  ...getPosts(),
  ...getAllDataStructuresAndAlgorithmsTopics(),
  ...getAllExercises(),
  ...getAllConsoles(),
  ...getAllGames(),
  getDataStructuresAndAlgorithmsRoadmap(),
  getExercisesContent(),
  getAboutMe(),
  easterEggHuntSearchEntry,
];
