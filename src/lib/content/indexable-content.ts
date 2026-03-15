import { getAboutMe } from "./about-me";
import {
  getAllDataStructuresAndAlgorithmsTopics,
  getAllExercises,
  getDataStructuresAndAlgorithmsRoadmap,
  getExercisesContent,
} from "./data-structures-and-algorithms";
import { getPosts } from "./posts";
import { getAllConsoles, getAllGames } from "./videogames";

export const getIndexableContent = () => [
  ...getPosts(),
  ...getAllDataStructuresAndAlgorithmsTopics(),
  ...getAllExercises(),
  ...getAllConsoles(),
  ...getAllGames(),
  getDataStructuresAndAlgorithmsRoadmap(),
  getExercisesContent(),
  getAboutMe(),
];
