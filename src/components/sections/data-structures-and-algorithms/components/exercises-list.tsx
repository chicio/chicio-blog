import {
  getAllDataStructuresAndAlgorithmsTopics,
  getAllExercises,
} from "@/lib/content/data-structures-and-algorithms";
import { Content } from "@/types/content/content";
import { ExerciseMetadata } from "@/types/content/data-structures-and-algorithms";
import { FC } from "react";
import { Markdown } from "../../../design-system/atoms/typography/markdown";
import { difficultyColor } from "./difficulty-color";

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
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th className="w-2/5">Exercise</th>
                    <th>Difficulty</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {topicExercises.map((exercise) => (
                    <tr key={exercise.slug.formatted}>
                      <td className="w-2/5">
                        <a href={exercise.slug.formatted}>
                          <strong>{exercise.frontmatter.title}</strong>
                        </a>
                      </td>
                      <td>
                        <span className={`font-semibold ${difficultyColor[exercise.frontmatter.metadata?.difficulty ?? "Easy"]}`}>
                          {exercise.frontmatter.metadata?.difficulty}
                        </span>
                      </td>
                      <td>
                        <Markdown content={exercise.frontmatter.description} id={`${topicKey}-description`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </>
  );
};
