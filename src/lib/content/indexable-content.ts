import { getAboutMe } from "./about-me";
import { getAllDataStructuresAndAlgorithmsTopics, getDataStructuresAndAlgorithmsRoadmap } from "./data-structures-and-algorithms";
import { getPosts } from "./posts";
import { getAllConsoles, getAllGames } from "./videogames";

export const getIndexableContent = () => [
  ...getPosts(),
  ...getAllDataStructuresAndAlgorithmsTopics(),
  ...getAllConsoles(),
  ...getAllGames(),
  getDataStructuresAndAlgorithmsRoadmap(),
  getAboutMe(),
];
