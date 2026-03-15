import {
  getAllDataStructuresAndAlgorithmsTopics,
  getAllExercises,
} from "@/lib/content/data-structures-and-algorithms";
import { Content } from "@/types/content/content";
import { FC } from "react";

export const Exercises: FC = () => {
  const exercises = getAllExercises();
  const topics = getAllDataStructuresAndAlgorithmsTopics();

  const exercisesByTopic = exercises.reduce(
    (acc, exercise) => {
      const topicKey = exercise.slug.params.topic;
      if (!acc[topicKey]) acc[topicKey] = [];
      acc[topicKey].push(exercise);
      return acc;
    },
    {} as Record<string, Content[]>,
  );

  return (
    <>
      {Object.entries(exercisesByTopic).map(([topicKey, topicExercises]) => {
        const topic = topics.find((t) => t.slug.params.topic === topicKey);
        return (
          <div key={topicKey}>
            <h2>{topic?.frontmatter.title ?? topicKey}</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th className="w-2/5">Exercise</th>
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
                      <td>{exercise.frontmatter.description}</td>
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
