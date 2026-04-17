import { getAllExercisesForTopic } from "@/lib/content/data-structures-and-algorithms";
import { FC } from "react";
import { difficultyColor } from "./difficulty-color";

interface TopicExercisesProps {
    topic: string;
}

export const TopicExercises: FC<TopicExercisesProps> = ({ topic }) => {
    const exercises = getAllExercisesForTopic(topic);

    if (exercises.length === 0) return null;

    return (
        <div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Exercise</th>
                        <th>Difficulty</th>
                    </tr>
                </thead>
                <tbody>
                    {exercises.map((exercise) => (
                        <tr key={exercise.slug.formatted}>
                            <td>
                                <a href={exercise.slug.formatted}>
                                    {exercise.frontmatter.title}
                                </a>
                            </td>
                            <td>
                                <span className={`font-semibold ${difficultyColor[exercise.frontmatter.metadata?.difficulty ?? "Easy"]}`}>
                                    {exercise.frontmatter.metadata?.difficulty}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
