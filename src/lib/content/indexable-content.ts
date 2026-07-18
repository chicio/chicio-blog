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
import { siteMetadata } from "@/types/configuration/site-metadata";

const easterEggHuntSearchEntry: Content = {
  frontmatter: {
    title: easterEggHuntPageTitle,
    description: easterEggHuntPageDescription,
    tags: ["easter egg", "matrix"],
    authors: [],
    date: { year: 2026, month: 7, day: 17, formatted: "2026-07-17" },
    image: siteMetadata.featuredImage,
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
