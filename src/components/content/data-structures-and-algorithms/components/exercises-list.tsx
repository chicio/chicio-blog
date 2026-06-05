import {
  getAllDataStructuresAndAlgorithmsTopics,
  getAllExercises,
} from "@/lib/content/data-structures-and-algorithms/data-structures-and-algorithms";
import { Content } from "@/types/content/content";
import { ExerciseMetadata } from "@/types/content/data-structures-and-algorithms";
import { FC } from "react";
import { ExerciseTable } from "./exercise-table";

export const ExercisesList: FC = () => {
  const exercises = getAllExercises();
  const topics = getAllDataStructuresAndAlgorithmsTopics();

  const exercisesByTopic = exercises.reduce(
    (acc, exercise) => {
      const topicKey = exercise.slug.params.topic;
      if (!acc[topicKey]) acc[topicKey] = [];
      acc[topicKey].push(exercise);
      return acc;
    },
    {} as Record<string, Content<ExerciseMetadata>[]>,
  );

  return (
    <>
      {topics
        .filter((topic) => exercisesByTopic[topic.slug.params.topic])
        .map((topic) => {
        const topicKey = topic.slug.params.topic;
        const topicExercises = exercisesByTopic[topicKey];
        return (
          <div key={topicKey}>
            <h2>{topic.frontmatter.title}</h2>
            <ExerciseTable exercises={topicExercises} markdownId={topicKey} />
          </div>
        );
      })}
    </>
  );
};
