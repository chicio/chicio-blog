import {
    getAllDataStructuresAndAlgorithmsTopics,
    getAllExercises,
    getAllExercisesForTopic,
    getDataStructuresAndAlgorithmsRoadmap,
    getDataStructuresAndAlgorithmsTopic,
    getExercise,
    getExercisesContent,
} from "@/lib/content/data-structures-and-algorithms/data-structures-and-algorithms";
import { markdownDocument } from "@/lib/mdx/markdown-document";
import { mdxToMarkdown } from "@/lib/mdx/mdx-to-markdown";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";

export const dsaMarkdown = (): string => {
    const topics = getAllDataStructuresAndAlgorithmsTopics();

    const body = `## Topics

${topics.map((topic) => `- [${topic.frontmatter.title}](${siteMetadata.siteUrl}${topic.slug.formatted}) — ${topic.frontmatter.description}`).join("\n")}
`;

    return markdownDocument({
        title: `Data Structures & Algorithms — ${siteMetadata.title}`,
        description: "A structured course covering fundamental data structures, algorithms, and problem-solving techniques.",
        slug: slugs.dataStructuresAndAlgorithms.home,
        body,
    });
};

export const dsaRoadmapMarkdown = (): string => {
    const roadmap = getDataStructuresAndAlgorithmsRoadmap();

    return markdownDocument({
        title: roadmap.frontmatter.title,
        description: roadmap.frontmatter.description,
        slug: slugs.dataStructuresAndAlgorithms.roadmap,
        body: mdxToMarkdown(roadmap.content),
    });
};

export const dsaExercisesListMarkdown = (): string => {
    const exercisesContent = getExercisesContent();
    const exercises = getAllExercises();

    const body = `## All Exercises (${exercises.length})

${exercises.map((e) => `- [${e.frontmatter.title}](${siteMetadata.siteUrl}${e.slug.formatted}) — ${e.frontmatter.metadata?.difficulty ?? "unknown"}, ${e.frontmatter.metadata?.technique ?? "unknown"}`).join("\n")}
`;

    return markdownDocument({
        title: exercisesContent.frontmatter.title,
        description: exercisesContent.frontmatter.description,
        slug: slugs.dataStructuresAndAlgorithms.exercises,
        body,
    });
};

export const dsaTopicMarkdown = (params: Record<string, string>): string | null => {
    const topic = getDataStructuresAndAlgorithmsTopic(params);

    if (!topic) {
        return null;
    }

    const exercises = getAllExercisesForTopic(params.topic);

    const body = `**Tags:** ${topic.frontmatter.tags.join(", ")}

${mdxToMarkdown(topic.content)}
${exercises.length > 0 ? `
## Exercises

${exercises.map((e) => `- [${e.frontmatter.title}](${siteMetadata.siteUrl}${e.slug.formatted}) — ${e.frontmatter.metadata?.difficulty ?? "unknown"}, ${e.frontmatter.metadata?.technique ?? "unknown"}`).join("\n")}
` : ""}`;

    return markdownDocument({
        title: topic.frontmatter.title,
        description: topic.frontmatter.description,
        slug: topic.slug.formatted,
        body,
    });
};

export const dsaExerciseMarkdown = (params: Record<string, string>): string | null => {
    const exercise = getExercise(params);

    if (!exercise) {
        return null;
    }

    const { frontmatter, content, slug } = exercise;

    const body = `**Difficulty:** ${frontmatter.metadata?.difficulty ?? "unknown"}
**Technique:** ${frontmatter.metadata?.technique ?? "unknown"}
**Tags:** ${frontmatter.tags.join(", ")}
${frontmatter.metadata?.leetcodeUrl ? `**LeetCode:** ${frontmatter.metadata.leetcodeUrl}` : ""}

${mdxToMarkdown(content)}
`;

    return markdownDocument({
        title: frontmatter.title,
        description: frontmatter.description,
        slug: slug.formatted,
        body,
    });
};
