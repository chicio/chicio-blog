import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { getAllExercises, getAllExercisesForTopic } from "@/lib/content/data-structures-and-algorithms";

export const registerGetDsaExercises = (server: McpServer): void => {
    server.registerTool(
        "get_dsa_exercises",
        {
            title: "Get DSA Exercises",
            description:
                "Returns Data Structures and Algorithms exercises, optionally filtered by topic slug and/or difficulty. " +
                "Get the topic slug from get_dsa_topics.",
            inputSchema: {
                topic: z.string().optional().describe("Topic slug to filter by (e.g. 'arrays', 'dynamic-programming')"),
                difficulty: z
                    .enum(["Easy", "Medium", "Hard"])
                    .optional()
                    .describe("Filter by difficulty level"),
            },
        },
        async ({ topic, difficulty }) => {
            const exercises = topic ? getAllExercisesForTopic(topic) : getAllExercises();
            const filtered = difficulty
                ? exercises.filter((e) => e.frontmatter.metadata?.difficulty === difficulty)
                : exercises;

            const result = filtered.map((exercise) => ({
                title: exercise.frontmatter.title,
                description: exercise.frontmatter.description,
                topic: exercise.slug.params.topic,
                exercise: exercise.slug.params.exercise,
                difficulty: exercise.frontmatter.metadata?.difficulty,
                technique: exercise.frontmatter.metadata?.technique,
                leetcodeUrl: exercise.frontmatter.metadata?.leetcodeUrl,
                date: exercise.frontmatter.date.formatted,
                url: `https://chicio.dev${exercise.slug.formatted}`,
            }));

            return {
                content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
            };
        },
    );
};
