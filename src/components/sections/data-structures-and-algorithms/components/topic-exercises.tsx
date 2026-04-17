import { getAllExercisesForTopic } from "@/lib/content/data-structures-and-algorithms";
import { FC } from "react";

interface TopicExercisesProps {
    topic: string;
}

export const TopicExercises: FC<TopicExercisesProps> = ({ topic }) => {
    const exercises = getAllExercisesForTopic(topic);

    if (exercises.length === 0) return null;

    return (
        <ul>
            {exercises.map((exercise) => (
                <li key={exercise.slug.formatted}>
                    <a href={exercise.slug.formatted}>{exercise.frontmatter.title}</a>
                </li>
            ))}
        </ul>
    );
};
