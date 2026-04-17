import { getAllExercisesForTopic } from "@/lib/content/data-structures-and-algorithms";
import { ExerciseMetadata } from "@/types/content/data-structures-and-algorithms";
import { FC } from "react";

interface TopicExercisesProps {
    topic: string;
}

const difficultyColor: Record<ExerciseMetadata["difficulty"], string> = {
    Easy: "text-green-500",
    Medium: "text-amber-500",
    Hard: "text-red-500",
};

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
