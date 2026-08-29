import {
    topics,
    exercises,
    getAllExercisesForTopic,
    dsaExercisesList,
} from "@/lib/content/data-structures-and-algorithms/data-structures-and-algorithms";
import { contentBodyMarkdown } from "@/lib/mdx/content-body-markdown";
import { contentItemMarkdown } from "@/lib/mdx/content-item-markdown";
import { markdownDocument } from "@/lib/mdx/markdown-document";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";

export const dsaMarkdown = (): string => {
    const allTopics = topics.list();

    const body = `## Topics

${allTopics.map((topic) => `- [${topic.frontmatter.title}](${siteMetadata.siteUrl}${topic.slug.formatted}) — ${topic.frontmatter.description}`).join("\n")}
`;

    return markdownDocument({
        title: `Data Structures & Algorithms — ${siteMetadata.title}`,
        description: "A structured course covering fundamental data structures, algorithms, and problem-solving techniques.",
        slug: slugs.dataStructuresAndAlgorithms.home,
        body,
    });
};

export const dsaExercisesListMarkdown = contentItemMarkdown(dsaExercisesList, () => {
    const allExercises = exercises.list();

    return `## All Exercises (${allExercises.length})

${allExercises.map((e) => `- [${e.frontmatter.title}](${siteMetadata.siteUrl}${e.slug.formatted}) — ${e.frontmatter.metadata?.difficulty ?? "unknown"}, ${e.frontmatter.metadata?.technique ?? "unknown"}`).join("\n")}
`;
});

export const dsaTopicMarkdown = contentItemMarkdown(topics, (topic) => {
    const topicExercises = getAllExercisesForTopic(topic.slug.params.topic);

    return `**Tags:** ${topic.frontmatter.tags.join(", ")}

${contentBodyMarkdown(topic)}
${topicExercises.length > 0 ? `
## Exercises

${topicExercises.map((e) => `- [${e.frontmatter.title}](${siteMetadata.siteUrl}${e.slug.formatted}) — ${e.frontmatter.metadata?.difficulty ?? "unknown"}, ${e.frontmatter.metadata?.technique ?? "unknown"}`).join("\n")}
` : ""}`;
});

export const dsaExerciseMarkdown = contentItemMarkdown(
    exercises,
    (exercise) => `**Difficulty:** ${exercise.frontmatter.metadata?.difficulty ?? "unknown"}
**Technique:** ${exercise.frontmatter.metadata?.technique ?? "unknown"}
**Tags:** ${exercise.frontmatter.tags.join(", ")}
${exercise.frontmatter.metadata?.leetcodeUrl ? `**LeetCode:** ${exercise.frontmatter.metadata.leetcodeUrl}` : ""}

${contentBodyMarkdown(exercise)}
`,
);
