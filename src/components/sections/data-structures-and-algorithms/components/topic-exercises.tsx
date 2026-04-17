import { getAllExercisesForTopic } from "@/lib/content/data-structures-and-algorithms";
import { FC } from "react";
import { ExerciseTable } from "./exercise-table";

interface TopicExercisesProps {
    topic: string;
}

export const TopicExercises: FC<TopicExercisesProps> = ({ topic }) => {
    const exercises = getAllExercisesForTopic(topic);

    if (exercises.length === 0) return null;

    return <ExerciseTable exercises={exercises} markdownId={topic} />;
};
