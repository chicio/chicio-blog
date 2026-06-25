import { ExerciseMetadata } from "@/types/content/data-structures-and-algorithms";

export const difficultyColor: Record<ExerciseMetadata["difficulty"], string> = {
    Easy: "text-green-500",
    Medium: "text-amber-500",
    Hard: "text-red-500",
};
