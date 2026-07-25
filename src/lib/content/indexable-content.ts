import { aboutMe } from "./about-me/about-me";
import {
  topics,
  exercises,
  dsaRoadmap,
  dsaExercisesList,
} from "./data-structures-and-algorithms/data-structures-and-algorithms";
import { posts } from "./posts/posts";
import { consoles, games } from "./videogames/videogames";
import { easterEggHunt } from "./easter-eggs/easter-eggs";

export const getIndexableContent = () => [
  ...posts.list(),
  ...topics.list(),
  ...exercises.list(),
  ...consoles.list(),
  ...games.list(),
  dsaRoadmap.single()!,
  dsaExercisesList.single()!,
  aboutMe.single()!,
  easterEggHunt.single()!,
];
