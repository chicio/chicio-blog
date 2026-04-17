import { Content } from "@/types/content/content";
import { ExerciseMetadata } from "@/types/content/data-structures-and-algorithms";
import { FC } from "react";
import { Markdown } from "../../../design-system/atoms/typography/markdown";
import { difficultyColor } from "./difficulty-color";

interface ExerciseTableProps {
    exercises: Content<ExerciseMetadata>[];
    markdownId: string;
}

export const ExerciseTable: FC<ExerciseTableProps> = ({ exercises, markdownId }) => (
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
                {exercises.map((exercise) => (
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
                            <Markdown content={exercise.frontmatter.description} id={`${markdownId}-description`} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
