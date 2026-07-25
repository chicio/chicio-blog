import {
    topics,
    exercises,
    getAllExercisesForTopic,
    dsaRoadmap,
    dsaExercisesList,
} from "@/lib/content/data-structures-and-algorithms/data-structures-and-algorithms";
import { contentItemMarkdown } from "@/lib/mdx/content-item-markdown";
import { markdownDocument } from "@/lib/mdx/markdown-document";
import { mdxToMarkdown } from "@/lib/mdx/mdx-to-markdown";
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

export const dsaRoadmapMarkdown = (): string => {
    const roadmap = dsaRoadmap.single()!;

    return markdownDocument({
        title: roadmap.frontmatter.title,
        description: roadmap.frontmatter.description,
        slug: slugs.dataStructuresAndAlgorithms.roadmap,
        body: mdxToMarkdown(roadmap.content),
    });
};

export const dsaExercisesListMarkdown = (): string => {
    const exercisesContent = dsaExercisesList.single()!;
    const allExercises = exercises.list();

    const body = `## All Exercises (${allExercises.length})

${allExercises.map((e) => `- [${e.frontmatter.title}](${siteMetadata.siteUrl}${e.slug.formatted}) — ${e.frontmatter.metadata?.difficulty ?? "unknown"}, ${e.frontmatter.metadata?.technique ?? "unknown"}`).join("\n")}
`;

    return markdownDocument({
        title: exercisesContent.frontmatter.title,
        description: exercisesContent.frontmatter.description,
        slug: slugs.dataStructuresAndAlgorithms.exercises,
        body,
    });
};

export const dsaTopicMarkdown = contentItemMarkdown(topics, (topic) => {
    const topicExercises = getAllExercisesForTopic(topic.slug.params.topic);

    return `**Tags:** ${topic.frontmatter.tags.join(", ")}

${mdxToMarkdown(topic.content)}
${topicExercises.length > 0 ? `
## Exercises

${topicExercises.map((e) => `- [${e.frontmatter.title}](${siteMetadata.siteUrl}${e.slug.formatted}) — ${e.frontmatter.metadata?.difficulty ?? "unknown"}, ${e.frontmatter.metadata?.technique ?? "unknown"}`).join("\n")}
` : ""}`;
});

export const dsaExerciseMarkdown = contentItemMarkdown(
    exercises,
    ({ frontmatter, content }) => `**Difficulty:** ${frontmatter.metadata?.difficulty ?? "unknown"}
**Technique:** ${frontmatter.metadata?.technique ?? "unknown"}
**Tags:** ${frontmatter.tags.join(", ")}
${frontmatter.metadata?.leetcodeUrl ? `**LeetCode:** ${frontmatter.metadata.leetcodeUrl}` : ""}

${mdxToMarkdown(content)}
`,
);
