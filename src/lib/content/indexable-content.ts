import { getAboutMe } from "./about-me";
import { getAllDataStructuresAndAlgorithmsTopics, getDataStructuresAndAlgorithmsRoadmap } from "./data-structures-and-algorithms";
import { getPosts } from "./posts";

export const getIndexableContent = () => [
  ...getPosts(),
  ...getAllDataStructuresAndAlgorithmsTopics(),
  getDataStructuresAndAlgorithmsRoadmap(),
  getAboutMe(),
];
