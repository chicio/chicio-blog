import { getAllExercisesForTopic } from "@/lib/content/data-structures-and-algorithms";
import { FC } from "react";

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
                        <th>Technique</th>
                        <th>Solution</th>
                    </tr>
                </thead>
                <tbody>
                    {exercises.map((exercise) => (
                        <tr key={exercise.slug.formatted}>
                            <td>
                                <a href={exercise.frontmatter.metadata?.leetcodeUrl} target="_blank" rel="noopener noreferrer">
                                    {exercise.frontmatter.title}
                                </a>
                            </td>
                            <td>{exercise.frontmatter.metadata?.technique}</td>
                            <td>
                                <a href={exercise.slug.formatted}>Solution</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
