import { getAboutMe } from "./about-me/about-me";
import {
  getAllDataStructuresAndAlgorithmsTopics,
  getAllExercises,
  getDataStructuresAndAlgorithmsRoadmap,
  getExercisesContent,
} from "./data-structures-and-algorithms/data-structures-and-algorithms";
import { getPosts } from "./posts/posts";
import { getAllConsoles, getAllGames } from "./videogames/videogames";

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
